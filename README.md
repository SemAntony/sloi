# @sloi/ui-kit

Базовая библиотека UI-компонентов для проектов Sloi.

## Что уже есть

- Единый документ правил разработки: `UI_KIT_RULES.md`
- Сборка библиотеки через Vite (ESM + CJS)
- TypeScript + генерация `d.ts`
- Storybook для разработки и валидации компонентов
- ESLint
- Компоненты на базе Radix primitives
- FSD-структура слоёв (`app/shared/...`)
- Отдельный workspace-пакет токенов `@sloi/tokens` (`packages/tokens/src/*`)
- `src/app/styles/*` как compatibility-layer для UI-kit
- Стили компонентов через `SCSS modules` (`*.module.scss`)
- Шрифты не тянем из библиотеки: компоненты наследуют typography от проекта
- Внутренний слой Radix utilities (`src/shared/lib/radix`) для сборки наших компонентов
- Полный слой оберток над Radix primitives в `src/shared/ui/primitives/*`:
  `Accordion`, `AlertDialog`, `AspectRatio`, `Avatar`, `Checkbox`, `Collapsible`,
  `ContextMenu`, `Dialog`, `DropdownMenu`, `Form`, `HoverCard`, `Label`, `Menubar`,
  `NavigationMenu`, `OneTimePasswordField`, `PasswordToggleField`, `Popover`, `Progress`,
  `RadioGroup`, `ScrollArea`, `Select`, `Separator`, `Slider`, `Switch`, `Tabs`,
  `Toast`, `Toggle`, `ToggleGroup`, `Toolbar`, utilities
- Компоненты, которых нет в Radix, реализуем отдельно: `Button` (дальше `Table`, и т.д.)

## Архитектура дизайн-системы

- `Tokens`:
  `packages/tokens/src/palette.css` как raw-палитра и `packages/tokens/src/tokens.css` как семантический слой.
- `Components`:
  UI-обертки и примитивы в `src/shared/ui/*` и `src/shared/ui/primitives/*`.
- `Patterns`:
  композиции компонентов в stories, а затем в продуктовых фичах.
- `Documentation`:
  Storybook как единый источник примеров и правил.
  Базовая карта системы: `Foundations/Design System`, `Foundations/Colors`, `Foundations/Icons`.

## Stable Core Docs

- Карта документов: `docs/index.md`
- Governance: `docs/governance/*`
- Release: `docs/release/*`
- Adoption: `docs/adoption/*`
- Backlog: `docs/backlog/*`

## Быстрый старт

```bash
pnpm install
pnpm build
```

## Скрипты

- `pnpm dev` — локальная разработка
- `pnpm build` — сборка библиотеки
- `pnpm storybook` — запуск Storybook
- `pnpm storybook:build` — сборка статического Storybook
- `pnpm lint` — линт
- `pnpm typecheck` — проверка типов
- `pnpm test` — unit tests
- `pnpm test:a11y` — a11y tests
- `pnpm tokens:build` — сборка CSS/JSON/JS из DTCG-источника `packages/tokens/source/`
- `pnpm tokens:contrast` — проверка контраста токенов по WCAG 2.2 (light и dark)
- `pnpm adoption:metrics:ci` — локальный adoption-отчёт в `reports/adoption/latest.json`
- `pnpm changeset` — добавить changeset (описание изменения для следующего релиза)
- `pnpm version-packages` — собрать changeset'ы в версию и CHANGELOG (`changeset version`)
- `pnpm release` — сборка и публикация (`changeset publish`)

## Версии и релизы

