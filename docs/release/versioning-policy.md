# Versioning Policy

`@sloi/ui-kit` работает по strict semver с версии `1.0.0`.

## Semver contract

- `major` — только breaking changes.
- `minor` — новые backward-compatible возможности.
- `patch` — backward-compatible исправления и служебные изменения без API-сдвига.

## Правила

1. Никаких скрытых breaking изменений в `minor/patch`.
2. Каждый релиз обязан обновлять `CHANGELOG.md`.
3. Любой breaking change должен иметь migration notes.
4. Если изменение неочевидно по риску, оформляется RFC до реализации.
5. Для каждого релизного цикла формируется semver audit артефакт (`docs/release/semver-audit-YYYY-MM-DD.md`).
6. Изменения публичных exports/props/types/tokens/styling hooks дополнительно валидируются по [Public API semver contract](../governance/public-api-semver-contract.md).
7. Для multi-framework scope обязательно прохождение readiness gate (`pnpm run mf:validate`) перед release классификацией.

## Semver audit contract

1. Audit фиксирует user-visible изменения и их semver-класс.
2. Audit обязан явно отвечать, требуется ли `major`.
3. Решение из audit переносится в release checklist и changelog.

## Cadence

- По готовности (без календарной фиксации).
- Мейнтейнер репозитория отвечает за финальную классификацию версии.
