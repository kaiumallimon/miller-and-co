"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { useRef, useCallback, useState, useEffect } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, Heading4,
  List, ListOrdered, Quote, Code, Code2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link, Link2Off, Image as ImageIcon, Table as TableIcon,
  Undo, Redo, Minus, Highlighter, Subscript as SubIcon,
  Superscript as SupIcon, Loader2,
} from "lucide-react";
import { bodyFont } from "@/lib/typographies";

// ─── Table size picker ───────────────────────────────────────────────────────
const MAX_ROWS = 8;
const MAX_COLS = 8;

function TablePicker({ onPick }: { onPick: (rows: number, cols: number) => void }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<{ r: number; c: number } | null>(null);
  const [customRows, setCustomRows] = useState("");
  const [customCols, setCustomCols] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const pick = (r: number, c: number) => {
    onPick(r, c);
    setOpen(false);
    setHovered(null);
    setCustomRows("");
    setCustomCols("");
  };

  const handleCustomInsert = () => {
    const r = parseInt(customRows, 10);
    const c = parseInt(customCols, 10);
    if (r > 0 && c > 0) pick(r, c);
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        title="Insert table"
        onClick={() => setOpen((v) => !v)}
        className={`p-1.5 rounded transition-all cursor-pointer ${ open ? "bg-[#c8a96e]/20 text-[#c8a96e]" : "text-white/40 hover:text-white/80 hover:bg-white/6" }`}
      >
        <TableIcon className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-[#1a1a1a] border border-white/10 rounded-lg p-3 shadow-xl min-w-[200px]">
          {/* Grid picker */}
          <div className="flex flex-col gap-0.5">
            {Array.from({ length: MAX_ROWS }, (_, ri) => (
              <div key={ri} className="flex gap-0.5">
                {Array.from({ length: MAX_COLS }, (_, ci) => {
                  const active = hovered && ri < hovered.r && ci < hovered.c;
                  return (
                    <div
                      key={ci}
                      onMouseEnter={() => setHovered({ r: ri + 1, c: ci + 1 })}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => pick(ri + 1, ci + 1)}
                      className={`w-5 h-5 border rounded-[2px] cursor-pointer transition-colors ${ active ? "bg-[#c8a96e]/40 border-[#c8a96e]/60" : "bg-white/5 border-white/10 hover:bg-white/10" }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Label */}
          <p className="text-white/40 text-xs mt-2 text-center">
            {hovered ? `${hovered.r} × ${hovered.c}` : "Hover to select size"}
          </p>

          {/* Custom size inputs */}
          <div className="mt-2 border-t border-white/8 pt-2 flex items-center gap-1.5">
            <input
              type="number"
              min={1}
              placeholder="Rows"
              value={customRows}
              onChange={(e) => setCustomRows(e.target.value)}
              className="w-14 bg-white/5 border border-white/10 rounded px-1.5 py-1 text-xs text-white/80 outline-none focus:border-[#c8a96e]/50"
            />
            <span className="text-white/30 text-xs">×</span>
            <input
              type="number"
              min={1}
              placeholder="Cols"
              value={customCols}
              onChange={(e) => setCustomCols(e.target.value)}
              className="w-14 bg-white/5 border border-white/10 rounded px-1.5 py-1 text-xs text-white/80 outline-none focus:border-[#c8a96e]/50"
            />
            <button
              type="button"
              onClick={handleCustomInsert}
              className="ml-auto text-xs bg-[#c8a96e]/20 hover:bg-[#c8a96e]/30 text-[#c8a96e] px-2 py-1 rounded transition-colors"
            >
              Insert
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Toolbar button ───────────────────────────────────────────────────────────
function Btn({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-all cursor-pointer disabled:opacity-30 disabled:cursor-default shrink-0 ${
        active
          ? "bg-[#c8a96e]/20 text-[#c8a96e]"
          : "text-white/40 hover:text-white/80 hover:bg-white/6"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return <span className="w-px h-5 bg-white/8 mx-0.5 shrink-0" />;
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────
function Toolbar({
  editor,
  onImageUpload,
  uploading,
}: {
  editor: Editor;
  onImageUpload: () => void;
  uploading: boolean;
}) {
  const handleLink = useCallback(() => {
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Enter URL:", prev);
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
  }, [editor]);

  const insertTable = useCallback((rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
  }, [editor]);

  return (
    <div className={`${bodyFont.className} flex items-center gap-0.5 px-2 sm:px-3 py-2 border-b border-white/8 bg-[#111] sticky top-0 z-10 overflow-x-auto scrollbar-none`}>
      {/* Undo / Redo */}
      <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
        <Undo className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
        <Redo className="w-3.5 h-3.5" />
      </Btn>

      <Divider />

      {/* Headings */}
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
        <Heading1 className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
        <Heading2 className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
        <Heading3 className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive("heading", { level: 4 })} title="Heading 4">
        <Heading4 className="w-3.5 h-3.5" />
      </Btn>

      <Divider />

      {/* Inline marks */}
      <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)">
        <Bold className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)">
        <Italic className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)">
        <UnderlineIcon className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
        <Strikethrough className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight">
        <Highlighter className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} title="Subscript">
        <SubIcon className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} title="Superscript">
        <SupIcon className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
        <Code className="w-3.5 h-3.5" />
      </Btn>

      <Divider />

      {/* Alignment */}
      <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left">
        <AlignLeft className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center">
        <AlignCenter className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right">
        <AlignRight className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify">
        <AlignJustify className="w-3.5 h-3.5" />
      </Btn>

      <Divider />

      {/* Lists */}
      <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
        <List className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list">
        <ListOrdered className="w-3.5 h-3.5" />
      </Btn>

      <Divider />

      {/* Blocks */}
      <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
        <Quote className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
        <Code2 className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
        <Minus className="w-3.5 h-3.5" />
      </Btn>

      <Divider />

      {/* Link */}
      <Btn onClick={handleLink} active={editor.isActive("link")} title="Insert / edit link">
        <Link className="w-3.5 h-3.5" />
      </Btn>
      <Btn onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} title="Remove link">
        <Link2Off className="w-3.5 h-3.5" />
      </Btn>

      {/* Image upload */}
      <Btn onClick={onImageUpload} disabled={uploading} title="Insert image (upload to CDN)">
        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
      </Btn>

      {/* Table */}
      <TablePicker onPick={insertTable} />
    </div>
  );
}

// ─── TiptapEditor ─────────────────────────────────────────────────────────────
export default function TiptapEditor({
  content,
  onChange,
  placeholder = "Start writing your post…",
}: {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  // Track last content we set externally so we don't loop on the user's own keystrokes
  const externalContentRef = useRef(content);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: { languageClassPrefix: "language-" },
      }),
      ImageExtension.configure({ inline: false, allowBase64: false }),
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: false }),
      Underline,
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({ limit: undefined }),
      Color,
      TextStyle,
      Subscript,
      Superscript,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      externalContentRef.current = html; // mark as internal so the effect below won't re-set it
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: "tiptap-content focus:outline-none min-h-[420px] px-6 py-5 text-white/80",
      },
    },
    immediatelyRender: false,
  });

  // When the parent loads async data (edit mode), push the new content into the editor
  useEffect(() => {
    if (!editor) return;
    if (content !== externalContentRef.current) {
      externalContentRef.current = content;
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "miller-and-co/blog");
      const res = await fetch("/api/admin/cdn/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      editor.chain().focus().setImage({ src: data.url, alt: file.name.replace(/\.[^.]+$/, "") }).run();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUploading(false);
    }
  }, [editor]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.target.value = "";
  }, [handleImageUpload]);

  const charCount = editor?.storage.characterCount.characters() ?? 0;
  const wordCount = editor?.storage.characterCount.words() ?? 0;

  return (
    <div className="flex flex-col border border-white/8 bg-[#141414] overflow-hidden">
      {editor && (
        <Toolbar
          editor={editor}
          onImageUpload={() => fileInputRef.current?.click()}
          uploading={uploading}
        />
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={onFileChange}
      />
      <EditorContent editor={editor} />
      <div className={`${bodyFont.className} flex items-center gap-4 px-6 py-2 border-t border-white/6 text-[10px] text-white/20 bg-[#111]`}>
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>
    </div>
  );
}
