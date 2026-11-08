# Governance

Этот слой фиксирует операционные правила для развития UI-kit и снижает риск хаотичных API-изменений.

## Документы

- [Owner matrix](./owners.md)
- [RFC template](./rfc-template.md)
- [Component Definition of Done](./component-dod.md)
- [Controlled/uncontrolled contract](./controlled-uncontrolled-contract.md)
- [Styling contract](./styling-contract.md)
- [Tier-1 styling contract](./tier-1-styling-contract.md)
- [Tier-1 components](./tier-1-components.md)
- [Tier-1 test coverage matrix](./tier-1-test-coverage-matrix.md)
- [Storybook standards](./storybook-standards.md)
- [Storybook testing rules](./storybook-testing.md)
- [Maturity definition](./maturity-definition.md)
- [Color foundations module](./color-foundations.md)
- [Typography/Spacing/Motion foundations module](./typography-spacing-motion-foundations.md)
- [Iconography and color token policy](./iconography-color-token-policy.md)
- [Icon use-case evidence registry](./icon-use-case-evidence.md)
- [Icon accessibility contract](./icon-a11y-contract.md)
- [Public API semver contract](./public-api-semver-contract.md)
- [Headless core boundary](./headless-core-boundary.md)
- [Thin wrappers contract](./wrapper-thin-contract.md)
- [Multi-framework readiness gate](./multi-framework-readiness.md)
- [Icon/Token change request template](./icon-token-change-request-template.md)
- [Iconography + color tokens one-pager](./iconography-color-token-one-pager.md)

## Когда RFC обязателен

RFC нужен до реализации, если выполняется хотя бы одно условие:

1. Добавляется новый публичный компонент.
2. Меняется публичный API существующего компонента.
3. Меняется поведение компонента, которое может затронуть продукты.
4. Добавляется или удаляется foundation-токен с кросс-компонентным эффектом.
5. Планируется любое breaking изменение.

## Кто утверждает RFC

1. `Primary owner` по зоне из [owner matrix](./owners.md).
2. `Backup owner` той же зоны.
3. Для breaking-изменений дополнительно owner release-процесса.

## Что считается blocking

1. Нужен RFC, но он не создан или не утвержден.
2. Не закрыт [Definition of Done](./component-dod.md).
3. Есть нерешенный a11y/regression риск.
4. Нет migration notes для изменений API/поведения.
5. Не прошли required checks из CI (`typecheck`, `lint`, `test`, `test-a11y`, `storybook-build`, `adoption-metrics`, `multi-framework-readiness`).
6. Тяжелые `DataTable` фичи (`pinning`, `resize`, `virtualization`) предлагаются в `V1`, а не через отдельные `V2 RFC` + `V2 roadmap`.
