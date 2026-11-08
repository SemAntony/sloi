# Public API Semver Contract (Multi-Framework Gate)

Документ фиксирует semver-critical контракт публичного API для `@sloi/ui-kit` и связанных пакетов перед масштабированием на multi-framework модель.

Дата baseline: `2026-04-06`.

## 1) Что считается публичным API

Следующие поверхности считаются стабильным публичным контрактом и не могут меняться без semver-классификации:

1. Entry points и package exports:
   - `@sloi/ui-kit` (runtime + types из root export);
   - `@sloi/ui-kit/styles.css`;
   - `@sloi/tokens` публичные CSS/JSON/JS артефакты.
2. Контракт компонентов:
   - имена публичных props и callbacks;
   - формы controlled/uncontrolled API;
   - documented default behavior.
3. Контракт стилизации:
   - documented `className` hooks;
   - documented `data-*` state hooks.
4. Foundation contract:
   - имена semantic tokens и их назначение;
   - documented icon contract (size/tone/a11y semantics).
5. Публичные TypeScript типы, экспортируемые из entry points.
6. Документированные a11y/interaction guarantees (keyboard/focus/ARIA), если они обозначены как стабильные.

## 2) Semver classification matrix

| Изменение | Semver класс | Обязательные артефакты |
| --- | --- | --- |
| Новый backward-compatible export/компонент/проп | `minor` | changelog + docs + tests |
| Новый optional token без изменения текущего значения/смысла существующих | `minor` | changelog + foundations docs |
| Internal refactor без API/behavior drift | `patch` | tests + changelog (`Fixed`/`Changed`) |
| Переименование/удаление export, prop, callback, type, token | `major` | RFC + migration notes + semver audit + changelog |
| Изменение semantics existing prop/callback/token | `major` | RFC + migration notes + semver audit + changelog |
| Изменение default behavior, ломающее ожидаемый UX | `major` | RFC + migration notes + semver audit + changelog |
| Удаление documented styling hook (`className`/`data-*`) | `major` | RFC + migration notes + styling docs update |
| Изменение documented keyboard/focus contract | `major` | RFC + migration notes + a11y regression validation |

Правило неопределенности: если semver-класс неочевиден, изменение временно классифицируется как `major`, пока semver audit не докажет обратное.

## 3) Multi-framework parity contract

Для staged rollout (`headless core` + wrappers) вводятся обязательные правила:

1. Canonical behavior описывается на уровне общей логики (`core`), wrappers не должны менять semantics.
2. Wrappers обязаны сохранять parity по:
   - state transitions;
   - callback timing/order;
   - keyboard and focus behavior;
   - ARIA contract;
   - documented styling hooks.
3. Wrapper-specific sugar допускается только как additive API и не должен ломать core contract.
4. Фича не может считаться `stable` в multi-framework режиме, если parity не подтвержден хотя бы в двух рантаймах из target scope.
5. Экспериментальные API должны быть явно маркированы в docs/stories как `Experimental` и не считаются semver-stable до формального выпуска из эксперимента.

## 4) Release gate для semver-critical изменений

Для каждого user-visible изменения, затрагивающего публичный API:

1. Обновить `CHANGELOG.md`.
2. Обновить/создать `semver-audit-YYYY-MM-DD.md`.
3. Добавить migration notes для `major` и high-risk `minor` изменений.
4. Проверить синхронизацию с профильными governance docs:
   - controlled/uncontrolled;
   - styling contract;
   - foundations/icon policy.
5. Пройти quality gates:
   - `pnpm run typecheck`
   - `pnpm run lint`
   - `pnpm run test`
   - `pnpm run test:a11y`
   - `pnpm run storybook:build`
   - `pnpm run adoption:metrics:ci`
   - `pnpm run mf:validate`

## 5) Ownership и approval flow

1. Primary approval: Design System Core owner.
2. Secondary approval: Release owner.
3. Для multi-framework API изменений добавляется согласование Frontend Platform owner.
4. Любой потенциальный breaking change без RFC считается blocking для merge.

## 6) Связанные документы

1. [Versioning policy](../release/versioning-policy.md)
2. [Breaking changes policy](../release/breaking-changes-policy.md)
3. [Release checklist](../release/release-checklist.md)
4. [Controlled/uncontrolled contract](./controlled-uncontrolled-contract.md)
5. [Styling contract](./styling-contract.md)
6. [Tier-1 styling contract](./tier-1-styling-contract.md)
7. [Iconography and color token policy](./iconography-color-token-policy.md)
8. [Design system execution plan](../backlog/design-system-execution-plan.md)
9. [Headless core boundary](./headless-core-boundary.md)
10. [Thin wrappers contract](./wrapper-thin-contract.md)
11. [Multi-framework readiness gate](./multi-framework-readiness.md)
