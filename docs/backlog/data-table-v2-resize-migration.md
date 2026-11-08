# DataTable V2 Resize Migration Notes

Дата: 2026-04-03

## Scope

Этот документ покрывает только `DataTable V2` Phase 2 (`column resize`).

## What changed

1. В `DataTableV2` добавлен resize API:
   - `enableColumnResize`
   - `columnSizes` (controlled)
   - `defaultColumnSizes` (uncontrolled)
   - `onColumnSizesChange`
   - `minColumnWidth`
   - `maxColumnWidth`
2. Для заголовков добавлены resize handles с `aria-label`.
3. Поддержаны pointer и keyboard resize сценарии.

## What did not change

1. `DataTable V1` не изменен.
2. Resize остается opt-in и включается только через `enableColumnResize`.
3. Existing behavior `DataTableV2` вне resize-потока сохранено.

## Adoption path

1. Включать resize только на экранах, где есть реальный пользовательский запрос на управление ширинами.
2. Для управляемых бизнес-экранов использовать controlled режим (`columnSizes` + `onColumnSizesChange`).
3. Для простых сценариев использовать uncontrolled режим (`defaultColumnSizes`).

## Minimal example

```tsx
import { DataTableV2 } from '@sloi/ui-kit';

<DataTableV2
  data={rows}
  rowKey='id'
  columns={columns}
  enableColumnResize
  defaultColumnSizes={{ customer: 240 }}
  minColumnWidth={120}
  maxColumnWidth={320}
/>;
```

## Controlled mode example

```tsx
import { useState } from 'react';
import { DataTableV2, type DataTableV2ColumnSizeState } from '@sloi/ui-kit';

const [columnSizes, setColumnSizes] = useState<DataTableV2ColumnSizeState>({
  customer: 240
});

<DataTableV2
  data={rows}
  rowKey='id'
  columns={columns}
  enableColumnResize
  columnSizes={columnSizes}
  onColumnSizesChange={setColumnSizes}
/>;
```

## Known limitations

1. Persistence column sizes между сессиями не включен по умолчанию.
2. Layout-regression sweep для supported viewport фиксируется отдельной задачей Phase 2.
3. Snapping-step для keyboard resize не добавлен (используется фиксированный шаг).

## Usage recommendations

1. Избегать слишком узких `minColumnWidth`, чтобы не деградировать readability.
2. Проверять resize в связке с pinning на конкретном экране.
3. Для таблиц с большим числом колонок заранее определять бизнес-лимиты `min/max`.

## Integration note

1. Шаблон controlled + persistence rollout: [Integration migration notes](../adoption/integration-migration-notes.md).
