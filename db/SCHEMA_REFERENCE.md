# Schema Reference

> Quick lookup for the utility-bills CRM database schema.
> For design rationale and full architectural context, see `DATA_MODEL.md`.

## Global conventions (one-liners)

- **Naming:** `snake_case` in DB, `camelCase` in TS/Drizzle.
- **PK:** `uuid` via `gen_random_uuid()`, branded types in TS.
- **Timestamps:** `timestamptz` (UTC stored). `createdAt`, `updatedAt` on all tables. `deletedAt` for soft delete.
- **Nullability:** NOT NULL by default. NULL is always explicit.
- **Enums:** `text` + CHECK constraint, not native PostgreSQL enum.
- **Temporal:** `validFrom` (NOT NULL) + `validTo` (NULLable, NULL = current). Half-open `[validFrom, validTo)`.
- **Money:** `numeric(12,2)` for amounts, `numeric(12,4)` for rates, `numeric(12,3)` for meter values.
- **FKs:** `CASCADE` for owning rels, `RESTRICT` for lookups, `SET NULL` for optional refs.
- **Extension:** `btree_gist` (required for exclusion constraints).

---

## Tables at a glance

| Block | Table | Purpose |
|-------|-------|---------|
| 1 | `users` | Application users |
| 1 | `accounts` | OAuth provider accounts (Auth.js) |
| 1 | `sessions` | Active user sessions (Auth.js + custom policy) |
| 1 | `verification_tokens` | Auth.js (unused in MVP) |
| 2 | `properties` | Real estate objects |
| 2 | `property_access` | User ↔ Property with role |
| 3 | `service_types` | Fixed catalog of utility types |
| 3 | `services` | Service instances on properties |
| 4 | `providers` | User-owned provider directory |
| 4 | `contracts` | Agreement with provider (temporal) |
| 4 | `tariffs` | Rates within contract (temporal) |
| 4 | `account_numbers` | Account refs within contract (temporal) |
| 4 | `payment_details` | Payment info within contract (temporal) |
| 5 | `meters` | Physical meters on property (temporal) |
| 5 | `readings` | Meter readings |
| 6 | `bills` | Charges for a period |
| 6 | `payments` | Payments (ledger) |

---

## Block 1: Identity & Access

### `users`

```
id              uuid PK
name            text?
email           text NOT NULL UNIQUE
emailVerified   timestamptz?
image           text?
systemRole      text NOT NULL DEFAULT 'user'         -- 'user' | 'admin'
locale          text NOT NULL DEFAULT 'en'           -- 'en' | 'uk' | 'ru'
theme           text NOT NULL DEFAULT 'system'       -- 'light' | 'dark' | 'system'
timezone        text NOT NULL DEFAULT 'Europe/Kyiv'
createdAt       timestamptz NOT NULL DEFAULT now()
updatedAt       timestamptz NOT NULL DEFAULT now()
deletedAt       timestamptz?
```

**Indexes:** UNIQUE `email`, index `deletedAt`.

**Admin promotion:** via `ADMIN_EMAILS` env in Auth.js `signIn` callback. Idempotent & reversible.

---

### `accounts` (Auth.js)

```
userId                 uuid NOT NULL → users(id) CASCADE
type                   text NOT NULL
provider               text NOT NULL
providerAccountId      text NOT NULL
refreshToken           text?     -- 'refresh_token' in DB
accessToken            text?     -- 'access_token' in DB
expiresAt              bigint?   -- 'expires_at' in DB
tokenType              text?     -- 'token_type' in DB
scope                  text?
idToken                text?     -- 'id_token' in DB
sessionState           text?     -- 'session_state' in DB

PRIMARY KEY (provider, providerAccountId)
```

**Indexes:** index `userId`.

---

### `sessions` (Auth.js + extensions)

```
sessionToken       text PK
userId             uuid NOT NULL → users(id) CASCADE
expires            timestamptz NOT NULL
rememberMe         boolean NOT NULL DEFAULT false    -- extension
absoluteExpires    timestamptz?                       -- extension
```

