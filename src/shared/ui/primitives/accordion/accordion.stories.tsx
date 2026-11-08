import type { Meta, StoryObj } from '@storybook/react';
import { forwardRef, type ComponentPropsWithoutRef, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger
} from './accordion';

const meta: Meta = {
  title: 'UI/Primitives/Accordion'
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-1" style={{ width: 380 }}>
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>Design tokens strategy</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Keep raw palette as source of truth and map semantic tokens for components.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>Radix wrappers</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Wrap primitives with classes and preserve behavior.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['item-1']} style={{ width: 420 }}>
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>Design tokens strategy</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Keep raw palette as source of truth and map semantic tokens for components.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>Radix wrappers</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Wrap primitives with classes and preserve behavior.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionHeader>
          <AccordionTrigger>Storybook as verification</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Use stories for default and edge-case scenarios.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
};

const ControlledAccordionPreview = () => {
  const [value, setValue] = useState('item-1');

  return (
    <div style={{ width: 420, display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={() => setValue('item-1')}>Open item 1</button>
        <button type="button" onClick={() => setValue('item-2')}>Open item 2</button>
      </div>
      <Accordion type="single" value={value} onValueChange={setValue} collapsible>
        <AccordionItem value="item-1">
          <AccordionHeader>
            <AccordionTrigger>Controlled state</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>Root value is managed externally.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionHeader>
            <AccordionTrigger>SSR-friendly behavior</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>State sync remains deterministic between renders.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledAccordionPreview />
};

export const Horizontal: Story = {
  render: () => (
    <Accordion
      type="single"
      orientation="horizontal"
      defaultValue="item-1"
      style={{ width: 760, display: 'flex' }}
    >
      <AccordionItem value="item-1" style={{ flex: 1 }}>
        <AccordionHeader>
          <AccordionTrigger>Section A</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Horizontal orientation with width animation.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" style={{ flex: 1 }}>
        <AccordionHeader>
          <AccordionTrigger>Section B</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Supports arrow key navigation according to orientation.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
};

const LinkTrigger = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>(
  ({ children, ...props }, ref) => (
    <a
      ref={ref}
      {...props}
      style={{
        display: 'inline-flex',
        width: '100%',
        minHeight: 40,
        alignItems: 'center',
        color: 'var(--sloi-text-primary)',
        textDecoration: 'none'
      }}
    >
      {children}
    </a>
  )
);

LinkTrigger.displayName = 'LinkTrigger';

export const AsChildTrigger: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-1" style={{ width: 420 }}>
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger asChild showIcon={false}>
            <LinkTrigger href="#" onClick={(event) => event.preventDefault()}>
              Custom trigger component via asChild
            </LinkTrigger>
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          asChild keeps Radix behavior while using your own component.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
};
