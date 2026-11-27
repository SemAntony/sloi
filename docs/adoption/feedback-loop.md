# Adoption Feedback Loop (AD-02)

Контекст: Stage B (adoption), источник интеграционных проблем по consumers. Consumers здесь это демо-приложения внутри репозитория, не внешние потребители; Stage B не достигнут.

Обновлено: `2026-04-04`.

## Sources

1. Consumers:
   - `consumers/sloi-pilot`
   - `consumers/sloi-analytics`
   - `consumers/sloi-operations`
2. Adoption report: [`reports/adoption/latest.json`](../../reports/adoption/latest.json).
3. Consumer screens:
   - [sloi-pilot app](../../consumers/sloi-pilot/src/app.tsx)
   - [sloi-analytics app](../../consumers/sloi-analytics/src/app.tsx)
   - [sloi-operations app](../../consumers/sloi-operations/src/app.tsx)

## Status Dictionary

1. `new`: pain point зафиксирован, не разобран в planning.
2. `planned`: решение согласовано, задача в очереди.
3. `in-progress`: работа уже начата.
4. `done`: pain point закрыт и проверен на consumer-сценарии.

## Pain Points Backlog

| ID | Consumer | Area | Pain point | Impact | Owner | Status | Next action | Target |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `AD-FB-01` | `sloi-operations` | DataTableV2 API | Конфигурация enterprise-режима (`pinning + resize + virtualization + sizes`) слишком verbose на экранном уровне. | Замедляет интеграцию новых таблиц и повышает риск несовместимых настроек. | Data Experience Team | `planned` | Подготовить composition helper/preset API для enterprise table profile. | `2026-04-11` |
| `AD-FB-02` | `sloi-operations` | DataTableV2 state persistence | Нет готового recipe для persistence user preferences (column widths, pinned state, visible columns). | Падает UX continuity между сессиями и возрастает объем consumer-кода. | Data Experience Team | `planned` | Базовый template добавлен в [integration-migration-notes.md](./integration-migration-notes.md); следующий шаг — вынести shared helper/preset в API. | `2026-04-12` |
| `AD-FB-03` | `sloi-analytics` | ToggleGroup DX | Использование `ToggleGroup` с raw `button` children неочевидно без примеров contract-уровня. | Риск неправильной разметки и нестабильного keyboard behavior на consumer-экранах. | Design System Core | `new` | Добавить canonical example в docs + story с do/don't. | `2026-04-10` |
| `AD-FB-04` | `sloi-pilot`, `sloi-analytics`, `sloi-operations` | Patterns | Нет готового `table + filters` recipe с согласованной структурой toolbar/filter actions/loading/error states. | Каждый consumer собирает свой шаблон, API и UX расходятся. | Design System Core | `done` | Закрыто через [adoption/recipes.md](./recipes.md), раздел `Table + Filters`. | `2026-04-04` |
| `AD-FB-05` | `sloi-operations` | Styling contract | Нужен стабильный layout contract для filter bar (чтобы легко управлять wrap/priority действий на узких экранах). | Дополнительные локальные CSS-обходы в каждом consumer. | Design System Core | `planned` | Уточнить styling contract для `FilterBar` и добавить responsive recipe. | `2026-04-13` |
| `AD-FB-06` | `sloi-analytics`, `sloi-operations` | A11y guidance | Недостаточно документации по keyboard/focus behavior в виртуализированных таблицах при глубоком scroll. | Сложнее валидировать enterprise a11y на продуктовых экранах. | Data Experience Team | `planned` | Добавить раздел keyboard/a11y checklist в DataTableV2 docs. | `2026-04-12` |
| `AD-FB-07` | `sloi-pilot` | Form integration | Нет готового recipe для `Input + Select + primary action` с единым spacing/focus/error contract. | Повторяемость однотипного glue-кода в consumer-формах. | Design System Core | `done` | Закрыто через [adoption/recipes.md](./recipes.md), разделы `Form` и `Modal Form`. | `2026-04-04` |
| `AD-FB-08` | `sloi-operations` | Release adoption | Нужен короткий migration шаблон для команд, переходящих на `DataTableV2` enterprise profile. | Увеличивается время onboarding новых consumer-команд. | Frontend Platform | `done` | Закрыто через [integration-migration-notes.md](./integration-migration-notes.md), секция `Release note template for migration section`. | `2026-04-04` |

## Cadence

1. Обновлять этот документ в каждом PR, который закрывает `AD-*` задачи.
2. Review cadence: `1` раз в неделю в release cycle.
3. Pain points со статусом `new` старше `7` дней переводятся в `planned` или получают explicit defer-note.