**Indexes:** index `userId`, index `expires`.

**Policy:**
- Without rememberMe: `expires = now + 1h`, sliding.
- With rememberMe: `expires = min(now + 7d, absoluteExpires)`, `absoluteExpires = loginTime + 30d`.

---

### `verification_tokens` (Auth.js, empty in MVP)

```
identifier    text NOT NULL
token         text NOT NULL
expires       timestamptz NOT NULL

PRIMARY KEY (identifier, token)
```

---

## Block 2: Properties & Access Control

### `properties`

```
id          uuid PK
name        text NOT NULL
type        text NOT NULL                    -- 'apartment' | 'house' | 'cottage' | 'other'
address     text?
notes       text?
createdAt   timestamptz NOT NULL DEFAULT now()
updatedAt   timestamptz NOT NULL DEFAULT now()
deletedAt   timestamptz?
```

**Indexes:** index `deletedAt`.

**No `ownerId`.** Ownership via `property_access` only.

---

### `property_access`

```
id              uuid PK
propertyId      uuid NOT NULL → properties(id) CASCADE
userId          uuid NOT NULL → users(id) CASCADE
propertyRole    text NOT NULL                -- 'owner' | 'editor' | 'viewer'
grantedAt       timestamptz NOT NULL DEFAULT now()
grantedBy       uuid? → users(id) SET NULL
createdAt       timestamptz NOT NULL DEFAULT now()
updatedAt       timestamptz NOT NULL DEFAULT now()
deletedAt       timestamptz?
```

**Indexes:**
- UNIQUE partial `(propertyId, userId) WHERE deletedAt IS NULL`
- index `userId`, `propertyId`, `deletedAt`

**On property creation:** auto-insert row with `userId = creator`, `propertyRole = 'owner'`, `grantedBy = creator`.

---

## Block 3: Service Catalog & Services

### `service_types` (seeded, no UI in MVP)

```
id                  uuid PK
code                text NOT NULL UNIQUE
measurementType     text NOT NULL                -- 'metered' | 'fixed'
unit                text?                        -- 'kwh' | 'm3' | 'gcal', NULL for fixed
supportsZones       boolean NOT NULL DEFAULT false
sortOrder           integer NOT NULL DEFAULT 0
isActive            boolean NOT NULL DEFAULT true
createdAt           timestamptz NOT NULL DEFAULT now()
updatedAt           timestamptz NOT NULL DEFAULT now()
```

**Checks:**
- `(measurementType = 'metered') = (unit IS NOT NULL)`

**No `deletedAt`.** Retirement via `isActive = false`.

**Seed (11 types):** `electricity`, `gas`, `cold_water`, `hot_water`, `gas_delivery`, `heating`, `building_maintenance`, `garbage_collection`, `internet`, `intercom`, `hoa_fees`.

---

### `services`

```
id               uuid PK
propertyId       uuid NOT NULL → properties(id) CASCADE
serviceTypeId    uuid NOT NULL → service_types(id) RESTRICT
notes            text?
createdAt        timestamptz NOT NULL DEFAULT now()
updatedAt        timestamptz NOT NULL DEFAULT now()
deletedAt        timestamptz?
```

**Indexes:**
- UNIQUE partial `(propertyId, serviceTypeId) WHERE deletedAt IS NULL`
- index `propertyId`, `deletedAt`

---

## Block 4: Contracts & Temporal Attributes

### `providers`

```
id          uuid PK
name        text NOT NULL
website     text?
phone       text?
notes       text?
ownerId     uuid NOT NULL → users(id) CASCADE
createdAt   timestamptz NOT NULL DEFAULT now()
updatedAt   timestamptz NOT NULL DEFAULT now()
deletedAt   timestamptz?
```

**Indexes:** index `ownerId`, `deletedAt`.

**Per-user catalog.** Sharing works via JOIN through contracts.

---

### `contracts`

