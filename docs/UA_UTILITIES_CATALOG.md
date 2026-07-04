# Ukrainian Utility Bills — Domain Catalog (Kyiv Reference)

> Domain research artifact. Captures the real-world structure of household utility services, providers, tariffs, and bill anatomy in Ukraine, using Kyiv as the reference city. Sources: NKREKP (national regulator), Cabinet of Ministers resolutions, provider websites, verified as of July 2026. This document is the factual basis for the demo dataset and for data-model gap analysis.

## 1. Regulatory Landscape

Utility pricing in Ukraine is split between national and municipal regulation. NKREKP (the national energy and utilities regulator) sets tariffs for electricity distribution, gas distribution, and water utilities. The Cabinet of Ministers fixes household electricity and gas prices through the PSO mechanism (public service obligations). Municipal executive committees set tariffs for heat, waste collection, and approve building maintenance rates.

Martial law overlays (active since Feb 2022, still in force as of July 2026):

- **Tariff moratorium** (Law №2479-IX): heat, hot water, gas distribution, and water tariffs for households are frozen at pre-invasion levels for the duration of martial law + 6 months. Kyiv water and heat tariffs have not changed since January 2022 / 2019 respectively.
- **Penalty moratorium** (CMU Resolution №206): originally nationwide; lifted from 01.01.2024 (CMU №1405). Late-payment penalties (пеня) are again legal, **except** in communities on the official list of combat territories (active or possible hostilities), where they remain prohibited.
- Electricity and gas household prices are not frozen but are fixed by PSO decisions with explicit validity windows.

## 2. Service Catalog

### 2.1 Electricity (metered, kWh, zoned)

| Attribute                   | Value                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------- |
| Supplier (Kyiv)             | YASNO (TOV "Kyivski Enerhetychni Posluhy")                                                              |
| Grid operator               | DTEK Kyiv Electric Networks                                                                             |
| Tariff                      | **4.32 UAH/kWh** (incl. VAT), fixed since 01.06.2024 (CMU №632), extended through **31.10.2026**        |
| Previous tariff             | 2.64 UAH/kWh (until 31.05.2024) — a +64% step                                                           |
| Two-zone meter              | night 23:00–07:00 at 0.5× = **2.16 UAH/kWh**                                                            |
| Three-zone meter            | peak 1.5×, day 1.0×, night 0.4× (standard NKREKP coefficients)                                          |
| Electric-heating households | **2.64 UAH/kWh up to 2,000 kWh/month**, heating season only (Oct 1 – Apr 30); above the cap — full 4.32 |
| Readings                    | customer-reported monthly, typically around the 1st of the month                                        |
| Payment due                 | by the 20th of the following month                                                                      |

### 2.2 Natural gas — supply (metered, m³)

| Attribute             | Value                                                                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dominant supplier     | Naftogaz of Ukraine ("Fixed" plan) — ~98% of households (12.5M)                                                                                             |
| Tariff                | **7.96 UAH/m³** (incl. VAT), unchanged since May 2021; current fixation window 01.05.2026 – 30.04.2027                                                      |
| Alternative suppliers | market offers 7.96–9.99 UAH/m³ (Ternopiloblhaz Zbut 7.96, Prykarpat Enerho Trade 7.98, OKKO Kontrakt 7.99, Lvivenerhozbut 8.20, YASNO 8.46, SvitloGaz 9.99) |
| Readings              | customer-reported, typically by the 5th of the following month                                                                                              |
| Payment due           | by the 25th of the following month                                                                                                                          |

### 2.3 Natural gas — distribution / delivery (fixed monthly fee)

A **separate bill from a separate company** — the regional gas distribution operator (Kyiv: Gazmerezhi branch, formerly Kyivgaz). The fee is not consumption-of-the-month based: the annual distribution charge is derived from the customer's historical consumption and split into equal monthly payments. From 01.01.2026, the annual fee is calculated from actual consumption between 01.10.2024 and 30.09.2025. Distribution tariffs for households are frozen for martial law + 6 months.

Practical consequence: the monthly amount is flat within a calendar year and steps on January 1st — a natural yearly temporal tariff transition.

### 2.4 Cold water + drainage (metered, m³) — Kyivvodokanal

