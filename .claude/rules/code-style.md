# Code style conventions

## Type aliases — T-prefix

All named type aliases use a `T` prefix:

```ts
// correct
type TUser = typeof users.$inferSelect;
type TBillFormProps = { amount: number };

// wrong
type User = ...;
type BillFormProps = ...;
```

Exceptions: inline types in function signatures, props defined directly on component parameter.
Do NOT rewrite `components/ui/` — that's shadcn territory.

## Functions — arrow vs declaration

Use arrow functions for all custom utilities, hooks, helpers, and non-page/layout components:

```ts
// correct
const formatCurrency = (amount: number): string => { ... };
const useSession = () => { ... };
const UserAvatar = ({ name }: TUserAvatarProps) => <img ... />;

// wrong
function formatCurrency(amount: number): string { ... }
```

Exceptions: `page.tsx` and `layout.tsx` files use `export default function` declarations — matches Next.js idiom.
