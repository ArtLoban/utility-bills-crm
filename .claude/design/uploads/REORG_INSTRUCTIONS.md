# Инструкция для нового чата — Реорганизация Utility Bills CRM

## Контекст проекта

Проект **Utility Bills CRM**. В корне (PAGES) уже лежит много готовых файлов: итерации дизайна (`Iteration 1.html` … `Iteration 7c settings-light.html`), лендинги (`Landing - Home.html`, `Landing - About.html`, `Landing - Project.html` + их dark-варианты), JSX-компоненты (`dashboard.jsx`, `bills-list.jsx`, `bills-mobile.jsx`, `service-detail.jsx`, `modal-bill.jsx`, `modal-contract.jsx`, `modal-reading.jsx`, `modal-sharing.jsx`, `header-states.jsx`, `sharing-tab.jsx`, `auth.jsx`, `screens.jsx`, `design-canvas.jsx`), готовая папка `screens/` с 10 админскими экранами, и собранная Design System (`Design System.html` + `design-system.css` + `design-system.js`).

> ⚠ **Важное правило: всё, что в корне — НЕ ТРОГАТЬ. Только читать как источник информации. Все новые файлы создавать в новых папках.**

## Цель

Навести порядок: создать структуру `landing/` + `crm/` + `admin/` + `design-system/`, где каждый раздел содержит отдельные standalone-страницы для каждого экрана.

## Целевая структура

```
landing/
  home.html
  home-dark.html
  about.html
  project.html
  project-dark.html

crm/
  components/         ← скопированные нужные JSX
    dashboard.jsx
    bills-list.jsx
    ...
  dashboard-light.html
  dashboard-dark.html
  dashboard-empty.html
  properties.html
  property-detail.html
  bills.html
  bills-mobile.html
  add-bill.html
  submit-reading.html
  service-detail-light.html
  service-detail-dark.html
  contract-update.html
  contract-history.html
  add-meter.html
  replace-meter.html
  settings-light.html
  ...

admin/
  dashboard.html
  properties-comparison.html
  property-soft-deleted.html
  property-detail-comparison.html
  hard-delete-modal.html
  users-list-light.html
  users-list-dark.html
  user-detail-light.html
  user-detail-dark.html
  user-detail-mobile.html

design-system/
  Design System.html
  design-system.css
  design-system.js
```

## Правила реорганизации (отвечены пользователем)

1. **Объём:** только «главные» экраны (~20–25 файлов в `crm/`), без всех состояний меню/тултипов. Header user-menu-open, language picker и пр. **не** выносим в отдельные файлы.
2. **Light/dark:** отдельные файлы (`dashboard-light.html`, `dashboard-dark.html`).
3. **Naming:** без номеров-префиксов, по смыслу (`dashboard.html`, `bills.html`).
4. **JSX-компоненты:** скопировать нужное в `crm/components/`, чтобы папка `crm/` была самодостаточной (HTML внутри `crm/` подключают JSX из `crm/components/`).
5. **Landing:** скопировать + переименовать в snake-case без префикса (`home.html`, `home-dark.html`, `about.html`, `project.html`, `project-dark.html`). Оригиналы в корне оставить.
6. **Design System:** скопировать `Design System.html` + `design-system.css` + `design-system.js` в `design-system/`. Внутри нового файла обновить пути к CSS/JS если они изменились (обычно остаются такими же — `design-system.css` рядом).
7. **Существующая `screens/`:** **не удалять** — оставить как есть. Файлы оттуда **скопировать** в `admin/`, переименовать в `dashboard.html`, `properties-comparison.html` и т.д. (убрать `01-`, `02-` префиксы и `admin-`-префиксы).

## Что откуда извлекать

### В `landing/` — копии из корня (renamed):

- `Landing - Home.html` → `landing/home.html`
- `Landing - Home Dark.html` → `landing/home-dark.html`
- `Landing - About.html` → `landing/about.html`
- `Landing - Project.html` → `landing/project.html`
- `Landing - Project Dark.html` → `landing/project-dark.html`

### В `crm/` — собрать standalone-страницы из артбордов итераций:

| Целевой файл в `crm/`       | Источник (артборд из корневого файла)                                                              |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| `dashboard-light.html`      | `Iteration 1.html` → `<Dashboard accentKey="violet"/>` (full data)                                 |
| `dashboard-empty.html`      | `Iteration 1.html` → `<EmptyDashboard/>`                                                           |
| `dashboard-dark.html`       | производный — взять `dashboard-light` и переключить на dark-токены (см. `header-states.jsx`)       |
| `properties.html`           | `Iteration 1.html` → `<PropertiesList/>` (with data)                                               |
| `property-detail.html`      | `Iteration 1.html` → `<PropertyDetail/>` (with services)                                           |
| `bills.html`                | `Iteration 2.html` → `<BillsList/>` (with data)                                                    |
| `bills-mobile.html`         | `Iteration 2.html` → `<BillsListMobile/>`                                                          |
| `add-bill.html`             | `Iteration 2.html` → `<AddBillFilled/>`                                                            |
| `submit-reading.html`       | `Iteration 2.html` → `<ReadingModal2ZoneFilled/>` (двухзонная заполненная — самая «полная» версия) |
| `service-detail-light.html` | `Iteration 3.html` → `<ServiceDetail/>`                                                            |
| `service-detail-dark.html`  | `Iteration 3.html` → `<ServiceDetailDark/>`                                                        |
| `contract-update.html`      | `Iteration 3.html` → `<UpdateContractModal/>`                                                      |
| `contract-history.html`     | `Iteration 3.html` → `<ContractHistoryArtboard/>`                                                  |
| `sharing.html`              | `Iteration 4` или `5` → sharing-tab + modal-sharing                                                |
| `add-meter.html`            | `Iteration 7b add-meter.html`                                                                      |
| `replace-meter.html`        | `Iteration 7b replace-meter.html`                                                                  |
| `settings-light.html`       | `Iteration 7c settings-light.html`                                                                 |
| `dashboard-print.html`      | `Dashboard-print.html` (копия)                                                                     |