| Attribute                    | Value                                                                                                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Provider                     | PrJSC "AK Kyivvodokanal" (single bill for both components)                                                                                                                  |
| Combined tariff              | **30.384 UAH/m³**: 16.164 supply + 14.22 drainage (incl. VAT), unchanged since 01.01.2022                                                                                   |
| Subscription fee (абонплата) | separate fixed monthly line, independent of volume; regulatory cap 47.19 UAH per service (2026); typical ~23.52 UAH/month combined in buildings with a building-level meter |
| Drainage of hot water        | additionally billed by Kyivvodokanal at 14.22 UAH per m³ of **hot** water consumed — hot-water meter volume feeds a second company's bill                                   |
| Readings                     | submitted from the 10th to the last day of the month                                                                                                                        |
| No meter                     | normative billing per registered person                                                                                                                                     |

**Modeling note:** one bill = volume × tariff **+** fixed subscription fee. This "metered + standing charge" shape is the national norm for water, not a Kyiv quirk.

### 2.5 Hot water (metered, m³) — Kyivteploenergo

Tariff **97.89 UAH/m³** (incl. VAT), frozen for 6 consecutive years. Plus subscription fee ~22.31 UAH/month (buildings with commercial metering). Plus drainage per m³ billed separately by Kyivvodokanal (see 2.4). Summer planned maintenance outages (2–4 weeks) produce near-zero consumption months.

### 2.6 Heating (building-metered, Gcal) — Kyivteploenergo

Tariff **1,654.41 UAH/Gcal**, unchanged since 2019. Heat is metered at the **building** level; the cost is allocated to apartments proportionally to their floor area. The resident's bill is therefore a variable monthly amount (weather-dependent), zero outside the heating season (mid-Oct – mid-Apr). Buildings without meters are billed per m² by norms. For a typical 50 m² Kyiv apartment: ~0.3–0.5 Gcal in shoulder months, 1.2–1.5 Gcal in Dec–Feb (≈ 2,000–2,500 UAH peak).

**Modeling note:** from the resident's perspective this is neither cleanly "metered" (no in-apartment meter, no readings to submit) nor "fixed" (amount varies monthly and seasonally).

### 2.7 Building maintenance (утримання будинку) (fixed, per m²)

Set per building via the management contract (управитель / managing company; 10 municipal managing companies in Kyiv plus private ones). Priced in UAH per m² of apartment area per month; composition includes yard and stairwell cleaning, elevator maintenance, in-building engineering systems, lighting of common areas, and — in most Kyiv apartment buildings — **household waste removal**. Typical Kyiv range ~5–15 UAH/m²/month depending on building amenities (elevator, amenities class).

### 2.8 Waste collection (fixed)

In Kyiv apartment buildings, usually embedded in building maintenance rather than billed separately. Separate contracts exist in the private-house sector. In other cities it is commonly a standalone bill priced **per registered person per month** (e.g., Zaporizhzhia: TOV "Veltum-Zaporizhzhia") — a third pricing basis besides per-m³ and per-m².

### 2.9 Internet (fixed monthly)

Market service, unregulated pricing. Kyiv providers: Kyivstar Home (absorbed Volia in 2024–2025), Lanet, Triolan, Datagroup. Typical 200–400 UAH/month flat. Provider changes and plan migrations are frequent — a natural source of contract-change events.

### 2.10 Intercom (домофон) (fixed monthly)

Local service companies, ~30–60 UAH/month per apartment. Often paid quarterly or semi-annually in practice.

### 2.11 HOA fees / OSBB contributions (fixed, per m²)

