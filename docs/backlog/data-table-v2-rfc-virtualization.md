# RFC: DataTable V2 - Virtualization

## Status

Accepted

## Date

2026-03-31

## Problem

- При больших объемах данных таблица деградирует по производительности.
- Без virtualization растут latency скролла и время первичного рендера.
- Добавление virtualization в `V1` запрещено freeze-политикой.

## Goals

1. Добавить virtualization в `DataTable V2` для больших датасетов.
2. Сохранить корректные table semantics и a11y-поведение.
3. Зафиксировать перф-метрики и pass/fail критерии.

## Non-goals

1. Полная серверная data-engine переработка в этом RFC.
2. Изменение `V1 API`.
3. Оптимизация всех consumer-экранов вне `V2` adoption-трека.

## API / Types (finalized)

```ts
export interface DataTableV2VirtualizationProps {
  enableVirtualization?: boolean;
  rowHeight?: number;
  overscan?: number;
}
```

## A11y

- Виртуализированная таблица сохраняет корректные роли (`table`, `row`, `cell`, `columnheader`).
- Focus не теряется при скролле/перерисовке.
- Screen reader получает предсказуемую структуру и навигацию.

## Migration

- `V1` остается стабильным и без virtualization.
- Переход на `V2 virtualization` только opt-in.
- В changelog обязателен migration section с known limitations.

## Risks

- Сложности совместимости с selection/pinning/resize.
- A11y-регрессии при динамической подгрузке строк.
- Трудности отладки из-за неполного DOM в viewport.

## Rollout

1. Ввести virtualization как `V2` capability.
2. Добавить Storybook scenarios на small/large dataset.
3. Прогнать unit, interaction, a11y и перф-измерения по чек-листу.
4. Задокументировать ограничения и migration notes.

## Acceptance

1. В `V1` отсутствуют virtualization props и поведение.
2. Для `V2` large dataset рендерится без критичной деградации UX.
3. Скролл остаётся плавным в пределах зафиксированного перф-бюджета.
4. Семантика таблицы и keyboard-навигация не ломаются.
5. Нет новых `error`-violations в `test:a11y` для virtualization stories.
6. Проходят quality gates: `typecheck`, `lint`, `test`, `test:a11y`, `storybook:build`.

## Performance Budget (initial)

1. Time to first stable table render: <= 1500ms на reference dataset.
2. Average scroll frame rate: >= 50 FPS на reference viewport.
3. Max long task during scroll: < 120ms.

## Performance validation snapshot (2026-04-04)

1. TTFSR: `49.17ms` (budget `<= 1500ms`) - pass.
2. Average FPS: `62.27` (budget `>= 50`) - pass.
3. Max long task: `60.81ms` (budget `< 120ms`) - pass.
4. Artifact: [DataTableV2 Perf Note (2026-04-04)](./data-table-v2-perf-note-2026-04-04.md).

## Reference Dataset (phase 3 baseline)

1. `10,000` rows.
2. `4` business columns (id, label, status, amount).
3. Fixed row height baseline: `44px`.
4. Reference viewport: `1280x800`.

## Open Questions

1. Нужен ли адаптивный overscan по типу устройства.
2. Нужен ли отдельный perf-check в CI или достаточно release-gated perf note.

## Implementation Checklist

1. [Virtualization checklist](./data-table-v2-checklist-virtualization.md)
2. [DataTable V2 virtualization migration notes](./data-table-v2-virtualization-migration.md)

## Sign-off

1. Primary owner scope (`Data Experience Team`) подтвержден через governance matrix.
2. Backup owner scope (`Design System Core`) подтвержден для review coverage.
3. Owner sign-off завершен `2026-04-06`; phase status обновлен в [DataTable V2 roadmap](./data-table-v2-roadmap.md).
