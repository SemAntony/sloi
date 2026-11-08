import {
  Badge,
  Button,
  DataTableV2,
  Input,
  Tooltip
} from '@sloi/ui-kit';
import '@sloi/ui-kit/styles.css';
import './styles.css';

type Invoice = {
  id: string;
  customer: string;
  amount: number;
};

const rows: Invoice[] = [
  { id: 'INV-9001', customer: 'Acme Co.', amount: 1200 },
  { id: 'INV-9002', customer: 'Globex', amount: 860 },
  { id: 'INV-9003', customer: 'Initech', amount: 430 }
];

export function PilotBillingScreen() {
  return (
    <section className='pilotSurface'>
      <header className='pilotHeader'>
        <div>
          <h1>Billing Queue</h1>
          <p>Operational pilot screen consuming @sloi/ui-kit.</p>
        </div>
        <Badge tone='info'>Pilot</Badge>
      </header>

      <div className='pilotFilters'>
        <Input placeholder='Search invoice' aria-label='Search invoice' />
        <Tooltip content='Apply active filters'>
          <Button variant='primary'>Apply filters</Button>
        </Tooltip>
      </div>

      <DataTableV2
        data={rows}
        rowKey='id'
        columns={[
          { id: 'id', header: 'Invoice', accessor: 'id', sortable: true, width: 160 },
          { id: 'customer', header: 'Customer', accessor: 'customer', sortable: true, width: 220 },
          { id: 'amount', header: 'Amount', accessor: 'amount', sortable: true, align: 'right', width: 140 }
        ]}
        enableColumnPinning
        enableColumnResize
        defaultPinnedColumns={{ left: ['id'], right: [] }}
        defaultColumnSizes={{ customer: 240 }}
      />
    </section>
  );
}
