'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export function ProductDescriptionEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>설명 입력</p>',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
  });

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
}
