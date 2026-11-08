import {
  Badge,
  Button,
  DataTableV2,
  Input,
  Select,
  Tooltip
} from '@sloi/ui-kit';
import '@sloi/ui-kit/styles.css';
import './styles.css';

type OpsRow = {
  id: string;
  service: string;
  owner: string;
  priority: 'p1' | 'p2' | 'p3';
  status: 'open' | 'investigating' | 'resolved';
};

const opsRows: OpsRow[] = Array.from({ length: 1400 }, (_, index) => {
  const number = index + 1;
  return {
    id: `OPS-${8000 + number}`,
    service: `Service ${number % 27}`,
    owner: `On-call ${number % 13}`,
    priority: number % 7 === 0 ? 'p1' : number % 3 === 0 ? 'p2' : 'p3',
    status: number % 5 === 0 ? 'investigating' : number % 2 === 0 ? 'open' : 'resolved'
  };
});

export function OperationsControlRoom() {
  return (
    <section className='opsSurface'>
      <header className='opsHeader'>
        <div>
          <h1>Operations Control Room</h1>
          <p>Production-track consumer using DataTableV2 enterprise feature set.</p>
        </div>
        <Badge tone='warning'>Real consumer</Badge>
      </header>

      <div className='opsFilters'>
        <Input aria-label='Search incidents' placeholder='Search incidents' />
        <Select aria-label='Incident status' defaultValue='all'>
          <option value='all'>All statuses</option>
          <option value='open'>Open</option>
          <option value='investigating'>Investigating</option>
          <option value='resolved'>Resolved</option>
        </Select>
        <Tooltip content='Apply current incident filters'>
          <Button variant='primary'>Apply filters</Button>
        </Tooltip>
      </div>

      <DataTableV2
        data={opsRows}
        rowKey='id'
        showPagination={false}
        enableColumnPinning
        enableColumnResize
        enableVirtualization
        rowHeight={44}
        overscan={8}
        defaultPinnedColumns={{ left: ['id'], right: ['priority'] }}
        defaultColumnSizes={{ service: 260, owner: 220 }}
        columns={[
          { id: 'id', header: 'Incident', accessor: 'id', sortable: true, width: 180 },
          { id: 'service', header: 'Service', accessor: 'service', sortable: true, width: 240 },
          { id: 'owner', header: 'Owner', accessor: 'owner', sortable: true, width: 200 },
          { id: 'priority', header: 'Priority', accessor: 'priority', sortable: true, width: 140 },
          { id: 'status', header: 'Status', accessor: 'status', sortable: true, width: 170 }
        ]}
      />
    </section>
  );
}
