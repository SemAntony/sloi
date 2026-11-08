import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { type DataTableColumn } from '../data-table';
import { DataTableV2 } from './index';

type BenchmarkRow = {
  id: string;
  label: string;
  status: 'paid' | 'pending' | 'overdue';
  amount: number;
};

const referenceRows: BenchmarkRow[] = Array.from({ length: 10_000 }, (_, index) => {
  const number = index + 1;
  return {
    id: `INV-${number.toString().padStart(5, '0')}`,
    label: `Account ${number}`,
    status: number % 3 === 0 ? 'overdue' : number % 2 === 0 ? 'pending' : 'paid',
    amount: 80 + number * 3
  };
});

const referenceColumns: DataTableColumn<BenchmarkRow>[] = [
  { id: 'id', header: 'ID', accessor: 'id', sortable: true, width: 180 },
  { id: 'label', header: 'Label', accessor: 'label', sortable: true, width: 260 },
  { id: 'status', header: 'Status', accessor: 'status', sortable: true, width: 160 },
  { id: 'amount', header: 'Amount', accessor: 'amount', sortable: true, align: 'right' as const, width: 160 }
];

const PERF_BUDGET = {
  ttfsrMs: 1500,
  minFps: 50,
  maxLongTaskMs: 120
} as const;

const SCROLL_STEPS = 48;
const SCROLL_ROWS_PER_STEP = 22;

function nextTick(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

type PerfMetrics = {
  ttfsrMs: number;
  averageFps: number;
  averageFrameMs: number;
  maxLongTaskMs: number;
  sampleSize: number;
};

async function runCombinedModeBenchmark(): Promise<PerfMetrics> {
  const ttfsrStart = performance.now();

  render(
    <div style={{ width: '1280px' }}>
      <DataTableV2
        data={referenceRows}
        columns={referenceColumns}
        rowKey='id'
        showPagination={false}
        enableColumnPinning
        defaultPinnedColumns={{
          left: ['id'],
          right: ['amount']
        }}
        enableColumnResize
        defaultColumnSizes={{
          label: 260
        }}
        enableVirtualization
        rowHeight={44}
        overscan={8}
      />
    </div>
  );

  await screen.findByText('INV-00001');
  const ttfsrMs = performance.now() - ttfsrStart;

  const resizeHandle = screen.getByRole('button', { name: 'Resize column Label' });
  fireEvent.pointerDown(resizeHandle, { button: 0, clientX: 320 });
  fireEvent.pointerMove(window, { clientX: 392 });
  fireEvent.pointerUp(window);

  const viewport = screen.getByLabelText('DataTable virtualized viewport') as HTMLElement & { scrollTop: number };
  const frameDurations: number[] = [];
  let scrollTop = 0;

  for (let step = 0; step < SCROLL_STEPS; step += 1) {
    scrollTop += 44 * SCROLL_ROWS_PER_STEP;
    const frameStart = performance.now();
    viewport.scrollTop = scrollTop;
    fireEvent.scroll(viewport, { target: { scrollTop } });
    await nextTick();
    frameDurations.push(performance.now() - frameStart);
  }

  const totalFrameMs = frameDurations.reduce((sum, value) => sum + value, 0);
  const averageFrameMs = totalFrameMs / frameDurations.length;
  const averageFps = 1000 / averageFrameMs;
  const maxLongTaskMs = Math.max(...frameDurations);

  return {
    ttfsrMs,
    averageFps,
    averageFrameMs,
    maxLongTaskMs,
    sampleSize: frameDurations.length
  };
}

describe('DataTableV2 perf budget', () => {
  it('meets TTFSR/FPS/long-task KPI in combined enterprise mode', async () => {
    const metrics = await runCombinedModeBenchmark();

    console.info(
      `[DataTableV2 perf] TTFSR=${metrics.ttfsrMs.toFixed(2)}ms; ` +
        `avgFrame=${metrics.averageFrameMs.toFixed(2)}ms; ` +
        `FPS=${metrics.averageFps.toFixed(2)}; ` +
        `maxLongTask=${metrics.maxLongTaskMs.toFixed(2)}ms; ` +
        `samples=${metrics.sampleSize}`
    );

    expect(metrics.ttfsrMs).toBeLessThanOrEqual(PERF_BUDGET.ttfsrMs);
    expect(metrics.averageFps).toBeGreaterThanOrEqual(PERF_BUDGET.minFps);
    expect(metrics.maxLongTaskMs).toBeLessThan(PERF_BUDGET.maxLongTaskMs);
  });
});
