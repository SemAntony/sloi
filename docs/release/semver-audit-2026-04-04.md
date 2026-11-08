# Semver Audit (AD-04) - 2026-04-04

Цель: формально проверить semver discipline для user-visible изменений в текущем `Unreleased` цикле.

## Scope

1. Публичный пакет `@sloi/ui-kit` (`package.json`, exports, public component API).
2. Публичный пакет `@sloi/tokens` (public CSS/JSON/JS exports).
3. User-visible docs/migration артефакты.

## Evidence

1. [Versioning policy](./versioning-policy.md)
2. [Breaking changes policy](./breaking-changes-policy.md)
3. [Release checklist](./release-checklist.md)
4. [CHANGELOG](/Users/sem/WebstormProjects/sloi-ui/CHANGELOG.md)
5. [UI-kit public exports](/Users/sem/WebstormProjects/sloi-ui/src/shared/ui/index.ts)
6. [UI-kit package exports](/Users/sem/WebstormProjects/sloi-ui/package.json)
7. [Tokens package exports](/Users/sem/WebstormProjects/sloi-ui/packages/tokens/package.json)

## User-visible changes and semver class

| Change | Surface | Compatibility | Semver class |
| --- | --- | --- | --- |
| `DataTableV2` enterprise regression/perf gates + perf note | `@sloi/ui-kit` docs/tests | Backward-compatible (API не ломается) | `patch` |
| Добавлен real consumer track в adoption pipeline | process/docs | Backward-compatible | `patch` |
| Colors вынесены в отдельный foundation module (`colors.css`) с сохранением aggregate entrypoint `styles.css` | `@sloi/tokens` | Backward-compatible; добавлен новый export без удаления старых | `minor` |
| Добавлены Stage B артефакты: feedback-loop + recipes + migration template | docs | Backward-compatible | `patch` |

## Breaking check

1. Удаления публичных экспортов: `0`.
2. Переименования публичных props/types: `0`.
3. Изменения default behavior с incompatibility-риском: `0` подтвержденных.
4. Требование `major` bump: не требуется.

## Decision

1. Текущий набор user-visible изменений соответствует `minor` релизу (`new backward-compatible capabilities`).
2. Допустимый release bump для этого цикла: `minor`.
3. `major` не требуется, так как breaking changes не обнаружены.
