# Integration Migration Notes (AD-05)

Контекст: migration guidance по фактическим consumer pain points из Stage B.

Обновлено: `2026-04-04`.

## Related pain points

1. `AD-FB-01`: verbose enterprise-конфигурация `DataTableV2`.
2. `AD-FB-02`: нет готового persistence path для table preferences.
3. `AD-FB-06`: неочевидный keyboard/a11y check-list для virtualized mode.
4. `AD-FB-08`: нужен короткий migration шаблон для продуктовых команд.

## Recommended migration template (`DataTable` -> `DataTableV2`)

1. Сохранить текущий набор колонок и `rowKey`.
2. Подключить `DataTableV2` без тяжелых фич (`pinning/resize/virtualization` выключены) и проверить parity.
3. Включать тяжелые фичи по одной:
   - сначала `enableColumnPinning`;
   - затем `enableColumnResize`;
   - затем `enableVirtualization` для больших dataset.
4. Для enterprise-экрана сразу перевести state-каналы в controlled mode (`pinnedColumns`, `columnSizes`, `columnVisibility`).
5. Добавить persistence table preferences (local storage / server profile).
6. Прогнать keyboard/a11y сценарии перед rollout.

## Controlled + persistence starter

```tsx
import { useEffect, useMemo, useState } from 'react';
import {
  DataTableV2,
  type DataTableColumn,
  type DataTableV2ColumnPinningState,
  type DataTableV2ColumnSizeState
} from '@sloi/ui-kit';

type Incident = {
  id: string;
  service: string;
  priority: 'P1' | 'P2' | 'P3';
  status: 'open' | 'investigating' | 'resolved';
};

type TablePreferences = {
  pinnedColumns: DataTableV2ColumnPinningState;
  columnSizes: DataTableV2ColumnSizeState;
  visibleColumnIds: string[];
};

const STORAGE_KEY = 'ops-table-preferences-v1';

const defaultPreferences: TablePreferences = {
  pinnedColumns: { left: ['id'], right: [] },
  columnSizes: { service: 260 },
  visibleColumnIds: ['id', 'service', 'priority', 'status']
};

export function OpsIncidentsTable({
  rows,
  columns
}: {
  rows: Incident[];
  columns: DataTableColumn<Incident>[];
}) {
  const initial = useMemo<TablePreferences>(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPreferences;
    try {
      return { ...defaultPreferences, ...JSON.parse(raw) } as TablePreferences;
    } catch {
      return defaultPreferences;
    }
  }, []);

  const [pinnedColumns, setPinnedColumns] = useState(initial.pinnedColumns);
  const [columnSizes, setColumnSizes] = useState(initial.columnSizes);
  const [visibleColumnIds, setVisibleColumnIds] = useState(initial.visibleColumnIds);

  useEffect(() => {
    const payload: TablePreferences = { pinnedColumns, columnSizes, visibleColumnIds };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [pinnedColumns, columnSizes, visibleColumnIds]);

  return (
    <DataTableV2
      data={rows}
      columns={columns}
      rowKey='id'
      showPagination={false}
      enableColumnPinning
      pinnedColumns={pinnedColumns}
      onPinnedColumnsChange={setPinnedColumns}
      enableColumnResize
      columnSizes={columnSizes}
      onColumnSizesChange={setColumnSizes}
      columnVisibility={{
        visibleColumnIds,
        onVisibleColumnIdsChange: setVisibleColumnIds
      }}
      enableVirtualization
      rowHeight={44}
      overscan={8}
    />
  );
}
```

## Keyboard/A11y rollout checks (virtualized mode)

1. Есть доступ к viewport через `aria-label="DataTable virtualized viewport"`.
2. После deep scroll keyboard focus не теряется на интерактивной строке.
3. `Enter`/`Space` row interaction сохраняет поведение при virtualization.
4. Pinning/resize controls остаются доступными с keyboard.
5. Нет новых `error`-violations в `pnpm run test:a11y`.

## Rollout strategy for product teams

1. `Pilot` (1 экран): проверить parity + persistence + a11y.
2. `Limited` (2-3 экрана): собрать pain points и скорректировать presets/docs.
3. `General`: масштабировать на остальные экраны после release sign-off.

## Release note template for migration section

```md
### Migration
- Scope: `<screen/module>`
- Old component: `DataTable`
- New component: `DataTableV2`
- Enabled features: `pinning`, `resize`, `virtualization`
- Controlled channels: `pinnedColumns`, `columnSizes`, `columnVisibility`
- Persistence: `<localStorage/server profile>`
- A11y verification: `<test run / checklist reference>`
- Rollback plan: `<feature flag / previous component path>`
```
