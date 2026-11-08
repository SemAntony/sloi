import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './pagination';
import storyStyles from '../input/input.stories.module.scss';

const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  args: {
    totalItems: 127,
    defaultPageSize: 10
  }
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <Pagination totalItems={24} defaultPage={2} defaultPageSize={5} showPageSizeSelector={false} />
      <Pagination totalItems={0} showPageSizeSelector={false} />
      <Pagination totalItems={94} disabled />
    </div>
  )
};

const ControlledPreview = () => {
  const [page, setPage] = useState(3);
  const [pageSize, setPageSize] = useState(20);

  return (
    <div className={storyStyles.stack} style={{ width: '100%' }}>
      <Pagination
        totalItems={476}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[10, 20, 40, 80]}
      />
      <p className={storyStyles.meta}>
        Controlled state: page {page}, page size {pageSize}
      </p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
