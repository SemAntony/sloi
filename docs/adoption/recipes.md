# Adoption Recipes (AD-03)

Документ содержит copy-paste рецепты для самых частых consumer-сценариев Stage B.

Обновлено: `2026-04-06`.

## Sources

1. [Form examples story](../../src/shared/ui/patterns/form-examples.stories.tsx)
2. [Data examples story](../../src/shared/ui/patterns/data-examples.stories.tsx)
3. [Modal story](../../src/shared/ui/modal/modal.stories.tsx)
4. [FilterBar story](../../src/shared/ui/filter-bar/filter-bar.stories.tsx)
5. [Product patterns story](../../src/shared/ui/patterns/product-patterns.stories.tsx)

## Product Patterns (PT-01)

Каноничные product-level паттерны для Stage C доступны в [Product patterns story](../../src/shared/ui/patterns/product-patterns.stories.tsx):

1. `AuthForm`
2. `SearchAndFilters`
3. `TableToolbar`
4. `ModalWorkflow`

## 1) Recipe: Form (Input + validation + submit)

```tsx
import { useState } from 'react';
import { Button, FieldMessage, Input, Textarea } from '@sloi/ui-kit';

type ProfileFormState = {
  name: string;
  email: string;
  notes: string;
};

export function ProfileSettingsForm() {
  const [values, setValues] = useState<ProfileFormState>({
    name: '',
    email: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormState, string>>>({});
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof ProfileFormState, string>> = {};
    if (!values.name.trim()) nextErrors.name = 'Name is required.';
    if (!values.email.trim() || !values.email.includes('@')) nextErrors.email = 'Enter a valid email.';

    setErrors(nextErrors);
    setSaved(Object.keys(nextErrors).length === 0);
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <label htmlFor='profile-name'>Name</label>
      <Input
        id='profile-name'
        value={values.name}
        invalid={Boolean(errors.name)}
        onChange={(event) => update('name', event.target.value)}
        placeholder='Jane Doe'
      />
      {errors.name ? <FieldMessage tone='error'>{errors.name}</FieldMessage> : null}

      <label htmlFor='profile-email'>Email</label>
      <Input
        id='profile-email'
        type='email'
        value={values.email}
        invalid={Boolean(errors.email)}
        onChange={(event) => update('email', event.target.value)}
        placeholder='jane@example.com'
      />
      {errors.email ? <FieldMessage tone='error'>{errors.email}</FieldMessage> : null}

      <label htmlFor='profile-notes'>Notes</label>
      <Textarea
        id='profile-notes'
        value={values.notes}
        onChange={(event) => update('notes', event.target.value)}
        placeholder='Optional context'
      />

      <Button type='submit'>Save settings</Button>
      {saved ? <FieldMessage tone='success'>Saved successfully.</FieldMessage> : null}
    </form>
  );
}
```

## 2) Recipe: Modal Form (create/edit flow)

```tsx
import { useState } from 'react';
import { Button, FieldMessage, Input, Modal } from '@sloi/ui-kit';

type InviteFormState = {
  email: string;
  role: string;
};

export function InviteMemberModal() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<InviteFormState>({ email: '', role: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.email.includes('@')) {
      setError('Enter a valid email.');
      return;
    }
    if (!values.role.trim()) {
      setError('Role is required.');
      return;
    }

    setError(null);
    setOpen(false);
    setValues({ email: '', role: '' });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Invite member</Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        onClose={() => setOpen(false)}
        title='Invite member'
      >
        <form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: 12 }}>
          <label htmlFor='invite-email'>Email</label>
          <Input
            id='invite-email'
            type='email'
            value={values.email}
            onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
            placeholder='member@company.com'
          />

          <label htmlFor='invite-role'>Role</label>
          <Input
            id='invite-role'
            value={values.role}
            onChange={(event) => setValues((prev) => ({ ...prev, role: event.target.value }))}
            placeholder='Analyst'
          />

          {error ? <FieldMessage tone='error'>{error}</FieldMessage> : null}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button type='button' variant='ghost' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type='submit'>Send invite</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
```

## 3) Recipe: Table + Filters (FilterBar + DataTableV2)

```tsx
import { useMemo, useState } from 'react';
import { Button, DataTableV2, FilterBar, type DataTableColumn } from '@sloi/ui-kit';

type IncidentRow = {
  id: string;
  service: string;
  priority: 'P1' | 'P2' | 'P3';
  status: 'open' | 'investigating' | 'resolved';
};

const rows: IncidentRow[] = [
  { id: 'OPS-1001', service: 'Billing API', priority: 'P1', status: 'open' },
  { id: 'OPS-1002', service: 'Search Worker', priority: 'P2', status: 'investigating' },
  { id: 'OPS-1003', service: 'Warehouse Sync', priority: 'P3', status: 'resolved' }
];

const columns: DataTableColumn<IncidentRow>[] = [
  { id: 'id', header: 'Incident', accessor: 'id', sortable: true, width: 180 },
  { id: 'service', header: 'Service', accessor: 'service', sortable: true, width: 240 },
  { id: 'priority', header: 'Priority', accessor: 'priority', sortable: true, width: 140 },
  { id: 'status', header: 'Status', accessor: 'status', sortable: true, width: 170 }
];

export function IncidentsTableWithFilters() {
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState<'all' | IncidentRow['priority']>('all');

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const byPriority = priority === 'all' ? true : row.priority === priority;
      const byQuery = query.trim()
        ? `${row.id} ${row.service} ${row.status}`.toLowerCase().includes(query.trim().toLowerCase())
        : true;
      return byPriority && byQuery;
    });
  }, [priority, query]);

  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        onSearch={setQuery}
        onReset={() => {
          setQuery('');
          setPriority('all');
        }}
        filters={
          <label>
            Priority
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as 'all' | IncidentRow['priority'])}
            >
              <option value='all'>All</option>
              <option value='P1'>P1</option>
              <option value='P2'>P2</option>
              <option value='P3'>P3</option>
            </select>
          </label>
        }
        actions={<Button size='sm'>Export CSV</Button>}
      />

      <DataTableV2
        data={filteredRows}
        columns={columns}
        rowKey='id'
        showPagination={false}
        enableColumnPinning
        enableColumnResize
        enableVirtualization
        rowHeight={44}
        overscan={6}
        defaultPinnedColumns={{ left: ['id'], right: [] }}
      />
    </section>
  );
}
```

## Recipe guardrails

1. Для form/modal-form сценариев держите `invalid`/error-state в одном источнике (state формы), не распределяйте по дочерним компонентам хаотично.
2. Для `table + filters` сначала синхронизируйте filter state, затем применяйте sorting/pagination/virtualization.
3. Для enterprise-таблиц используйте только `DataTableV2`; тяжелые фичи не переносим в `DataTableV1`.
