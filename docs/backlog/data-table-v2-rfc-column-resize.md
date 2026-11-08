# RFC: DataTable V2 - Column Resize

## Status

Accepted

## Date

2026-03-31

## Problem

- Фиксированные ширины колонок не покрывают сценарии плотных бизнес-таблиц.
- Команды компенсируют это локальными override-решениями вне дизайн-системы.
- Resize нельзя добавлять в `V1` из-за freeze-политики.

## Goals

1. Добавить resize-управление колонками в `DataTable V2`.
2. Поддержать pointer и keyboard resize сценарии.
3. Зафиксировать предсказуемую модель min/max ширин.

## Non-goals

1. Реализация pinning и virtualization (отдельные RFC).
2. Изменение `V1 API`.
3. Ручная подстройка каждого consumer-экрана в рамках этого RFC.

## API / Types (finalized)

```ts
export interface DataTableV2ColumnSizeState {
  [columnId: string]: number;
}

export interface DataTableV2ResizeProps {
  enableColumnResize?: boolean;
  columnSizes?: DataTableV2ColumnSizeState; // controlled
  defaultColumnSizes?: DataTableV2ColumnSizeState; // uncontrolled
  onColumnSizesChange?: (state: DataTableV2ColumnSizeState) => void;
  minColumnWidth?: number;
  maxColumnWidth?: number;
}
```

## A11y

- Resize handles имеют корректные `aria-label`.
- Keyboard resize доступен без мыши.
- Изменение ширины не ломает focus visibility и tab order.

## Migration

- `V1` остается неизменным.
- `V2` resize подключается только opt-in.
- Migration notes публикуются в релизе resize-фазы.

## Risks

- Layout shift на узких экранах.
- Конфликт с sticky/pinning при совместном использовании.
- Неодинаковое поведение pointer events в браузерах.

## Rollout

1. Реализация в `V2` с feature guard.
2. Storybook scenarios: default, resized, min/max limits, keyboard resize.
3. Unit tests на state transitions + interaction tests.
4. A11y checks и release notes.

## Acceptance

1. В `V1` не добавлены resize props и resize UI.
2. Resize работает в controlled/uncontrolled режимах.
3. Ограничения `minColumnWidth` и `maxColumnWidth` соблюдаются.
4. Keyboard resize покрыт тестом и работает в Storybook interaction flow.
5. Нет новых `error`-violations в `test:a11y` для resize stories.
6. Проходят quality gates: `typecheck`, `lint`, `test`, `test:a11y`, `storybook:build`.

## Acceptance Validation (2026-04-03)

1. Acceptance-критерии 1-6 подтверждены на Phase 2 implementation.
2. Добавлены layout regression checks для constrained viewport и совместного режима `pinning + resize`.
3. Phase 2 checklist закрыт: [Column resize checklist](./data-table-v2-checklist-column-resize.md).

## Decisions (resolved in Phase 2)

1. Keyboard resize использует фиксированный шаг: `Arrow` = `12px`, `Shift+Arrow` = `24px`.
2. Persistence `columnSizes` по умолчанию не включается.

## Open Questions

None for Phase 2 scope.

## Implementation Checklist

1. [Column resize checklist](./data-table-v2-checklist-column-resize.md)
2. [DataTable V2 resize migration notes](./data-table-v2-resize-migration.md)

## Sign-off

1. Primary owner scope (`Data Experience Team`) подтвержден через governance matrix.
2. Backup owner scope (`Design System Core`) подтвержден для review coverage.
