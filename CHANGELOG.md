# Changelog

## [Unreleased] (до перехода на Changesets)

> Записи ниже написаны вручную в формате [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) до перехода на
> [Changesets](https://github.com/changesets/changesets); проект следует [SemVer](https://semver.org/spec/v2.0.0.html).
> Они войдут в первый релиз, собранный через Changesets (см. `.changeset/`). Новые записи генерируются выше этого
> раздела командой `pnpm version-packages`, вручную их добавлять не нужно (см. «Версии и релизы» в `README.md`).

### Added
- Подпути экспорта `@sloi/ui-kit/date-picker` и `@sloi/ui-kit/data-table-v2` (ESM/CJS и типы); тяжёлые компоненты подключаются отдельно от корня. Решение и критерии: `docs/architecture/EXPORT-SUBPATHS.md`.
- Gate после сборки `scripts/verify-exports.mjs`: `exports` не ссылается на отсутствующие файлы, в публичных `.d.ts` нет типов тяжёлых зависимостей; бюджеты размера в `mf:validate` теперь по каждому входу.
- Тесты для `Table`, `Textarea`, `NumberField`, `PhoneField`, `SearchInput`, `FilterBar` и glyph-компонентов примитивов.
- `Button`: `loading` (`aria-busy` + `aria-disabled`, клики блокируются, кнопка остаётся фокусируемой, CSS-спиннер), вариант `danger`, декоративные слоты `startIcon`/`endIcon` (работают и с `asChild`).
- Токены `--sloi-interactive-danger-{bg,bg-hover,bg-active,text,shadow}` (контраст текста проверяется `tokens:contrast`).
- Root public API export for `DataTableV2` (`src/shared/ui/index.ts`).
- Migration notes for DataTable V2 column pinning adoption.
- Pilot consumer app for adoption metrics baseline (`consumers/sloi-pilot`).
- Second real consumer for adoption metrics baseline (`consumers/sloi-analytics`).
- DataTable V2 column resize API (`enableColumnResize`, controlled/uncontrolled `columnSizes`, `min/max` limits).
- DataTable V2 resize migration notes.
- DataTable V2 virtualization API (`enableVirtualization`, `rowHeight`, `overscan`).
- Virtualization stories (`VirtualizationSmallDataset`, `VirtualizationLargeDataset`) with keyboard interaction flow.
- DataTable V2 virtualization migration notes.
- Curated icon library exports (`68` icons) with `Icon*` aliases via `src/shared/ui/icon/icons.ts`.
- Icon catalog Storybook showcase for curated categories and naming.
- Governance docs for icon/token intake flow: one-pager, change-request template, and GitHub issue form.
- Workspace package `@sloi/tokens` with public CSS exports and generated JSON/JS token artifacts.
- Stage B adoption docs: feedback loop backlog and copy-paste recipes (`form`, `modal form`, `table + filters`).
- Integration migration notes with consumer rollout template for `DataTableV2` enterprise profile.
- Semver audit artifact for current cycle (`docs/release/semver-audit-2026-04-04.md`).
- Typography/Spacing/Motion foundations module with explicit usage contracts and reference snippets (`docs/governance/typography-spacing-motion-foundations.md`).
- Motion token scale in `@sloi/tokens` (`duration` + `easing`) with synced JSON/JS artifacts.
- Icon governance artifacts for Stage C:
  - use-case evidence registry (`docs/governance/icon-use-case-evidence.md`);
  - icon accessibility contract (`docs/governance/icon-a11y-contract.md`).
- Product-level pattern stories for Stage C (`auth form`, `search + filters`, `table toolbar`, `modal workflow`) in `src/shared/ui/patterns/product-patterns.stories.tsx`.
- Public API semver contract for multi-framework rollout gate (`docs/governance/public-api-semver-contract.md`).
- Workspace package `@sloi/headless-core` with shared controllers for `Dialog`, `Select`, `Tabs`, `Tooltip`, and `Combobox`.
- Thin wrappers governance contract (`docs/governance/wrapper-thin-contract.md`) and Lit wrappers scaffold (`packages/lit-wrappers`).
- Multi-framework readiness gate artifacts for MF-04:
  - readiness validator script (`scripts/multi-framework-readiness.ts`);
  - parity manifest (`docs/governance/multi-framework-a11y-parity.json`);
  - readiness governance spec (`docs/governance/multi-framework-readiness.md`);
  - TS DX smoke fixture (`src/test/fixtures/multi-framework/*`);
  - readiness CI artifact (`reports/multi-framework/latest.json`).

### Changed
- `react-day-picker` (вместе с `date-fns` и `@date-fns/tz`) больше не вшивается в бандл: он стал внешней `dependency` пакета и устанавливается автоматически. Его CSS остаётся внутри единого `styles.css`. `dist/index.js` 231 KB → 81 KB raw (остальное в общих чанках).
- `OneTimePasswordField` и `PasswordToggleField` (обёртки над `unstable_*` из radix-ui) явно помечены как experimental: `@experimental` в JSDoc, тег `experimental` и описание в stories. Из экспорта не убраны, чтобы не ломать текущих потребителей; API не считается semver-stable до выхода из эксперимента (см. `docs/governance/public-api-semver-contract.md`).
- Индикаторы примитивов (`ChevronDown/Up/Right`, `Check`, `Dot`) теперь svg-иконки из курируемого набора вместо текстовых глифов «▾ ▴ ▸ ✓ •»; размер по-прежнему задаётся `font-size` родителя.
- DataTable V2 column pinning RFC moved to `Accepted` with resolved rollout decisions.
- Column pinning Phase 1 checklist closed (including docs/release + sign-off records).
- DataTable V2 column resize RFC moved to `Accepted` with acceptance validation and owner sign-off.
- DataTable V2 roadmap updated: Phase 2 (`column resize`) marked as complete.
- Column resize Phase 2 checklist closed.
- DataTable V2 virtualization RFC moved to `Accepted`, including reference dataset definition.
- DataTable V2 roadmap updated: Phase 3 (`virtualization`) moved from pending to started.
- Icon foundation docs aligned with curated icon baseline and token governance KPIs.
- `@sloi/ui-kit` style entry switched to consume tokens from `@sloi/tokens`.
- Release policy/checklist synced with mandatory semver audit step and Stage B migration artifacts.
- Tier-1 motion styles moved to token-driven timing/easing for `Button`, `Input`, `Dialog`, `Select`, `DropdownMenu`, and `Tooltip`.
- `DataTableV2` governance artifacts synchronized: phase status and owner sign-off registry updated across roadmap/checklists and virtualization RFC.
- `DataTableV2` roadmap status refreshed: Phase 3 (`virtualization`) is marked complete with sign-off, Phase 4 (`adoption and GA`) is marked started.
- Icon governance policy/template/index docs synchronized with mandatory evidence registry and a11y contract references.
- Icon stories/tests strengthened with explicit accessibility contract examples and runtime guard coverage.
- Release checklist now validates changes against the public API semver contract before version classification.
- `Dialog`, `Select`, `Tabs`, `Tooltip`, and `Combobox` wrappers now consume shared headless controllers from `@sloi/headless-core`.
- Multi-framework static contract test enforces React thin-wrapper boundary and Lit wrapper scaffold readiness.
- Quality gate now includes `multi-framework-readiness` check (`pnpm run mf:validate`) with bundle budgets, TS DX validation, and a11y parity baseline enforcement.

### Deprecated
- Импорт `DatePicker` и `DataTableV2` из корня `@sloi/ui-kit`: используйте `@sloi/ui-kit/date-picker` и `@sloi/ui-kit/data-table-v2`. Экспорт из корня будет удалён в следующем major.

### Removed
- None.

### Fixed
- `Input`, `Textarea`, `NumberField`, `PhoneField`, `SearchInput`: явный `aria-invalid="false"` больше не перебивает `invalid`.
- `NumberField`: шаг `0.1` больше не накапливает float-ошибку (`0.30000000000000004`).
- DataTable V2 layout regression coverage for constrained viewport and `pinning + resize` combination.
- Test environment pointer-event support for stable resize interaction tests in jsdom.
- DataTable V2 virtualization regression coverage for overscan windowing and focused-row stability on scroll.

### Security
- None.

## [1.0.0] - 2026-03-30

### Added
- Stable Core governance/release/adoption policy docs.
- DataTable V2 backlog definition and DataTable V1 freeze policy docs.
- Initial `adoption:metrics` CLI contract for local JSON reporting.

### Changed
- Package version promoted to `1.0.0`.
- Release policy moved to strict semver with explicit major/minor/patch contract.

### Deprecated
- None.

### Removed
- None.

### Fixed
- None.

### Security
- None.
