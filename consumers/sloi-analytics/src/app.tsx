import {
  Badge,
  DataTableV2,
  Input,
  Select,
  ToggleGroup,
  Tooltip
} from '@sloi/ui-kit';
import '@sloi/ui-kit/styles.css';
import './styles.css';

type EventRow = {
  id: string;
  user: string;
  action: string;
  impact: number;
};

const eventRows: EventRow[] = Array.from({ length: 220 }, (_, index) => {
  const number = index + 1;
  return {
    id: `EVT-${4000 + number}`,
    user: `Analyst ${number}`,
    action: number % 3 === 0 ? 'export' : number % 2 === 0 ? 'query' : 'update',
    impact: 20 + number * 3
  };
});

export function AnalyticsQueueScreen() {
  return (
    <section className='analyticsSurface'>
      <header className='analyticsHeader'>
        <div>
          <h1>Insights Queue</h1>
          <p>Pilot analytics consumer with virtualized DataTableV2 usage.</p>
        </div>
        <Badge tone='success'>Live pilot</Badge>
      </header>

      <div className='analyticsFilters'>
        <Input placeholder='Search events' aria-label='Search events' />
        <Select aria-label='Event type' defaultValue='all'>
          <option value='all'>All events</option>
          <option value='query'>Query</option>
          <option value='update'>Update</option>
          <option value='export'>Export</option>
        </Select>
        <Tooltip content='Toggle aggregation mode'>
          <ToggleGroup type='single' defaultValue='daily' aria-label='Aggregation mode'>
            <button value='hourly'>Hourly</button>
            <button value='daily'>Daily</button>
            <button value='weekly'>Weekly</button>
          </ToggleGroup>
        </Tooltip>
      </div>

      <DataTableV2
        data={eventRows}
        rowKey='id'
        showPagination={false}
        enableColumnResize
        enableColumnPinning
        enableVirtualization
        rowHeight={44}
        overscan={8}
        defaultPinnedColumns={{ left: ['id'], right: [] }}
        columns={[
          { id: 'id', header: 'Event ID', accessor: 'id', sortable: true, width: 180 },
          { id: 'user', header: 'User', accessor: 'user', sortable: true, width: 220 },
          { id: 'action', header: 'Action', accessor: 'action', sortable: true, width: 160 },
          { id: 'impact', header: 'Impact', accessor: 'impact', sortable: true, align: 'right', width: 140 }
        ]}
      />
    </section>
  );
}
