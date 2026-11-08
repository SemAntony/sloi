# RFC: DataTable V2 (Heavy Features Track)

## Status

Accepted

## Date

2026-03-31

## Problem

- `DataTable V1` закрывает текущие продуктовые задачи, но тяжелые табличные возможности требуют отдельной архитектуры и перф-бюджета.
- Добавление `pinning`, `resize`, `virtualization` в `V1` повышает риск регрессий и размывает стабильный API-контракт.
- Нужен формальный путь развития через отдельный RFC-контур и отдельный roadmap.

## Goals

1. Зафиксировать, что тяжелые фичи таблицы развиваются только в `V2` треке.
2. Сохранить `DataTable V1 API` без расширений и без breaking-сдвига.
3. Определить управляемый путь внедрения через поэтапный roadmap и measurable quality gates.

## Non-goals

1. Реализация `DataTable V2` в рамках этого RFC.
2. Изменение `DataTable V1` публичного API.
3. Миграция всех потребителей в `V2` в рамках текущего шага.

## API / Types

- `V1` остается без API-расширений.
- Все новые capability для `pinning`, `resize`, `virtualization` проектируются в `V2`.
- Формат экспорта `V2` (новый компонент, namespace или фича-флаг) фиксируется в feature-level RFC перед реализацией.

```ts
// V1: frozen contract (no new heavy features)
export type DataTableV1Mode = 'client' | 'server';

// V2: placeholder contract, finalized in feature-level RFCs
export interface DataTableV2FeatureFlags {
  columnPinning?: boolean;
  columnResize?: boolean;
  virtualization?: boolean;
}
```

## A11y

- `Pinning`: корректная keyboard-навигация и объявление pinned state для assistive tech.
- `Resize`: доступные resize handles с keyboard fallback и понятными aria-label.
- `Virtualization`: корректные табличные роли, стабильный focus order и предсказуемое чтение контента скринридером.

## Migration

- `V1` остается поддерживаемым и стабильным.
- Миграция на `V2` только opt-in после прохождения acceptance-критериев фичи.
- Для каждого breaking-риска в `V2` обязателен migration section в changelog.

## Risks

- Рост сложности реализации и поддержки таблицы.
- Перф-риски на больших наборах данных при неверной конфигурации virtualization.
- A11y-риски для keyboard/screen-reader сценариев в resize/pinning.

## Rollout

1. Утвержден этот RFC и опубликован `V2 roadmap`.
2. Для каждой тяжелой фичи создается отдельный feature RFC.
3. Реализация идет по фазам roadmap, без изменений `V1 API`.
4. Перед релизом каждой фазы: `typecheck`, `lint`, `test`, `test:a11y`, `storybook:build`, migration notes.

## Acceptance

1. В `V1` не появляется `pinning`, `resize` или `virtualization`.
2. Для каждой тяжелой фичи есть отдельный approved RFC.
3. Реализация и выпуск `V2` ведутся только через отдельный roadmap.
4. Все PR с тяжелыми фичами в `V1` считаются blocking и отклоняются до переноса в `V2`.

## Open Questions

1. Какой формат публичного экспорта `V2` выбрать для минимального migration-cost.
2. Какой перф-бюджет зафиксировать как обязательный для GA.

## Related Feature RFCs

1. [Column pinning RFC](./data-table-v2-rfc-column-pinning.md)
2. [Column resize RFC](./data-table-v2-rfc-column-resize.md)
3. [Virtualization RFC](./data-table-v2-rfc-virtualization.md)

## Related Implementation Checklists

1. [Column pinning checklist](./data-table-v2-checklist-column-pinning.md)
2. [Column resize checklist](./data-table-v2-checklist-column-resize.md)
3. [Virtualization checklist](./data-table-v2-checklist-virtualization.md)
