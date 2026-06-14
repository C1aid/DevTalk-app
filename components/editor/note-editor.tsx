"use client";

import type { JSONContent } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Eye, Lock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { debounce } from "@/lib/utils";

interface NoteEditorProps {
  content: JSONContent;
  onChange: (content: JSONContent) => void;
  onTitleChange?: (title: string) => void;
  title?: string;
  editable?: boolean;
}

function getEditorStats(text: string) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = text.length;
  return { words, characters };
}

export function NoteEditor({
  content,
  onChange,
  onTitleChange,
  title = "Untitled Note",
  editable = true,
}: NoteEditorProps) {
  const [stats, setStats] = useState({ words: 0, characters: 0 });

  const debouncedOnChange = useCallback(
    debounce((json: JSONContent) => {
      onChange(json);
    }, 500),
    [onChange],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: editable
          ? "Start writing your note…"
          : "This note is view-only.",
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor: ed }) => {
      setStats(getEditorStats(ed.getText()));
      debouncedOnChange(ed.getJSON());
    },
    editorProps: {
      attributes: {
        class: "note-editor-prose focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      const current = JSON.stringify(editor.getJSON());
      const incoming = JSON.stringify(content);
      if (current !== incoming) {
        editor.commands.setContent(content);
        setStats(getEditorStats(editor.getText()));
      }
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  if (!editor) return null;

  return (
    <div className="glass-card overflow-hidden">
      <div className="h-1 bg-primary" />

      <div className="p-6 md:p-8">
        {!editable && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300">
            <Eye className="size-4 shrink-0 text-primary" />
            View-only access — you can read but not edit this note.
          </div>
        )}

        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange?.(e.target.value)}
          disabled={!editable}
          className="mb-2 w-full border-none bg-transparent text-3xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-default disabled:opacity-80 md:text-4xl"
          placeholder="Note title"
        />

        {editable ? (
          <EditorToolbar editor={editor} />
        ) : (
          <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3.5" />
            Formatting toolbar hidden in view-only mode
          </div>
        )}

        <EditorContent editor={editor} className="note-editor-content" />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
          <div className="flex gap-4">
            <span>{stats.words} words</span>
            <span>{stats.characters} characters</span>
          </div>
          {editable && (
            <span className="hidden sm:inline">
              Ctrl+B bold · Ctrl+I italic · Ctrl+Z undo
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
