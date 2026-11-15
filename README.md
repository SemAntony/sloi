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

## Публичное API

```ts
import { Button, Modal, Tooltip, Dialog, DropdownMenu, Select, DataTableV2 } from '@sloi/ui-kit';
import '@sloi/ui-kit/styles.css';

// tokens-only consumption (без компонентов):
import '@sloi/tokens/css/styles.css';
```

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
