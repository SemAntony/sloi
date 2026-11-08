# DataTable V2 Virtualization Migration Notes

Дата: 2026-04-04

## Scope

Этот документ покрывает старт Phase 3 (`virtualization`) для `DataTableV2`.

## What changed

1. В `DataTableV2` добавлен virtualization API:
   - `enableVirtualization`
   - `rowHeight`
   - `overscan`
2. Виртуализация реализована как windowed render строк с top/bottom spacer rows.
3. Добавлен scroll viewport c `aria-label="DataTable virtualized viewport"` для тестирования и keyboard-flow.

## What did not change

1. `DataTable V1` не изменен.
2. Virtualization включается только opt-in.
3. Вне virtualization behavior существующих `V2` сценариев сохранен.

## Adoption path

1. Включать virtualization для таблиц с большими списками строк (`>= 200` как стартовый ориентир).
2. Для интерактивных таблиц (row click / selection) проверять keyboard flow на конкретном экране.
3. Для mixed режимов (`pinning + resize + virtualization`) задавать явные `rowHeight` и `overscan`.

## Minimal example

```tsx
import { DataTableV2 } from '@sloi/ui-kit';

<DataTableV2
  data={rows}
  rowKey='id'
  columns={columns}
  showPagination={false}
  enableVirtualization
  rowHeight={44}
  overscan={6}
/>;
```

## Known limitations

1. Перф-бюджет подтверждён: [DataTableV2 perf note (2026-04-04)](./data-table-v2-perf-note-2026-04-04.md).
2. Adaptive overscan по типу устройства не реализован.
3. Persistence scroll position между mount/unmount не включен.

## Usage recommendations

1. Не включать virtualization по умолчанию для small dataset.
2. Проверять `rowHeight` на реальном контенте, чтобы избежать визуального "прыжка" окна.
3. В `selection/sort/pagination` сценариях сохранять unit/integration coverage на уровне consumer-экранов.

## Integration note

1. Keyboard/a11y rollout checklist и release migration template: [Integration migration notes](../adoption/integration-migration-notes.md).
