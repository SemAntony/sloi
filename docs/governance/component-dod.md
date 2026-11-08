# Component Definition of Done

Definition of Done обязателен для любого нового компонента в `src/shared/ui/*`.

## 1) API contract

- [ ] Есть `forwardRef`.
- [ ] Поддержан `className`.
- [ ] Controlled/uncontrolled parity реализован там, где это применимо, и соответствует [Tier-1 controlled/uncontrolled contract](./controlled-uncontrolled-contract.md).
- [ ] Поведение `disabled`, `readOnly`, `required` (если применимо) зафиксировано.
- [ ] Публичные типы экспортируются из `index.ts`.

## 2) Accessibility

- [ ] Keyboard navigation покрывает основной сценарий.
- [ ] Добавлены корректные ARIA-атрибуты и роли.
- [ ] Focus visible state и порядок фокуса валидны.
- [ ] Если компонент содержит иконки/не-текстовые действия, есть доступные метки.

## 3) Styling and tokens

- [ ] Стили только через tokens (без raw HEX в компонентах).
- [ ] Transition/animation используют motion tokens (без hardcoded `ms`/`cubic-bezier` в public styles).
- [ ] Стили реализованы через `*.module.scss`.
- [ ] Используются `data-*` состояния, где это уместно.
- [ ] Для иконок соблюдается [Iconography and color token policy](./iconography-color-token-policy.md).

## 4) Storybook

- [ ] `Default` story.
- [ ] `States` story.
- [ ] `Controlled` story (если у компонента есть controlled API).
- [ ] Story содержит usage notes/ограничения поведения.

## 5) Tests

- [ ] Unit tests (`*.test.tsx`) покрывают ключевую логику.
- [ ] A11y tests (`*.a11y.test.tsx`) проходят без violations.
- [ ] Есть негативные/edge проверки, если есть нетривиальная логика.

## 6) Documentation and release readiness

- [ ] Обновлен changelog (если есть публичные изменения).
- [ ] Для API-поведения/миграции добавлены notes.
- [ ] Пройдены quality gates:
  - `pnpm run typecheck`
  - `pnpm run lint`
  - `pnpm run test`
  - `pnpm run test:a11y`
  - `pnpm run storybook:build`
