import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { Alert } from '../alert';
import { Badge } from '../badge';
import { Button } from '../button';
import { type DataTableColumn } from '../data-table';
import { DataTableV2 } from '../data-table-v2';
import { FieldMessage } from '../field-message';
import { FilterBar } from '../filter-bar';
import { Icon, IconAlertTriangle, IconCheckCircle, IconDownload, IconFilter, IconPlus } from '../icon';
import { Input } from '../input';
import { Modal } from '../modal';
import { Checkbox, Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggleGroup, ToolbarToggleItem } from '../primitives';
import { Textarea } from '../textarea';
import styles from './product-patterns.stories.module.scss';

const meta = {
  title: 'UI/Patterns/Product Patterns'
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

type SearchRow = {
  id: string;
  title: string;
  owner: 'Platform' | 'Payments' | 'Growth';
  status: 'Open' | 'In Progress' | 'Done';
  priority: 'P1' | 'P2' | 'P3';
};

const searchRows: SearchRow[] = [
  {
    id: 'TASK-1201',
    title: 'Migrate dashboard filters to token-based spacing',
    owner: 'Platform',
    status: 'In Progress',
    priority: 'P1'
  },
  {
    id: 'TASK-1202',
    title: 'Improve table keyboard navigation in invoices',
    owner: 'Payments',
    status: 'Open',
    priority: 'P1'
  },
  {
    id: 'TASK-1203',
    title: 'Update onboarding copy in mobile sign-up flow',
    owner: 'Growth',
    status: 'Done',
    priority: 'P3'
  },
  {
    id: 'TASK-1204',
    title: 'Refactor shared modal footer actions',
    owner: 'Platform',
    status: 'Open',
    priority: 'P2'
  },
  {
    id: 'TASK-1205',
    title: 'Reduce alert noise with semantic badge mapping',
    owner: 'Growth',
    status: 'In Progress',
    priority: 'P2'
  }
];

type ReleaseRow = {
  id: string;
  version: string;
  channel: 'stable' | 'canary';
  status: 'ready' | 'blocked' | 'rolled-out';
  updatedAt: string;
};

const releaseRows: ReleaseRow[] = [
  { id: 'REL-901', version: '1.7.0', channel: 'stable', status: 'ready', updatedAt: '2026-04-02' },
  { id: 'REL-902', version: '1.7.1', channel: 'stable', status: 'rolled-out', updatedAt: '2026-04-01' },
  { id: 'REL-903', version: '1.8.0-beta.1', channel: 'canary', status: 'blocked', updatedAt: '2026-03-31' },
  { id: 'REL-904', version: '1.8.0-beta.2', channel: 'canary', status: 'ready', updatedAt: '2026-04-03' }
];

const releaseColumns: DataTableColumn<ReleaseRow>[] = [
  { id: 'version', header: 'Version', accessor: 'version', sortable: true, width: 220 },
  { id: 'channel', header: 'Channel', accessor: 'channel', sortable: true, width: 150 },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    width: 180,
    cell: (row) => (
      <Badge
        tone={row.status === 'blocked' ? 'danger' : row.status === 'rolled-out' ? 'success' : 'info'}
        appearance='subtle'
      >
        {row.status}
      </Badge>
    )
  },
  {
    id: 'updatedAt',
    header: 'Updated',
    sortable: true,
    width: 180,
    sortAccessor: (row) => new Date(row.updatedAt),
    cell: (row) => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(row.updatedAt))
  }
];

const AuthFormPreview = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberSession, setRememberSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !email.includes('@')) {
      setError('Enter a valid email to continue.');
      setSignedIn(false);
      return;
    }

    if (password.trim().length < 8) {
      setError('Password must contain at least 8 characters.');
      setSignedIn(false);
      return;
    }

    setError(null);
    setSignedIn(true);
  };

  return (
    <section className={styles.patternCard}>
      <header className={styles.patternHeader}>
        <h2 className={styles.title}>Auth form</h2>
        <p className={styles.subtitle}>Tier-1 sign-in flow with validation, helper text and explicit errors.</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor='auth-email'>
            Work email
          </label>
          <Input
            id='auth-email'
            type='email'
            value={email}
            invalid={Boolean(error && !email.includes('@'))}
            onChange={(event) => setEmail(event.target.value)}
            placeholder='name@company.com'
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor='auth-password'>
            Password
          </label>
          <Input
            id='auth-password'
            type='password'
            value={password}
            invalid={Boolean(error && password.length < 8)}
            onChange={(event) => setPassword(event.target.value)}
            placeholder='At least 8 characters'
          />
          <FieldMessage>Use your company SSO password.</FieldMessage>
        </div>

        <label className={styles.inlineControl} htmlFor='auth-remember'>
          <Checkbox
            id='auth-remember'
            checked={rememberSession}
            onCheckedChange={(checked) => setRememberSession(checked === true)}
          />
          Keep me signed in for 7 days
        </label>

        {error ? (
          <Alert
            tone='error'
            title='Cannot sign in'
            description={error}
            icon={<Icon icon={IconAlertTriangle} decorative size='sm' tone='danger' />}
          />
        ) : null}

        {signedIn ? (
          <Alert
            tone='success'
            title='Session created'
            description='Redirecting to your workspace.'
            icon={<Icon icon={IconCheckCircle} decorative size='sm' tone='success' />}
          />
        ) : null}

        <div className={styles.actions}>
          <Button type='submit'>Continue</Button>
        </div>
      </form>
    </section>
  );
};

