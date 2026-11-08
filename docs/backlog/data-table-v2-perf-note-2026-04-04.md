# DataTableV2 Perf Note (2026-04-04)

Цель: закрыть KPI из virtualization RFC/checklist для enterprise combined mode (`pinning + resize + virtualization`).

## Scenario

1. Dataset: `10,000` rows.
2. Columns: `4` (`id`, `label`, `status`, `amount`).
3. Row height: `44`.
4. Viewport width: `1280px`.
5. Mode: `enableColumnPinning`, `enableColumnResize`, `enableVirtualization`.
6. Test harness: `src/shared/ui/data-table-v2/data-table-v2.perf.test.tsx`.

## Budget vs measured

| KPI | Budget | Measured (`2026-04-04`) | Result |
| --- | --- | --- | --- |
| Time to first stable table render | `<= 1500ms` | `49.17ms` | pass |
| Average scroll frame rate | `>= 50 FPS` | `62.27 FPS` | pass |
| Max long task during scroll | `< 120ms` | `60.81ms` | pass |

## Command

```bash
pnpm run test -- src/shared/ui/data-table-v2/data-table-v2.perf.test.tsx
```

Stdout snapshot:

```text
[DataTableV2 perf] TTFSR=49.17ms; avgFrame=16.06ms; FPS=62.27; maxLongTask=60.81ms; samples=48
```

## Notes

1. KPI проверяются как deterministic CI proxy в jsdom через последовательность scroll frames.
2. Для product profiling на реальном рантайме можно дополнительно запускать browser-level профилирование, но gate для RFC/checklist закрывается этим automation-артефактом.
