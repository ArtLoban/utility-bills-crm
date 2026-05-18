# DataTable

Универсальный list-таблица компонент. URL — источник правды. Всё на клиенте (sorting / filtering / pagination через TanStack rowModels). i18n-агностичен для своих колонок: страница передаёт уже переведённые строки.

## Установка

### 1. Файлы

Скопировать содержимое в проект:

```
components/data-table/        ← всё из output/data-table/
components/cells/             ← всё из output/cells/
```

### 2. Зависимости

В проекте уже должны быть установлены:

- `@tanstack/react-table`
- `nuqs`
- `next-intl`
- `lucide-react`

Из shadcn/ui должны быть установлены примитивы (если каких-то нет — `npx shadcn@latest add <name>`):

- `table`
- `pagination`
- `select`
- `skeleton`
- `button`
- `dropdown-menu`

### 3. Provider для nuqs

В корневой layout (`app/layout.tsx`) обернуть приложение в `NuqsAdapter`:

```tsx
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
```

### 4. Переводы

Слить содержимое `messages.en.json` / `messages.uk.json` / `messages.ru.json` в соответствующие message-файлы в `messages/`.

## Использование

### Минимальный пример

```tsx
// app/(app)/payments/_components/payments-table.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/data-table";
import { AmountCell } from "@/components/cells/amount-cell";
import { DateCell } from "@/components/cells/date-cell";
import { ServiceCell, type TServiceType } from "@/components/cells/service-cell";

type TPayment = {
  id: string;
  paidAt: string; // ISO from server
  amount: number;
  serviceType: TServiceType;
  propertyName: string;
};

type TProps = {
  data: TPayment[];
  isFiltered: boolean;
};

export const PaymentsTable = ({ data, isFiltered }: TProps) => {
  const t = useTranslations("payments.list");

  const columns: ColumnDef<TPayment>[] = [
    {
      accessorKey: "paidAt",
      header: t("columns.date"),
      cell: ({ row }) => <DateCell value={row.original.paidAt} />,
      // accessor returns ISO string — default string sort works as chronological because of ISO format.
    },
    {
      accessorKey: "propertyName",
      header: t("columns.property"),
    },
    {
      accessorKey: "serviceType",
      header: t("columns.service"),
      cell: ({ row }) => <ServiceCell type={row.original.serviceType} />,
      enableSorting: false,
    },
    {
      accessorKey: "amount",
      header: t("columns.amount"),
      cell: ({ row }) => <AmountCell value={row.original.amount} kind="payment" />,
      meta: { align: "right" },
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => <PaymentRowActions paymentId={row.original.id} />,
      meta: { align: "right", width: 48 },
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      emptyState={<PaymentsEmptyState />}
      filteredEmptyState={<PaymentsFilteredEmptyState />}
      isFiltered={isFiltered}
      defaultSorting={[{ id: "paidAt", desc: true }]}
    />
  );
};
```

### Per-feature row actions

```tsx
// features/payments/payment-row-actions.tsx
"use client";

import { useTranslations } from "next-intl";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { RowActions, type TRowAction } from "@/components/cells/row-actions";
import { useModals } from "@/lib/modals"; // your global modal store

type TProps = { paymentId: string };

export const PaymentRowActions = ({ paymentId }: TProps) => {
  const t = useTranslations("payments.actions");
  const modals = useModals();

  const items: TRowAction[] = [
    {
      label: t("view"),
      icon: <Eye size={14} />,
      onSelect: () => modals.open("payment-view", { id: paymentId }),
    },
    {
      label: t("edit"),
      icon: <Pencil size={14} />,
      onSelect: () => modals.open("payment-edit", { id: paymentId }),
    },
    { kind: "separator" },
    {
      label: t("delete"),
      icon: <Trash2 size={14} />,
      destructive: true,
      onSelect: () => modals.open("payment-delete", { id: paymentId }),
    },
  ];

  return <RowActions items={items} triggerLabel={t("triggerLabel")} />;
};
```

`DataTable` про modal store ничего не знает. Это ровно та граница, которую мы хотели.

### Filter state и `isFiltered`

Фильтры живут в URL отдельно от DataTable. Страница их читает (тем же `nuqs`), фильтрует массив, и сигнализирует `isFiltered`:

```tsx
// app/(app)/payments/page.tsx (RSC обёртка)
import { PaymentsTable } from "./_components/payments-table";
import { getAccessiblePayments } from "@/lib/db/queries/payments";
import { auth } from "@/lib/auth";

export default async function PaymentsPage() {
  const session = await auth();
  const payments = await getAccessiblePayments(session!.user.id);
  return <PaymentsClient initialData={payments} />;
}
```

```tsx
// app/(app)/payments/_components/payments-client.tsx
"use client";

import { useQueryStates, parseAsString } from "nuqs";
import { PaymentsTable } from "./payments-table";

export const PaymentsClient = ({ initialData }: { initialData: TPayment[] }) => {
  const [{ service, property }] = useQueryStates({
    service: parseAsString,
    property: parseAsString,
  });

  const filtered = initialData.filter(
    (p) => (!service || p.serviceType === service) && (!property || p.propertyId === property),
  );

  const isFiltered = Boolean(service || property);

  return <PaymentsTable data={filtered} isFiltered={isFiltered} />;
};
```

### `footerMeta` — агрегаты

```tsx
<DataTable
  data={filtered}
  columns={columns}
  emptyState={<PaymentsEmptyState />}
  footerMeta={
    <span className="text-muted-foreground text-sm">
      {t("totalPaid")}: <AmountCell value={total} kind="payment" />
    </span>
  }
/>
```

## URL-схема

| Param      | Формат                         | Пример              |
| ---------- | ------------------------------ | ------------------- |
| `page`     | 1-based integer                | `?page=3`           |
| `pageSize` | integer из `[10, 25, 50, 100]` | `?pageSize=50`      |
| `sort`     | `<columnId>.<asc\|desc>`       | `?sort=amount.desc` |

Несколько таблиц на одной странице:

```tsx
<DataTable
  {...}
  urlKeys={{ page: "billsPage", pageSize: "billsSize", sort: "billsSort" }}
/>
```

## Что внутри / снаружи

**Внутри:** отображение, пагинация, сортировка, loading skeleton, empty states (dispatch by `isFiltered`), URL sync.

**Снаружи (страница отвечает):** загрузка данных, переводы заголовков, фильтрация массива до передачи в `data`, filter bar UI, modal store, конкретные ячейки.

## Что НЕ делает

- Row selection / bulk operations (v2).
- Row click (все действия — через action-колонку).
- Column resizing / reordering.
- Sticky header.
- Virtualization (не нужно для 200–500 строк).
- Server-side sorting/filtering (переключатель `manualSorting/Filtering/Pagination: true` + соответствующее удаление rowModels — на случай v3 если упрёмся в объёмы).
