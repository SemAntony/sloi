# Controlled/Uncontrolled Contract (Tier-1)

Документ фиксирует единый semver-critical контракт для управляемого и неуправляемого состояния в Tier-1 компонентах.

Дата baseline: `2026-04-04`.

## 1) Canonical naming rules

1. Для value-состояния используется тройка: `value` + `defaultValue` + `onValueChange`.
2. Для checked-состояния используется тройка: `checked` + `defaultChecked` + `onCheckedChange`.
3. Для open-состояния используется тройка: `open` + `defaultOpen` + `onOpenChange`.
4. Для сложного объектного состояния используется схема:
   - controlled prop: `<stateName>`
   - uncontrolled prop: `default<StateName>`
   - callback: `on<StateName>Change`
5. Не добавлять алиасы для одинакового state-канала (пример: нельзя одновременно поддерживать `isOpen` и `open`).

## 2) Tier-1 contract matrix

| Component | State channel | Controlled | Uncontrolled | Callback |
| --- | --- | --- | --- | --- |
| `Button` | stateless | n/a | n/a | n/a |
| `Input` | native input value | `value` | `defaultValue` | `onChange` |
| `Select` | selected value | `value` | `defaultValue` | `onValueChange` |
| `Select` | popup state | `open` | `defaultOpen` | `onOpenChange` |
| `Dialog` | dialog state | `open` | `defaultOpen` | `onOpenChange` |
| `DropdownMenu` | menu state | `open` | `defaultOpen` | `onOpenChange` |
| `Tabs` | active tab | `value` | `defaultValue` | `onValueChange` |
| `Checkbox` | checked state | `checked` | `defaultChecked` | `onCheckedChange` |
| `RadioGroup` | selected value | `value` | `defaultValue` | `onValueChange` |
| `Switch` | checked state | `checked` | `defaultChecked` | `onCheckedChange` |
| `Tooltip` | tooltip state | `open` | `defaultOpen` | `onOpenChange` |
| `Toast` | toast state | `open` | `defaultOpen` | `onOpenChange` |
| `DataTableV2` | pinning state | `pinnedColumns` | `defaultPinnedColumns` | `onPinnedColumnsChange` |
| `DataTableV2` | resize state | `columnSizes` | `defaultColumnSizes` | `onColumnSizesChange` |
| `DataTableV2` | page state | `page` | `defaultPage` | `onPageChange` |
| `DataTableV2` | page size state | `pageSize` | `defaultPageSize` | `onPageSizeChange` |
| `DataTableV2` | sort state | `sort` | `defaultSort` | `onSortChange` |
| `DataTableV2` | row selection state | `rowSelection.selectedKeys` | `rowSelection.defaultSelectedKeys` | `rowSelection.onSelectedKeysChange` |
| `DataTableV2` | column visibility state | `columnVisibility.visibleColumnIds` | `columnVisibility.defaultVisibleColumnIds` | `columnVisibility.onVisibleColumnIdsChange` |

## 3) Drift-prevention guardrails

1. Любой новый state-channel в Tier-1 должен следовать правилам из раздела 1.
2. Переименование controlled/uncontrolled props без `major` релиза запрещено.
3. Если компонент технически stateless, это фиксируется явно (как у `Button`), чтобы не появлялись случайные псевдо-controlled props.
4. Любое отклонение от правил требует RFC и migration notes.

## 4) Verification artifacts

1. Contract regression suite: [tier-1-controlled-uncontrolled-contract.test.tsx](../../src/test/tier-1-controlled-uncontrolled-contract.test.tsx).
2. Tier-1 depth matrix: [tier-1-test-coverage-matrix.md](./tier-1-test-coverage-matrix.md).
3. Stage execution tracking: [design-system-execution-plan.md](../backlog/design-system-execution-plan.md).
