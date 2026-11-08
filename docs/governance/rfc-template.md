# RFC Template

Используй этот шаблон для предложений, которые меняют публичный API, поведение или foundation-слой.

---

## Title

`RFC: <short name>`

## Problem

- Какую проблему решаем.
- Текущая боль для команды/продукта.

## Goals

1. Цель 1
2. Цель 2

## Non-goals

1. Что явно не входит в этот RFC.
2. Что откладываем в следующую фазу.

## API / Types

- Предлагаемый публичный контракт.
- Controlled/uncontrolled поведение.
- Изменения type-уровня.

```ts
// New or changed public types
```

## A11y

- Keyboard interactions.
- ARIA roles/labels/announcements.
- Focus management.

## Migration

- Нужна ли миграция.
- Пошаговый migration path.
- Совместимость со старыми API.

## Risks

- Технические риски.
- Риски для adoption/поддержки.
- Риски для производительности.

## Rollout

1. Storybook.
2. Tests.
3. Release notes/changelog.
4. Feature flag (если нужно).

## Acceptance

1. Что проверяем как Definition of Done.
2. Какие quality gates должны пройти.
3. Какие метрики подтверждают успешный rollout.

## Open Questions

1. Вопрос 1
2. Вопрос 2

---

Reviewer checklist:

- [ ] RFC scope согласован с owners.
- [ ] API/Types section полная.
- [ ] A11y section полная.
- [ ] Migration section полная.
- [ ] Rollout и Acceptance содержат проверяемые критерии.