const SearchAndFiltersPreview = () => {
  const [query, setQuery] = useState('');
  const [owner, setOwner] = useState<'all' | SearchRow['owner']>('all');
  const [status, setStatus] = useState<'all' | SearchRow['status']>('all');

  const filtered = useMemo(() => {
    return searchRows.filter((row) => {
      const byOwner = owner === 'all' ? true : row.owner === owner;
      const byStatus = status === 'all' ? true : row.status === status;
      const byQuery = query.trim()
        ? `${row.id} ${row.title} ${row.priority}`.toLowerCase().includes(query.trim().toLowerCase())
        : true;

      return byOwner && byStatus && byQuery;
    });
  }, [owner, query, status]);

  return (
    <section className={styles.patternCard}>
      <header className={styles.patternHeader}>
        <h2 className={styles.title}>Search + filters</h2>
        <p className={styles.subtitle}>Reusable discovery pattern for tickets, incidents and operational lists.</p>
      </header>

      <FilterBar
        query={query}
        onQueryChange={setQuery}
        onSearch={setQuery}
        onReset={() => {
          setQuery('');
          setOwner('all');
          setStatus('all');
        }}
        filters={
          <>
            <label className={styles.filterControl}>
              Owner
              <select
                value={owner}
                onChange={(event) => setOwner(event.target.value as 'all' | SearchRow['owner'])}
              >
                <option value='all'>All</option>
                <option value='Platform'>Platform</option>
                <option value='Payments'>Payments</option>
                <option value='Growth'>Growth</option>
              </select>
            </label>
            <label className={styles.filterControl}>
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as 'all' | SearchRow['status'])}
              >
                <option value='all'>All</option>
                <option value='Open'>Open</option>
                <option value='In Progress'>In Progress</option>
                <option value='Done'>Done</option>
              </select>
            </label>
          </>
        }
        actions={
          <Button size='sm' variant='secondary'>
            <Icon icon={IconFilter} decorative size='sm' />
            Save view
          </Button>
        }
      />

      <p className={styles.meta}>Found: {filtered.length}</p>

      <div className={styles.list}>
        {filtered.map((row) => (
          <article key={row.id} className={styles.listItem}>
            <div className={styles.itemTop}>
              <strong>{row.id}</strong>
              <Badge tone={row.priority === 'P1' ? 'danger' : row.priority === 'P2' ? 'warning' : 'neutral'} size='sm'>
                {row.priority}
              </Badge>
            </div>
            <p className={styles.itemTitle}>{row.title}</p>
            <p className={styles.itemMeta}>
              {row.owner} · {row.status}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

const TableToolbarPreview = () => {
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [channel, setChannel] = useState<'all' | ReleaseRow['channel']>('all');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const filteredRows = useMemo(() => {
    if (channel === 'all') {
      return releaseRows;
    }
    return releaseRows.filter((row) => row.channel === channel);
  }, [channel]);

  return (
    <section className={styles.patternCard}>
      <header className={styles.patternHeader}>
        <h2 className={styles.title}>Table toolbar</h2>
        <p className={styles.subtitle}>Operational table pattern with view toggles and bulk-selection support.</p>
      </header>

      <div className={styles.toolbarWrap}>
        <Toolbar aria-label='Release table controls'>
          <ToolbarToggleGroup
            type='single'
            value={density}
            onValueChange={(nextValue) => {
              if (nextValue === 'compact' || nextValue === 'comfortable') {
                setDensity(nextValue);
              }
            }}
            aria-label='Density'
          >
            <ToolbarToggleItem value='comfortable' aria-label='Comfortable density'>
              Comfortable
            </ToolbarToggleItem>
            <ToolbarToggleItem value='compact' aria-label='Compact density'>
              Compact
            </ToolbarToggleItem>
          </ToolbarToggleGroup>

          <ToolbarSeparator />

          <ToolbarToggleGroup
            type='single'
            value={channel}
            onValueChange={(nextValue) => {
              if (nextValue === 'all' || nextValue === 'stable' || nextValue === 'canary') {
                setChannel(nextValue);
              }
            }}
            aria-label='Release channel'
          >
            <ToolbarToggleItem value='all' aria-label='All channels'>
              All
            </ToolbarToggleItem>
            <ToolbarToggleItem value='stable' aria-label='Stable channel only'>
              Stable
            </ToolbarToggleItem>
            <ToolbarToggleItem value='canary' aria-label='Canary channel only'>
              Canary
            </ToolbarToggleItem>
          </ToolbarToggleGroup>

          <ToolbarSeparator />

          <ToolbarButton type='button' aria-label='Export releases'>
            <Icon icon={IconDownload} decorative size='sm' />
            Export CSV
          </ToolbarButton>
        </Toolbar>
      </div>

      <DataTableV2
        data={filteredRows}
        columns={releaseColumns}
        rowKey='id'
        density={density}
        showPagination={false}
        enableColumnPinning
        enableColumnResize
        rowSelection={{
          selectedKeys,
          onSelectedKeysChange: (nextKeys) => setSelectedKeys(nextKeys),
          renderBulkActions: ({ selectedRows, clearSelection }) => (
            <>
              <Button
                size='sm'
                variant='secondary'
                onClick={() => {
                  clearSelection();
                }}
              >
                Mark {selectedRows.length} as ready
              </Button>
              <Button
                size='sm'
                onClick={() => {
                  clearSelection();
                }}
              >
                Roll out now
              </Button>
            </>
          )
        }}
      />

      <p className={styles.meta}>Selected rows: {selectedKeys.length}</p>
    </section>
  );
};

type WorkflowStep = 'details' | 'review' | 'success';

const ModalWorkflowPreview = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<WorkflowStep>('details');
  const [workspaceName, setWorkspaceName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetFlow = () => {
    setStep('details');
    setWorkspaceName('');
    setNotes('');
    setError(null);
  };

  const closeModal = () => {
    setOpen(false);
    resetFlow();
  };

  return (
    <section className={styles.patternCard}>
      <header className={styles.patternHeader}>
        <h2 className={styles.title}>Modal workflow</h2>
        <p className={styles.subtitle}>Multi-step modal for review-driven actions with explicit confirmation.</p>
      </header>

      <Button onClick={() => setOpen(true)}>
        <Icon icon={IconPlus} decorative size='sm' />
        Create workspace
      </Button>

      <Modal
        open={open}
        title='Create workspace'
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            resetFlow();
          }
        }}
        onClose={resetFlow}
      >
        <div className={styles.workflowBody}>
          <Badge tone='info' appearance='subtle' size='sm'>
            {step === 'details' ? 'Step 1 of 3' : step === 'review' ? 'Step 2 of 3' : 'Step 3 of 3'}
          </Badge>

          {step === 'details' ? (
            <div className={styles.workflowSection}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor='workspace-name'>
                  Workspace name
                </label>
                <Input
                  id='workspace-name'
                  value={workspaceName}
                  invalid={Boolean(error)}
                  onChange={(event) => {
                    setWorkspaceName(event.target.value);
                    setError(null);
                  }}
                  placeholder='Analytics North America'
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor='workspace-notes'>
                  Notes
                </label>
                <Textarea
                  id='workspace-notes'
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder='Optional rollout notes for the team'
                />
              </div>
              {error ? <FieldMessage tone='error'>{error}</FieldMessage> : null}
              <div className={styles.actions}>
                <Button variant='ghost' onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!workspaceName.trim()) {
                      setError('Workspace name is required.');
                      return;
                    }
                    setStep('review');
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          ) : null}

          {step === 'review' ? (
            <div className={styles.workflowSection}>
              <Alert
                tone='warning'
                title='Review before creation'
                description='Once created, workspace region and slug cannot be changed.'
                icon={<Icon icon={IconAlertTriangle} decorative size='sm' tone='warning' />}
              />

              <div className={styles.summary}>
                <p>
                  <strong>Name:</strong> {workspaceName}
                </p>
                <p>
                  <strong>Notes:</strong> {notes.trim() || 'No notes'}
                </p>
              </div>

              <div className={styles.actions}>
                <Button variant='ghost' onClick={() => setStep('details')}>
                  Back
                </Button>
                <Button onClick={() => setStep('success')}>Create</Button>
              </div>
            </div>
          ) : null}

          {step === 'success' ? (
            <div className={styles.workflowSection}>
              <Alert
                tone='success'
                title='Workspace created'
                description='Team access and default dashboards were provisioned successfully.'
                icon={<Icon icon={IconCheckCircle} decorative size='sm' tone='success' />}
              />
              <div className={styles.actions}>
                <Button variant='secondary' onClick={closeModal}>
                  Open workspace
                </Button>
                <Button
                  variant='ghost'
                  onClick={() => {
                    resetFlow();
                    setOpen(true);
                  }}
                >
                  Create another
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
    </section>
  );
};

export const AuthForm: Story = {
  render: () => <AuthFormPreview />
};

export const SearchAndFilters: Story = {
  render: () => <SearchAndFiltersPreview />
};

export const TableToolbar: Story = {
  render: () => <TableToolbarPreview />
};

export const ModalWorkflow: Story = {
  render: () => <ModalWorkflowPreview />
};
