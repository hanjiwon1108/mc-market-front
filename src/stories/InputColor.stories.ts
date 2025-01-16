import type { Meta, StoryObj } from '@storybook/react';
import { BasicEditor } from '@/components/editor/basic-editor';
import { InputColor } from '@/components/ui/input-color';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Foundation/InputColor',
  component: InputColor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InputColor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'black',
    onValueChange: () => {},
  },
};
