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
      <Pagination navigationLabel='Pagination, page 2' totalItems={24} defaultPage={2} defaultPageSize={5} showPageSizeSelector={false} />
      <Pagination navigationLabel='Pagination, empty' totalItems={0} showPageSizeSelector={false} />
      <Pagination navigationLabel='Pagination, disabled' totalItems={94} disabled />
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

export const Localized: Story = {
  args: {
    totalItems: 127,
    navigationLabel: 'Страницы',
    labels: {
      previous: 'Назад',
      next: 'Вперёд',
      rows: 'Строк',
      summary: ({ from, to, total }) => `Показано ${from}–${to} из ${total}`
    }
  }
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};
