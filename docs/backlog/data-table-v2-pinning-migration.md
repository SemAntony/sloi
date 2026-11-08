# DataTable V2 Pinning Migration Notes

Дата: 2026-03-31

## Scope

Этот документ покрывает только `DataTable V2` Phase 1 (`column pinning`).

## What changed

1. В публичный API библиотеки добавлен экспорт `DataTableV2`.
2. В `DataTableV2` доступен pinning API:
   - `enableColumnPinning`
   - `pinnedColumns` (controlled)
   - `defaultPinnedColumns` (uncontrolled)
   - `onPinnedColumnsChange`

## What did not change

1. `DataTable V1 API` заморожен и не расширяется тяжелыми фичами.
2. Текущее поведение `V1` (`client/server`, selection, bulk actions, persistence, visibility) сохранено.

## Adoption path

1. Для новых экранов с pinning использовать `DataTableV2`.
2. Для существующих `V1` экранов оставаться на `DataTable`, если pinning не требуется.
3. Миграцию проводить постепенно, по компонентам/экранам.

## Minimal migration example

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

## Controlled mode example

```tsx
import { useState } from 'react';
import { DataTableV2, type DataTableV2ColumnPinningState } from '@sloi/ui-kit';

const [pinnedColumns, setPinnedColumns] = useState<DataTableV2ColumnPinningState>({
  left: ['invoice'],
  right: []
});

<DataTableV2
  data={rows}
  rowKey='id'
  columns={columns}
  enableColumnPinning
  pinnedColumns={pinnedColumns}
  onPinnedColumnsChange={setPinnedColumns}
/>;
```

## Decisions for Phase 1

1. Нет жесткого лимита количества pinned колонок на уровне API.
2. Persistence pinned state по умолчанию не включен в этом этапе.
3. `V1` не изменяется; новые capability идут только через `V2` RFC/Roadmap.

## Integration note

1. Для product rollout использовать общий migration template: [Integration migration notes](../adoption/integration-migration-notes.md).