```
id             uuid PK
serviceId      uuid NOT NULL → services(id) CASCADE
providerId     uuid NOT NULL → providers(id) RESTRICT
validFrom      timestamptz NOT NULL
validTo        timestamptz?
notes          text?
createdAt      timestamptz NOT NULL DEFAULT now()
updatedAt      timestamptz NOT NULL DEFAULT now()
deletedAt      timestamptz?
```

**Indexes:** `(serviceId, validFrom)`, `providerId`, `deletedAt`.

**Exclusion constraint:**
```sql
EXCLUDE USING gist (
  service_id WITH =,
  tstzrange(valid_from, valid_to, '[)') WITH &&
) WHERE (deleted_at IS NULL)
```

---

### `tariffs`

```
id             uuid PK
contractId     uuid NOT NULL → contracts(id) CASCADE
rateT1         numeric(12,4)?       -- required for metered, NULL for fixed
rateT2         numeric(12,4)?
rateT3         numeric(12,4)?
fixedAmount    numeric(12,2)?       -- required for fixed, NULL for metered
validFrom      timestamptz NOT NULL
validTo        timestamptz?
notes          text?
createdAt      timestamptz NOT NULL DEFAULT now()
updatedAt      timestamptz NOT NULL DEFAULT now()
deletedAt      timestamptz?
```

**Checks:**
- `(rateT1 IS NOT NULL AND fixedAmount IS NULL) OR (rateT1 IS NULL AND rateT2 IS NULL AND rateT3 IS NULL AND fixedAmount IS NOT NULL)`
- rates > 0, fixedAmount >= 0

**Exclusion constraint:** same pattern as contracts, per `contractId`.

**Indexes:** `(contractId, validFrom)`, `deletedAt`.

---

### `account_numbers`

```
id             uuid PK
contractId     uuid NOT NULL → contracts(id) CASCADE
value          text NOT NULL
validFrom      timestamptz NOT NULL
validTo        timestamptz?
notes          text?
createdAt      timestamptz NOT NULL DEFAULT now()
updatedAt      timestamptz NOT NULL DEFAULT now()
deletedAt      timestamptz?
```

Same indexes/exclusion as tariffs.

---

### `payment_details`

```
id             uuid PK
contractId     uuid NOT NULL → contracts(id) CASCADE
details        text NOT NULL
validFrom      timestamptz NOT NULL
validTo        timestamptz?
notes          text?
createdAt      timestamptz NOT NULL DEFAULT now()
updatedAt      timestamptz NOT NULL DEFAULT now()
deletedAt      timestamptz?
```

Same indexes/exclusion as tariffs.

---

## Block 5: Meters & Readings

### `meters`

```
id               uuid PK
propertyId       uuid NOT NULL → properties(id) CASCADE
serviceTypeId    uuid NOT NULL → service_types(id) RESTRICT
serialNumber     text?
zoneCount        smallint NOT NULL DEFAULT 1        -- 1 | 2 | 3
installedAt      timestamptz?                        -- physical, informational
removedAt        timestamptz?                        -- physical, informational
validFrom        timestamptz NOT NULL                -- system temporal
validTo          timestamptz?                        -- system temporal
notes            text?
createdAt        timestamptz NOT NULL DEFAULT now()
updatedAt        timestamptz NOT NULL DEFAULT now()
deletedAt        timestamptz?
```

**Checks:**
- `zoneCount IN (1, 2, 3)`
- `removedAt > installedAt` when both present

**Exclusion constraint:**
```sql
EXCLUDE USING gist (
  property_id WITH =,
  service_type_id WITH =,
  tstzrange(valid_from, valid_to, '[)') WITH &&
) WHERE (deleted_at IS NULL)
```

**Indexes:** `(propertyId, serviceTypeId, validFrom)`, `deletedAt`.

---

### `readings`

```
id           uuid PK
meterId      uuid NOT NULL → meters(id) CASCADE
readAt       timestamptz NOT NULL
valueT1      numeric(12,3) NOT NULL
valueT2      numeric(12,3)?
valueT3      numeric(12,3)?
notes        text?
createdBy    uuid NOT NULL → users(id) SET NULL
createdAt    timestamptz NOT NULL DEFAULT now()
updatedAt    timestamptz NOT NULL DEFAULT now()
deletedAt    timestamptz?
```

