# RFC: DataTable V2 - Column Pinning

## Status

Accepted

## Date

2026-03-31

## Problem

- В `V1` нет pinning-режима, и пользователи теряют контекст ключевых колонок при горизонтальном скролле.
- Попытка добавить pinning в `V1` нарушает freeze-политику.
- Нужна V2-реализация с предсказуемым API и доступностью.

## Goals

1. Добавить pinning в `DataTable V2` без изменения `V1 API`.
2. Поддержать left/right pinning для колонок.
3. Обеспечить keyboard + screen reader доступность.

## Non-goals

1. Реализация column resize и virtualization (отдельные RFC).
2. Изменение существующих `V1` stories или API.
3. Автоматическая миграция всех потребителей на `V2`.

## API / Types (finalized)

```ts
export type DataTablePinSide = 'left' | 'right';

export interface DataTableV2ColumnPinningState {
  left: string[];
  right: string[];
}

export interface DataTableV2PinningProps {
  enableColumnPinning?: boolean;
  pinnedColumns?: DataTableV2ColumnPinningState; // controlled
  defaultPinnedColumns?: DataTableV2ColumnPinningState; // uncontrolled
  onPinnedColumnsChange?: (state: DataTableV2ColumnPinningState) => void;
}
```

## A11y

- Все pin/unpin actions доступны с клавиатуры.
- Элементы управления pinning имеют явные accessible names.
- Порядок фокуса стабилен при переключении pinned state.

## Migration

- `V1` остается без изменений.
- `V2` подключается как opt-in.
- Migration notes добавлены: [DataTable V2 pinning migration notes](./data-table-v2-pinning-migration.md).
- Публичный экспорт: `import { DataTableV2 } from '@sloi/ui-kit'`.

## Risks

- Визуальные регрессии sticky-слоёв.
- Конфликты с overflow/scroll контейнерами.
- Потеря производительности при большом числе pinned колонок.

## Rollout

1. Реализация в `V2` behind opt-in.
2. Storybook scenarios: default, left pinned, right pinned, mixed pinned.
3. Unit + interaction + a11y tests.
4. Changelog + migration section.

## Acceptance

1. В `V1` нет новых pinning props и поведения.
2. Пин/анпин работает для left/right и обновляет controlled/uncontrolled state.
3. Header и body ячейки pinned колонок визуально выровнены на всех supported viewport.
4. Keyboard flow: пользователь может закрепить/открепить колонку без мыши.
5. A11y проверки (`test:a11y`) не имеют новых `error`-violations в pinning stories.
6. Проходят quality gates: `typecheck`, `lint`, `test`, `test:a11y`, `storybook:build`.

## Acceptance Validation (2026-03-31)

1. Все acceptance-пункты закрыты по результатам PR-1..PR-5.
2. Phase 1 checklist закрыт: [Column pinning checklist](./data-table-v2-checklist-column-pinning.md).

## Decisions (resolved in Phase 1)

1. Жесткий лимит на число pinned колонок в API не вводим на Phase 1.
2. Persistence pinned state по умолчанию не включаем на Phase 1.

## Implementation Checklist

1. [Column pinning checklist](./data-table-v2-checklist-column-pinning.md)
2. [Phase 1 pinning implementation plan](./data-table-v2-phase1-pinning-plan.md)
3. [DataTable V2 pinning migration notes](./data-table-v2-pinning-migration.md)

## Sign-off

1. Primary owner scope (`Data Experience Team`) подтвержден через governance matrix.
2. Backup owner scope (`Design System Core`) подтвержден для review coverage.
