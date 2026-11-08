# Tier-1 Components

Tier-1 — критичный слой компонентов, для которого действуют повышенные требования по стабильности API, тестам и a11y.

## Scope (current baseline)

1. `Button`
2. `Input`
3. `Select`
4. `Dialog`
5. `DropdownMenu`
6. `Tabs`
7. `Checkbox`
8. `RadioGroup`
9. `Switch`
10. `Tooltip`
11. `Toast`
12. `DataTableV2`

## Rules

1. Для Tier-1 не допускаются незапланированные breaking changes.
2. Для каждого Tier-1 компонента обязательны unit + a11y тесты.
3. Любые API-изменения Tier-1 проходят через RFC + migration notes при user-visible изменениях.
4. Tier-1 компоненты приоритизируются при triage регрессий и release проверках.
5. Controlled/uncontrolled state-channels фиксируются и проверяются по [Tier-1 controlled/uncontrolled contract](./controlled-uncontrolled-contract.md).

## KPI linkage

1. Целевое покрытие `unit` для Tier-1: минимум 80%.
2. Целевое покрытие `a11y` для Tier-1: 100%.
3. Прогресс по KPI фиксируется в регулярных quality/release циклах.
4. Фактическая матрица покрытия ведется в [Tier-1 test coverage matrix](./tier-1-test-coverage-matrix.md).
