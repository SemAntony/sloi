import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  type TableDensity
} from './table';
import storyStyles from '../input/input.stories.module.scss';

const records = [
  { id: 'INV-1024', customer: 'Acme Co.', status: 'Paid', amount: '$1,240' },
  { id: 'INV-1025', customer: 'Northwind', status: 'Pending', amount: '$860' },
  { id: 'INV-1026', customer: 'Globex', status: 'Overdue', amount: '$2,140' },
  { id: 'INV-1027', customer: 'Initech', status: 'Paid', amount: '$430' }
];

const meta = {
  title: 'UI/Table',
  component: Table
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Invoice</TableHeaderCell>
          <TableHeaderCell>Customer</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell align='right'>Amount</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {records.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.customer}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell align='right'>{row.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
};

export const States: Story = {
  render: () => (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <Table striped>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Invoice</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Table stickyHeader density='compact' containerClassName={storyStyles.row}>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Customer</TableHeaderCell>
            <TableHeaderCell align='right'>Amount</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.customer}</TableCell>
              <TableCell align='right'>{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
};

const ControlledPreview = () => {
  const [density, setDensity] = useState<TableDensity>('comfortable');

  return (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <label className={storyStyles.meta} htmlFor='table-density'>
        Density
      </label>
      <select
        id='table-density'
        value={density}
        onChange={(event) => setDensity(event.target.value as TableDensity)}
      >
        <option value='comfortable'>comfortable</option>
        <option value='compact'>compact</option>
      </select>
      <Table density={density} striped>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Invoice</TableHeaderCell>
            <TableHeaderCell>Customer</TableHeaderCell>
            <TableHeaderCell align='right'>Amount</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.customer}</TableCell>
              <TableCell align='right'>{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
