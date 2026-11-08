# Styling Contract

Документ фиксирует стабильный контракт стилизации для consumer-продуктов.

## 1) Public styling entry points

1. Каждый публичный компонент поддерживает `className` для root-узла.
2. Компоненты с составными частями должны иметь named sub-parts и их `className`-точки расширения.
3. Цвета/spacing/typography/motion берутся из `@sloi/tokens` (`colors.css`, `tokens.css`, `typography.css`), а не из raw HEX или raw `ms/easing` в компонентных стилях.
4. Глобальный импорт контракта токенов: `@sloi/ui-kit/styles.css`.
5. Для кросс-платформенного использования без компонентов допускается прямой импорт `@sloi/tokens/css/styles.css`.

## 2) State styling contract

1. Состояния стилизуются через `data-*` атрибуты (`data-state`, `data-disabled`, `data-side` и т.д.).
2. Для интерактивных компонентов обязательны состояния `hover`, `focus-visible`, `disabled`.
3. Для a11y-сценариев состояние фокуса не должно зависеть от JS-хаков.

## 3) Stability guarantees

1. Публичные root-class API и documented `data-*` состояния считаются semver-контрактом.
2. Изменение или удаление documented styling hooks допускается только через `major` и migration notes.
3. Недокументированные внутренние DOM-узлы не считаются публичным API.

## 4) Consumer override policy

1. Предпочтительный путь кастомизации: token override + `className`.
2. Override через хрупкие глубоко вложенные селекторы (`.a .b > .c`) не поддерживается как стабильный контракт.
3. Любой новый компонент перед merge обязан пройти checklist из `component-dod.md` (раздел Styling and tokens).

## 5) Component-level notes

1. Если у компонента есть особые hooks (`slotClassNames`, named slots, custom CSS variables), это явно описывается в его story/docs.
2. Для Tier-1 компонентов отдельный styling contract section обязателен и ведется в [Tier-1 styling contract](./tier-1-styling-contract.md).
3. Foundation-уровень typography/spacing/motion описан в [Typography/Spacing/Motion foundations module](./typography-spacing-motion-foundations.md).
