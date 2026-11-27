# DataTable V2 Phase 1 Plan - Column Pinning

Связанные документы:

1. [DataTable V2 roadmap](./data-table-v2-roadmap.md)
2. [Column pinning RFC](./data-table-v2-rfc-column-pinning.md)
3. [Column pinning checklist](./data-table-v2-checklist-column-pinning.md)

## Goal

Реализовать `column pinning` в `DataTable V2` через последовательность небольших PR, без изменений публичного `DataTable V1 API`.

## Guardrails

1. Не добавлять pinning props в [`src/shared/ui/data-table/data-table.tsx`](../../src/shared/ui/data-table/data-table.tsx).
2. Не менять экспорт `DataTable` как `V1` контракта.
3. Все новые API и stories вести в отдельном `V2` скоупе.

## Proposed File Layout (V2 track)

Новые файлы:

1. `src/shared/ui/data-table-v2/data-table-v2.types.ts`
2. `src/shared/ui/data-table-v2/data-table-v2.tsx`
3. `src/shared/ui/data-table-v2/data-table-v2.module.scss`
4. `src/shared/ui/data-table-v2/data-table-v2.stories.tsx`
5. `src/shared/ui/data-table-v2/data-table-v2.test.tsx`
6. `src/shared/ui/data-table-v2/data-table-v2.a11y.test.tsx`
7. `src/shared/ui/data-table-v2/index.ts`

Файлы для интеграции:

1. [`src/shared/ui/index.ts`](../../src/shared/ui/index.ts) (экспорт `data-table-v2` после готовности фичи).
2. [`CHANGELOG.md`](../../CHANGELOG.md) (migration notes при релизе фазы).

## PR-by-PR Breakdown

## Progress Snapshot (2026-03-31)

1. `PR-1` выполнен: `DataTableV2` scaffold + типы + базовые tests/stories.
2. `PR-2` выполнен: state model (`left/right`) + sticky rendering + column reordering.
3. `PR-3` выполнен: pinning controls + keyboard pin/unpin flow + story/test coverage.
4. `PR-4` выполнен: edge interaction/a11y coverage (`mixed pin+sort`, `pin + visibility toggle`, focus-order regression).
5. `PR-5` выполнен: root export `data-table-v2` + migration notes + changelog updates.
6. Phase 1 статус: завершен.

## PR-1: V2 Scaffold + Types

Scope:

1. Создать пакет `data-table-v2` и базовые типы pinning.
2. Согласовать controlled/uncontrolled API.

Files:

1. `src/shared/ui/data-table-v2/data-table-v2.types.ts`
2. `src/shared/ui/data-table-v2/data-table-v2.tsx`
3. `src/shared/ui/data-table-v2/index.ts`

Acceptance:

1. `DataTableV2` рендерит базовую таблицу без pinning поведения.
2. Type contract проходит `typecheck`.

## PR-2: Pinning State + Sticky Rendering

Scope:

1. Реализовать state model (`left`, `right`) и sticky offsets.
2. Выровнять pinned header/body cells.

Files:

1. `src/shared/ui/data-table-v2/data-table-v2.tsx`
2. `src/shared/ui/data-table-v2/data-table-v2.module.scss`

Acceptance:

1. Поддерживаются left/right pinned columns.
2. Нет визуального разрыва между header/body при скролле.

## PR-3: Pinning Controls + Keyboard

Scope:

1. Добавить UI-управление pin/unpin.
2. Закрыть keyboard flow и accessible names.

Files:

1. `src/shared/ui/data-table-v2/data-table-v2.tsx`
2. `src/shared/ui/data-table-v2/data-table-v2.module.scss`
3. `src/shared/ui/data-table-v2/data-table-v2.stories.tsx`

Acceptance:

1. Pin/unpin выполняется без мыши.
2. Controls имеют понятные aria-label.

## PR-4: Storybook + Tests + A11y

Scope:

1. Добавить stories для key states.
2. Добавить unit/interaction/a11y покрытие.

Files:

1. `src/shared/ui/data-table-v2/data-table-v2.stories.tsx`
2. `src/shared/ui/data-table-v2/data-table-v2.test.tsx`
3. `src/shared/ui/data-table-v2/data-table-v2.a11y.test.tsx`

Acceptance:

1. Storybook содержит `Default`, `PinLeft`, `PinRight`, `PinMixed`.
2. Interaction tests покрывают pin/unpin flow.
3. `test:a11y` без новых `error`-violations.

## PR-5: Export + Docs + Release Notes

Scope:

1. Подключить экспорт `data-table-v2`.
2. Обновить документацию и changelog.

Files:

1. [`src/shared/ui/index.ts`](../../src/shared/ui/index.ts)
2. [`docs/backlog/data-table-v2-rfc-column-pinning.md`](./data-table-v2-rfc-column-pinning.md)
3. [`CHANGELOG.md`](../../CHANGELOG.md)

Acceptance:

1. Migration section добавлен.
2. RFC/checklist отмечены как выполненные по Phase 1.

## Test Matrix (Phase 1)

Unit:

1. `pin -> unpin` state transitions.
2. Controlled/uncontrolled parity.
3. Unknown column id handling.

Interaction:

1. Pin left via UI.
2. Pin right via UI.
3. Keyboard pin/unpin.
4. Mixed pinned layout stability.

A11y:

1. Pinning controls доступны по роли и имени.
2. Focus order не ломается после pin/unpin.
3. Axe checks without new errors.

## Quality Gates for Every PR

1. `pnpm run typecheck`
2. `pnpm run lint`
3. `pnpm run test`
4. `pnpm run test:a11y`
5. `pnpm run storybook:build`

## Exit Criteria for Phase 1

1. Полностью выполнен [Column pinning checklist](./data-table-v2-checklist-column-pinning.md).
2. Закрыты acceptance-пункты из [Column pinning RFC](./data-table-v2-rfc-column-pinning.md).
3. Подтверждено, что `V1` не изменен.
