import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, ButtonProps } from '@/components/ui/button';
import {
  Bold,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  QuoteIcon,
  StrikethroughIcon,
  TerminalIcon,
} from 'lucide-react';
import React from 'react';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { cn } from '@/lib/utils';
import { InputColor } from '@/components/ui/input-color';
import { Document } from '@tiptap/extension-document';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Image } from '@tiptap/extension-image';

const ToggleIconButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    enabled: boolean;
    onEnableChange: React.Dispatch<React.SetStateAction<boolean>>;
  }
>(({ enabled, onEnableChange, className, ...props }, ref) => {
  return (
    <Button
      {...props}
      className={cn('size-8 p-0', className)}
      size="sm"
      variant={enabled ? 'default' : 'outline'}
      onClick={() => onEnableChange((p) => !p)}
      ref={ref}
    >
      {props.children}
    </Button>
  );
});

ToggleIconButton.displayName = 'ToggleIconButton';

type BasicEditorProps = {
  content: string;
  onContentChange: React.Dispatch<React.SetStateAction<string>>;
};

export function BasicEditor(props: BasicEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Color, TextStyle, Document, Image, Dropcursor],
    content: props.content,
    onUpdate: ({ editor }) => {
      props.onContentChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="scrollbar-override rounded-md border p-2">
      <div className="mb-2 flex gap-2">
        <ToggleIconButton
          enabled={editor.isActive('heading', { level: 1 })}
          onEnableChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1Icon className="h-4 w-4" />
        </ToggleIconButton>
        <ToggleIconButton
          enabled={editor.isActive('heading', { level: 2 })}
          onEnableChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2Icon className="h-4 w-4" />
        </ToggleIconButton>
        <ToggleIconButton
          enabled={editor.isActive('heading', { level: 3 })}
          onEnableChange={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3Icon className="h-4 w-4" />
        </ToggleIconButton>
        <ToggleIconButton
          enabled={editor.isActive('heading', { level: 4 })}
          onEnableChange={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          <Heading4Icon className="h-4 w-4" />
        </ToggleIconButton>
        <ToggleIconButton
          enabled={editor.isActive('heading', { level: 5 })}
          onEnableChange={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
        >
          <Heading5Icon className="h-4 w-4" />
        </ToggleIconButton>
        <ToggleIconButton
          enabled={editor.isActive('heading', { level: 6 })}
          onEnableChange={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
        >
          <Heading6Icon className="h-4 w-4" />
        </ToggleIconButton>

        <ToggleIconButton
          enabled={editor.isActive('code')}
          onEnableChange={() => editor.chain().focus().toggleCode().run()}
        >
          <TerminalIcon className="h-4 w-4" />
        </ToggleIconButton>
        <ToggleIconButton
          enabled={editor.isActive('codeblock')}
          onEnableChange={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <CodeIcon className="h-4 w-4" />
        </ToggleIconButton>
        <ToggleIconButton
          enabled={false}
          onEnableChange={() => {
            const url = window.prompt('이미지 URL');

            if (url) {
              editor?.chain().focus().setImage({ src: url }).run();
            }
          }}
        >
          <ImageIcon className="h-4 w-4" />
        </ToggleIconButton>
      </div>
      <div className="mb-2 flex gap-2">
        <ToggleIconButton
          enabled={editor.isActive('blockquote')}
          onEnableChange={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <QuoteIcon className="h-4 w-4" />
        </ToggleIconButton>
        <ToggleIconButton
          enabled={editor.isActive('bold')}
          onEnableChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToggleIconButton>
        <ToggleIconButton
          enabled={editor.isActive('italic')}
          onEnableChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToggleIconButton>
        <ToggleIconButton
          onEnableChange={() => editor.chain().focus().toggleStrike().run()}
          enabled={editor.isActive('strike')}
        >
          <StrikethroughIcon className="h-4 w-4" />
        </ToggleIconButton>
        <ToggleIconButton
          onEnableChange={() => editor.chain().focus().toggleBulletList().run()}
          enabled={editor.isActive('bulletList')}
        >
          <List className="h-4 w-4" />
        </ToggleIconButton>
        <ToggleIconButton
          onEnableChange={() => editor.chain().focus().toggleOrderedList().run()}
          enabled={editor.isActive('orderedList')}
        >
          <ListOrdered className="h-4 w-4" />
        </ToggleIconButton>
        <InputColor
          size="sm"
          value={editor.getAttributes('textStyle').color ?? '#000000'}
          onValueChange={(value) => {
            const resolvedValue =
              typeof value == 'function'
                ? value(editor.getAttributes('textStyle').color)
                : value;
            editor.chain().setColor(resolvedValue).run();
          }}
        />
      </div>
      <EditorContent
        spellCheck={false}
        editor={editor}
        className="prose min-h-48 w-full max-w-full flex-1 overflow-y-scroll rounded-xl px-3 py-1 ring-2 ring-border *:outline-none prose-headings:my-0 prose-p:my-0"
      />
    </div>
  );
}
