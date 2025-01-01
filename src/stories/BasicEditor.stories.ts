import type { Meta, StoryObj } from '@storybook/react';
import { BasicEditor } from '@/components/editor/basic-editor';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Editor/Basic',
  component: BasicEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BasicEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: '',
    onContentChange: () => {},
  },
};