In OSBB buildings (co-owners' association), the monthly co-owner contribution replaces the managing-company maintenance fee; priced per m². OSBBs may additionally levy one-off or temporary target contributions (repair fund, capital works) — irregular amounts outside the monthly pattern.

## 3. Anatomy of a Ukrainian Utility Bill

A typical monthly bill (paper or in the provider's app/portal) carries, per Law "On Housing and Communal Services":

| Line                               | Meaning                                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Особовий рахунок                   | Account number with the provider                                                                             |
| Period                             | Billing month                                                                                                |
| Previous / current reading, volume | For metered services                                                                                         |
| Нараховано                         | Charged for the period (volume × tariff, or fixed amount)                                                    |
| Перерахунок                        | Recalculation: ± adjustment for prior periods (corrected readings, service quality claims, norm adjustments) |
| Пільга                             | Statutory benefit discount (25–100% for eligible categories)                                                 |
| Субсидія                           | Housing subsidy (administered automatically by the Pension Fund)                                             |
| Борг / переплата                   | Opening balance: debt (+) or overpayment (−) carried from prior periods                                      |
| Пеня                               | Late-payment penalty (where legally applicable — see §4)                                                     |
| До сплати                          | Total due = charged ± recalculation − benefit − subsidy + opening debt + penalty                             |

Kyiv additionally has a consolidated bill option (ЦКС / GIOC "single bill") aggregating several services into one payment document with per-service breakdown.

## 4. Debt, Penalties, Enforcement (as of July 2026)

- Debts do not expire automatically; the 3-year limitation period for court claims was restored from September 2025 (Law №4434-IX) after being suspended during COVID and early martial law.
- Penalty (пеня) accrual is legal again since 01.01.2024, accrued per day of delay, capped at 100% of the debt; prohibited in combat-territory communities.
- Service disconnection for non-payment is again permitted outside combat territories; Kyivvodokanal actively disconnects debtors.
- Debt restructuring agreements (12–60 months installments) are available from providers.

## 5. Seasonality Profiles (demo-data basis)

Reference consumption for a 2-person, ~50 m² Kyiv apartment; scale by household:

| Service                         | Summer                        | Winter       | Notes                                       |
| ------------------------------- | ----------------------------- | ------------ | ------------------------------------------- |
| Electricity                     | 150–200 kWh                   | 220–300 kWh  | +blackout anomalies possible in 2024 months |
| Gas (cooking only)              | 6–10 m³                       | 8–15 m³      | mild seasonality                            |
| Gas (private-house heating)     | 5–15 m³                       | 150–350 m³   | extreme seasonality                         |
| Cold water                      | 4–6 m³                        | 4–6 m³       | flat                                        |
| Hot water                       | 2–4 m³ (zero in outage month) | 3–5 m³       | summer maintenance dip                      |
| Heating                         | 0                             | 0.3–1.5 Gcal | Oct–Apr only, Dec–Feb peak                  |
| Maintenance, internet, intercom | flat                          | flat         | fixed                                       |

Temporal events available inside a May 2024 → July 2026 demo window: electricity 2.64 → 4.32 on 01.06.2024; gas-distribution annual fee steps on 01.01.2025 and 01.01.2026; an internet provider change (Volia → Kyivstar migration) as a realistic contract transition; water/heat tariffs deliberately flat (moratorium) — itself a truthful pattern.

## 6. Gap Analysis vs. Current Data Model

1. **Standing charge on metered services.** Water and hot-water bills = volume × rate + fixed subscription fee. The current tariff constraint (`metered` XOR `fixed`) cannot express this. Candidate change: allow `fixedAmount` to coexist with `rateT1..T3` as a standing charge ("at least one" instead of XOR).
2. **Drainage (водовідведення).** Merged into the cold-water bill in Kyiv but a separate provider/bill in many cities; also applied to hot-water volumes across providers. Candidate catalog addition: `water_drainage`. Peculiarity: volumetric service without its own meter (volume derived from cold + hot water) — the current model ties readings to meters.
3. **Heating billing shape.** Building-metered, area-allocated, seasonal-variable. Currently modeled as `fixed`; manual bill entry works, but the expected-amount hint is misleading for heating outside a flat-fee arrangement.
4. **Per-person pricing basis.** Waste collection in several cities is priced per registered person — a third basis besides per-unit-metered and flat. No schema change required while bills are entered as totals; relevant for future expected-amount logic.
5. **Structured bill components.** Recalculation, benefit, subsidy, opening debt, penalty are first-class lines on real bills. Confirms the existing v4+ roadmap item ("structured bill components"); no MVP change.
6. **Irregular OSBB target contributions.** One-off levies outside the monthly cadence; representable today as ad-hoc bills, worth a note in user guidance.

## Sources

NKREKP (nerc.gov.ua), Cabinet of Ministers resolutions №632/2024, №206/2022, №1405/2023, Naftogaz (gas.ua), Kyivvodokanal (vodokanal.kiev.ua), Kyivteploenergo, Kyiv City Council (kyivcity.gov.ua), index.minfin.com.ua, sector press (TSN, Obozrevatel, Fakty) — verified July 2026.
