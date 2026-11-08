# Release Checklist

Обязательный чеклист перед любым релизом UI-kit.

## 1) Quality gates

1. `pnpm run typecheck`
2. `pnpm run lint`
3. `pnpm run test`
4. `pnpm run test:a11y`
5. `pnpm run storybook:build`
6. `pnpm run adoption:metrics:ci`
7. `pnpm run mf:validate`

## 2) Change validation

1. Проверить, что версия соответствует semver contract:
   - `major` для breaking;
   - `minor` для новых совместимых фич;
   - `patch` для фиксов.
2. Проверить соответствие изменения документу [Public API semver contract](../governance/public-api-semver-contract.md), если затронуты публичные exports/props/types/tokens/styling hooks.
3. Обновить/создать semver audit артефакт:
   - `docs/release/semver-audit-YYYY-MM-DD.md`;
   - ссылка на audit добавлена в `docs/index.md`.
4. Обновить `CHANGELOG.md`:
   - `Added`
   - `Changed`
   - `Deprecated`
   - `Removed`
   - `Fixed`
   - `Security`
5. Для breaking-изменений проверить наличие migration section.

## 3) Docs and policy sync

1. Проверить ссылки и актуальность:
   - `docs/governance/*`
   - `docs/release/*`
   - `docs/adoption/*`
   - `docs/backlog/*`
2. Убедиться, что freeze/backlog политики не нарушены.

## 4) Release action

1. Обновить версию в `package.json`.
2. Сформировать релизный тег.
3. Опубликовать артефакты.

## Required checks for branch protection

В GitHub branch protection для основной ветки добавить обязательные статусы:

1. `typecheck`
2. `lint`
3. `test`
4. `test-a11y`
5. `storybook-build`
6. `adoption-metrics`
7. `multi-framework-readiness`