Версии и `CHANGELOG.md` ведёт [Changesets](https://github.com/changesets/changesets). Версионируется только `@sloi/ui-kit`:
`@sloi/tokens` и `@sloi/headless-core` вшиваются в его бандл, поэтому они в `ignore` в `.changeset/config.json`,
а `@sloi/lit-wrappers` и приложения из `consumers/*` приватные. Базовая ветка: `develop`.

**Что делать в каждом PR с изменением, видимым потребителю** (код, стили, токены, публичные типы, поведение):

1. `pnpm changeset`, выбрать `@sloi/ui-kit` и тип изменения: `patch` (исправление), `minor` (новая возможность, `@deprecated`),
   `major` (ломающее изменение), и написать одну-две строки для потребителя.
2. Закоммитить созданный файл `.changeset/*.md` вместе с кодом. Для чисто внутренних правок (тесты, CI, документация)
   changeset не нужен; проверка в CI только напоминает и PR не блокирует.

**Релиз:**

1. `pnpm version-packages`: файлы `.changeset/*.md` удаляются, версия в `package.json` и `CHANGELOG.md` обновляются.
2. Проверить дифф, прогнать `pnpm typecheck && pnpm lint && pnpm test && pnpm build`, закоммитить.
3. `pnpm release` (нужен вход в npm: `npm login`).

**Если позже понадобится публиковать `@sloi/tokens` или `@sloi/headless-core` отдельно:** убрать пакет из `ignore`
в `.changeset/config.json`, подготовить его к публикации (сборка, `files`, README, `publishConfig`), после этого
changeset'ы можно писать и для него, версии пакетов ведутся независимо.

## Публичное API

```ts
import { Button, Modal, Tooltip, Dialog, DropdownMenu, Select } from '@sloi/ui-kit';
import '@sloi/ui-kit/styles.css';

// тяжёлые компоненты (сторонний рантайм или больше 10 KB gzip) живут в своих подпутях:
import { DataTableV2 } from '@sloi/ui-kit/data-table-v2';
import { DatePicker } from '@sloi/ui-kit/date-picker';

// tokens-only consumption (без компонентов):
import '@sloi/tokens/css/styles.css';
```

### Подпути экспорта

Корень `@sloi/ui-kit` остаётся главным входом. `DataTableV2` и `DatePicker` вынесены в `@sloi/ui-kit/data-table-v2` и `@sloi/ui-kit/date-picker`, чтобы потребитель, который их не использует, не платил за них размером: ES-бандлер потребителя отбрасывает неиспользуемое, а после следующего major корень физически перестанет на них ссылаться (корневой JS ≈20 KB gzip против ≈55 KB с ними). Импорт этих двух компонентов из корня пока работает, но помечен `@deprecated` и будет удалён в следующем major; при `require()` корня они пока загружаются целиком. CSS общий: подключайте один `@sloi/ui-kit/styles.css`. `react-day-picker` устанавливается автоматически как зависимость пакета. Критерии выноса и правила для новых подпутей: `docs/architecture/EXPORT-SUBPATHS.md`.

### Select: значение и сброс

`Select` работает в двух режимах: неуправляемом (`defaultValue`, без `defaultValue` показывается плейсхолдер) и управляемом (`value` + `onValueChange`). Режим выбирается по наличию `value` и не должен меняться в течение жизни компонента. Чтобы сбросить управляемый `Select` к плейсхолдеру, передайте `value=''`, а не `undefined`: `undefined` вернул бы компонент к внутреннему состоянию.

### Базовый слой (необязательный)

`styles.css` содержит только стили компонентов и токены, глобальных стилей страницы в нём нет. В приложении без собственных глобальных стилей текст рисуется шрифтом браузера по умолчанию. Если нужны шрифт, цвет и фон страницы из токенов, подключите базовый слой после `styles.css`:

```ts
import '@sloi/ui-kit/styles.css';
import '@sloi/ui-kit/base.css'; // или '@sloi/tokens/css/base.css' при работе только с токенами
```

Он задаёт `box-sizing`, `body` (шрифт, размер, цвет, фон из токенов), наследование шрифта у `button/input/select/textarea` и `color-scheme` для светлой и тёмной темы. Все селекторы обёрнуты в `:where()` (нулевая специфичность), поэтому свои глобальные стили перекрывают их без `!important`. Если у приложения уже есть свой reset и шрифты, файл подключать не нужно.

### Иконки

Иконки экспортируются с префиксом `Icon` (`IconArrowRight`, `IconDownload`, всего ~70) и передаются в `Icon`:

```tsx
import { Icon, IconArrowRight } from '@sloi/ui-kit';

<Icon icon={IconArrowRight} />;
```

Имён без префикса (`ArrowRight`) в пакете нет: в Next.js App Router такой импорт не падает на сборке, а превращается в `undefined` и даёт `Element type is invalid … Check the render method of Icon`. Полный список: `ICON_LIBRARY`.

### Next.js App Router (Server Components)

Пакет собирается как клиентский модуль (`'use client'` в начале `dist/index.js`). Компоненты рендерятся на сервере в HTML (SSR) и гидрируются, но:

- Импортировать компоненты можно прямо в Server Component (проверено с `Button` и `Icon icon={IconArrowRight}`).
- Из Server Component нельзя передавать функции в props: обработчики (`onClick`, `onChange`), `accessor`/`cell` в колонках таблиц, render-props. Такие места выносите в файл с `'use client'`.
- Не-компонентные экспорты (`ICON_LIBRARY` и т.п.) в серверном коде читать нельзя: на сервере это клиентские ссылки.
- Статичные компоненты тоже попадают в клиентский бандл: «серверных» компонентов без JS пока нет.

## Migration Notes: DataTable V2 Pinning

- `DataTable V1` остается замороженным (без `pinning/resize/virtualization`).
- Для pinning используйте только `DataTableV2`.
- Переход выполняется opt-in, без обязательной миграции с `V1`.

Пример:

```tsx
import { DataTableV2 } from '@sloi/ui-kit';

<DataTableV2
  data={rows}
  rowKey='id'
  columns={columns}
  enableColumnPinning
  defaultPinnedColumns={{ left: ['invoice'], right: ['amount'] }}
/>;
```

Подробные заметки миграции: `docs/backlog/data-table-v2-pinning-migration.md`.

## Рекомендации Radix (базовые)

- Использовать составные части primitives (`Root`, `Trigger`, `Content`, и т.д.).
- Сохранять поддержку `asChild` при создании обёрток.
- Поддерживать controlled/uncontrolled API там, где это предусмотрено Radix.
- Обязательно добавлять accessible labels (`Label`, `aria-*`) для интерактивных контролов.
- Стилизовать через `data-*` атрибуты состояния (`data-state`, `data-side`, ...), а не через JS-костыли.
- Компоненты, которых нет в Radix (например `Button`, `Table`), реализуем отдельно в `shared/ui/*`.
- Утилиты (`AccessibleIcon`, `Direction`, `Portal`, `Slot`, `VisuallyHidden`) используем точечно внутри наших компонентов.
- В публичный API экспортируем только наши обёртки/компоненты, не голые re-export primitives из Radix.

## Структура

```text
.storybook/
packages/
  tokens/
    src/
      palette.css
      tokens.css
      typography.css
      styles.css
      tokens.json
src/
  app/
    styles/
      palette.css
      tokens.css
  shared/
    lib/
      radix/
        index.ts
    ui/
      button/
        button.tsx
        button.module.scss
        button.stories.tsx
      modal/
        modal.tsx
        modal.module.scss
        modal.stories.tsx
      primitives/
        _internal/
          common.tsx
        accordion/
          accordion.tsx
          accordion.module.scss
          accordion.stories.tsx
        select/
          select.tsx
          select.module.scss
          select.stories.tsx
        ... (по этой же схеме для каждого Radix primitive)
      tooltip/
        tooltip.tsx
        tooltip.module.scss
        tooltip.stories.tsx
  index.ts
```
