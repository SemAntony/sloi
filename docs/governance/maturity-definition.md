# Design System Maturity Definition

Документ фиксирует критерии зрелости, чтобы решения принимались по метрикам, а не по ощущениям.

## Stage A: Reliable Core

1. Tier-1 список компонентов утвержден owners.
2. `unit` покрытие Tier-1: минимум 80%.
3. `a11y` покрытие Tier-1: 100%.
4. Tier-1 API не имеет незапланированных breaking-изменений.
5. Quality gates в CI обязательны для merge.

## Stage B: Adoption-Proven

1. Минимум 1 production/pilot consumer использует UI-kit.
2. Есть регулярный feedback-loop по API, styling contract и docs gaps.
3. Release semver дисциплина соблюдается, migration notes публикуются для user-visible изменений.
4. Есть adoption отчеты по импорту компонентов и использованию токенов.

## Stage C: Full Design System

1. Foundations оформлены как самостоятельные модули: colors, typography, spacing, iconography.
2. Принята и соблюдается [Iconography and color token policy](./iconography-color-token-policy.md) с KPI-гейтами.
3. Есть patterns уровня продуктовых сценариев (forms, table+filters, modal workflows).
4. Enterprise-компоненты (например `DataTableV2`) закрывают agreed feature set + perf budget + a11y.
5. Минимум 2 consumer-продукта используют систему в production/pilot.
6. Документация позволяет онбордить новую команду без устных договоренностей.

## Current tracking

1. Статус зрелости обновляется в release cycle и при изменении ключевых KPI.
2. Если KPI падают ниже порога, новые surface-level фичи приоритизируются ниже reliability/adoption работ.
