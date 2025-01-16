import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ProductEditDialog } from '@/components/product/product-edit-dialog';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Product/Edit',
  component: ProductEditDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'check' },
  },
  args: { isOpen: true },
} satisfies Meta<typeof ProductEditDialog>;

export default meta;
type Story = StoryObj<typeof meta>;