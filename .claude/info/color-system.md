# Color system — best practices

## Единственный правильный подход

В production-проекте 2025 года цвета живут как CSS custom properties в одном файле.
Компоненты ссылаются на переменные — никогда не хардкодят значения.

Именно так устроены shadcn/ui, Radix, Linear, Vercel и все серьёзные дизайн-системы.

**Три гарантии которые это даёт:**

- **Одно место для изменения** — меняешь значение переменной, вся система обновляется.
- **Тёмная тема бесплатно** — переопределяешь переменные в `.dark {}`, ни один компонент не трогаешь.
- **Согласованность** — цвета имеют семантические имена, а не произвольные hex-значения.

---

## Как выглядит правильно

**`globals.css` — единственное место где живут значения:**

```css
:root {
  --service-electricity: #f59e0b;
  --service-gas: #ef4444;
  --service-cold-water: #3b82f6;
}

.dark {
  --service-electricity: #fbbf24; /* светлее для тёмного фона */
}
```

**JS-константы ссылаются на переменные, не хранят значения:**

```ts
// features/services/service-type.ts
export const SERVICE_TYPE_COLORS: Record<TServiceTypeCode, string> = {
  electricity: "var(--service-electricity)",
  gas: "var(--service-gas)",
} as const;
```

Компонент остаётся неизменным при смене темы. Браузер делает всю работу.

---

## `color-mix()` вместо `${color}1A`

Трюк с hex-суффиксом `1A` (≈10% opacity) работает только с 6-символьным hex.
При передаче `oklch(...)`, `hsl(...)` или `var(--...)` — тихо ломается без ошибки.

Правильный подход — `color-mix()`:

```ts
// неправильно — только hex, тихое падение с CSS vars
style={{ background: `${color}1A` }}

// правильно — работает с любым CSS-форматом
style={{ background: `color-mix(in srgb, ${color} 10%, transparent)` }}
```

`color-mix()` поддерживается во всех современных браузерах (Chrome 111+, Firefox 113+, Safari 16.2+).

---

## SVG и `var()` — работает end-to-end

Ранее считалось, что `var()` не резолвится в SVG presentation attributes, поэтому Recharts якобы
обязан получать hex. На практике этого ограничения у нас нет: современные браузеры резолвят
`var()` и в `fill`/`stroke`, и через shadcn-обёртку графика.

```tsx
// работает — var() прямо в SVG-атрибуте
<Line stroke="var(--service-electricity)" />

// работает — shadcn ChartContainer инжектит --color-<key> из chartConfig,
// а марки ссылаются на него
<Line stroke={`var(--color-${key})`} />
```

Доказательство в коде: single-zone consumption-chart прокидывает `var(--service-*)` прямо в
`stroke` и рендерится корректно. Поэтому hex-зеркала не нужны — сервис-, зон- и series-цвета
идут в графики как `var(--…)` из единого источника (`tokens.css`), без ручной синхронизации.