### В `admin/` — копии из `screens/` (renamed):

- `screens/01-admin-dashboard.html` → `admin/dashboard.html`
- `screens/02-properties-comparison.html` → `admin/properties-comparison.html`
- `screens/03-admin-property-soft-deleted.html` → `admin/property-soft-deleted.html`
- `screens/04-property-detail-comparison.html` → `admin/property-detail-comparison.html`
- `screens/05-hard-delete-modal.html` → `admin/hard-delete-modal.html`
- `screens/06-admin-users-list-light.html` → `admin/users-list-light.html`
- `screens/07-admin-users-list-dark.html` → `admin/users-list-dark.html`
- `screens/08-admin-user-detail-light.html` → `admin/user-detail-light.html`
- `screens/09-admin-user-detail-dark.html` → `admin/user-detail-dark.html`
- `screens/10-admin-user-detail-mobile-light.html` → `admin/user-detail-mobile.html`

## Как делать standalone-страницу в `crm/`

Каждый HTML в `crm/` должен быть запускаемым «как есть». Шаблон:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>UB CRM — Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        min-height: 100%;
        background: #fff;
      }
      body {
        font-family: "Inter", system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      * {
        box-sizing: border-box;
      }
      button,
      input,
      textarea,
      select {
        font-family: inherit;
      }
    </style>
    <script
      src="https://unpkg.com/react@18.3.1/umd/react.development.js"
      integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"
      integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"
      integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y"
      crossorigin="anonymous"
    ></script>
  </head>
  <body>
    <div id="root"></div>

    <script type="text/babel" src="components/dashboard.jsx"></script>

    <script type="text/babel" data-presets="react">
      ReactDOM.createRoot(document.getElementById("root")).render(<Dashboard accentKey="violet" />);
    </script>
  </body>
</html>
```

— то есть **без** `<DesignCanvas>` и `<DCSection>` обёрток, **без** `<DCArtboard>` — просто компонент на полную страницу.

## Design system как «источник истины»

Перед началом работы агенту нужно открыть `Design System.html` и принять её как канон:

- **shadcn/ui · New York**
- **Zinc** neutrals (`#09090b` / `#71717a` / `#e4e4e7` / `#f4f4f5` / `#fafafa` / `#ffffff` + dark `#18181b` / `#27272a`)
- **Violet** primary `#7c3aed` (hover `#6d28d9`, tint `#f5f3ff` / `#ede9fe`), dark `#8b5cf6`
- **Amber** только для admin-хрома (`#f59e0b` line, `#d97706` solid, `#fef3c7` tint)
- **Inter** 400/500/600
- Иконки: inline SVG, stroke 1.75, lucide-style
- Радиус: 6 (button/input), 8 (card/modal), 9999 (pill)
- Тени: card `0 1px 2px rgba(24,24,27,.05)`, popover `0 8px 24px rgba(9,9,11,.12)`

**Drift, который НЕ переносим в `crm/`:**

- 7c primary button hover на `#18181b` — оставляем violet `#6d28d9`
- 7c card radius 10 — оставляем 8
- 7c аватар `#ddd6fe` — оставляем `#f5f3ff` / `#ede9fe`

Исключение — для `crm/settings-light.html` копируем 7c как есть (это и есть тот файл).

## Порядок действий для агента в новом чате

1. **Прочитать** `Design System.html` (или хотя бы пробежаться по `<h2>` секциям) — понять токены.
2. **Создать структуру папок:** `landing/`, `crm/`, `crm/components/`, `admin/`, `design-system/`.
3. **Скопировать в `design-system/`** все 3 файла (`Design System.html` + `.css` + `.js`).
4. **Скопировать в `landing/`** 5 landing-файлов с переименованием.
5. **Скопировать в `admin/`** 10 файлов из `screens/` с переименованием.
6. **Скопировать в `crm/components/`** нужные JSX: `dashboard.jsx`, `bills-list.jsx`, `bills-mobile.jsx`, `modal-bill.jsx`, `modal-reading.jsx`, `service-detail.jsx`, `modal-contract.jsx`, `modal-sharing.jsx`, `sharing-tab.jsx`, `header-states.jsx`.
7. **Создать standalone-страницы в `crm/`** по таблице выше (~17 файлов). Для каждой — прочитать соответствующий артборд в исходной итерации, понять какой компонент рендерится, и собрать минимальный HTML, который подключает JSX из `crm/components/` и рендерит этот компонент на полный экран.
8. **Создать `crm/dashboard-dark.html`** — взять `dashboard.jsx`, обернуть в dark-стилизованный контейнер (использовать dark-токены из `header-states.jsx` → `TOKENS.dark`).
9. **Сделать индексные файлы** для удобства навигации:
   - `landing/index.html` — ссылки на 5 страниц лендинга
   - `crm/index.html` — ссылки на все страницы CRM
   - `admin/index.html` — ссылки на 10 админских страниц
10. **Проверить** что каждая страница открывается без console errors. Использовать `done` для каждой или для одной репрезентативной.

## Что НЕ делаем

- Не трогаем файлы в корне (никаких edit, delete, rename).
- Не правим оригинальные JSX-компоненты — только копируем их.
- Не пытаемся «улучшить» дизайн при копировании — должна получиться буквально та же страница, что и артборд в исходнике.
- Не выносим состояния меню/dropdown/tooltip в отдельные файлы.

---

**Если по конкретному артборду что-то непонятно — задай вопрос, не угадывай.**