**Checks:** values >= 0.

**Indexes:** `(meterId, readAt)`, `createdBy`, `deletedAt`.

**No exclusion** — multiple readings per day allowed.

---

## Block 6: Bills & Payments

### `bills`

```
id             uuid PK
serviceId      uuid NOT NULL → services(id) CASCADE
periodStart    date NOT NULL
periodEnd      date NOT NULL
periodMonth    date NOT NULL                    -- first day of the attribution month
amount         numeric(12,2) NOT NULL           -- UAH
notes          text?
createdBy      uuid NOT NULL → users(id) SET NULL
createdAt      timestamptz NOT NULL DEFAULT now()
updatedAt      timestamptz NOT NULL DEFAULT now()
deletedAt      timestamptz?
```

**Checks:**
- `amount >= 0`
- `periodEnd >= periodStart`
- `periodMonth` is first of month
- `periodMonth` overlaps `[periodStart, periodEnd]`

**Indexes:** `(serviceId, periodMonth)`, `(serviceId, periodStart, periodEnd)`, `createdBy`, `deletedAt`.

**No exclusion** — multiple bills per period allowed (recalcs, splits).

---

### `payments`

```
id           uuid PK
serviceId    uuid NOT NULL → services(id) CASCADE
paidAt       date NOT NULL
amount       numeric(12,2) NOT NULL              -- UAH
notes        text?
createdBy    uuid NOT NULL → users(id) SET NULL
createdAt    timestamptz NOT NULL DEFAULT now()
updatedAt    timestamptz NOT NULL DEFAULT now()
deletedAt    timestamptz?
```

**Checks:** `amount > 0`.

**Indexes:** `(serviceId, paidAt)`, `createdBy`, `deletedAt`.

**Ledger approach:** no FK to `bills`. Balance computed as `SUM(bills.amount) - SUM(payments.amount)`.

---

## Common query patterns

### Resolve accessible properties for a user

```sql
SELECT p.*
FROM properties p
JOIN property_access pa ON pa.property_id = p.id
WHERE pa.user_id = :userId
  AND pa.deleted_at IS NULL
  AND p.deleted_at IS NULL
```

### Active contract for a service at time T

```sql
SELECT *
FROM contracts
WHERE service_id = :serviceId
  AND valid_from <= :t
  AND (valid_to IS NULL OR valid_to > :t)
  AND deleted_at IS NULL
```

### Active tariff for a service at time T (joined)

```sql
SELECT t.*
FROM tariffs t
JOIN contracts c ON c.id = t.contract_id
WHERE c.service_id = :serviceId
  AND t.valid_from <= :t
  AND (t.valid_to IS NULL OR t.valid_to > :t)
  AND c.valid_from <= :t
  AND (c.valid_to IS NULL OR c.valid_to > :t)
  AND t.deleted_at IS NULL
  AND c.deleted_at IS NULL
```

### Balance for a service

```sql
SELECT
  (SELECT COALESCE(SUM(amount), 0) FROM bills    WHERE service_id = :sid AND deleted_at IS NULL)
  - (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE service_id = :sid AND deleted_at IS NULL)
  AS balance
```

### Monthly total per service

```sql
SELECT service_id, period_month, SUM(amount) AS billed
FROM bills
WHERE deleted_at IS NULL
GROUP BY service_id, period_month
ORDER BY period_month
```

---

## Application invariants (non-DB)

Not enforceable in schema. Must be covered by service-layer code and tests.

- At least one owner per property at all times.
- Only owners can grant/revoke/change roles.
- Owners cannot remove other owners.
- Tariff validity must fall within parent Contract validity.
- Reading `readAt` must fall within parent Meter validity.
- Tariff shape must match ServiceType measurementType.
- Meter `zoneCount` must respect ServiceType `supportsZones`.
- Reading zone values must match Meter `zoneCount`.
- Soft delete cascades via transaction (app-level).
- Hard delete requires prior soft delete (admin only).
- External Drive files never touched by our deletions.
