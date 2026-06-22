"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor,
  type NodeViewProps,
} from "@tiptap/react";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import Image from "@tiptap/extension-image";
import { Extension, mergeAttributes } from "@tiptap/core";
import { NodeSelection } from "prosemirror-state";
import { uploadToVps } from "@/app/lib/actions/file";

/**
 * ✅ Word-like features included:
 * - Full toolbar (bold/italic/underline, highlight, colors, headings, lists, alignment, links, undo/redo)
 * - Images: upload (Vercel Blob), drag&drop, paste
 * - Image NodeView: text wrap (float left/right), alignment, width slider
 * - Move image up/down (exact placement)
 *
 * Output: HTML (editor.getHTML()).
 */

type Props = {
  value?: string; // initial/external HTML
  onChange?: (html: string) => void;
};

// ---------- FontSize (TextStyle attribute) ----------
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => (el as HTMLElement).style.fontSize || null,
            renderHTML: (attrs) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      ...this.parent?.(),

      setImageWrap:
        (wrap: Wrap) =>
                        //@ts-ignore

        ({ chain }) => {
          return chain().focus().updateAttributes("image", { wrap }).run();
        },

      setImageAlign:
        (align: Align) =>
                        //@ts-ignore

        ({ chain }) => {
          return chain().focus().updateAttributes("image", { align }).run();
        },

      setImageWidth:
        (width: number) =>
                        //@ts-ignore

        ({ chain }) => {
          return chain().focus().updateAttributes("image", { width }).run();
        },

      moveImageUp:
        () =>
                        //@ts-ignore

        ({ state, dispatch }) =>
          moveSelectedImage("up", state, dispatch),

      moveImageDown:
        () =>
                        //@ts-ignore

        ({ state, dispatch }) =>
          moveSelectedImage("down", state, dispatch),
    };
  },
});

// ---------- Image NodeView (wrap + width + selection outline) ----------
function ImageNodeView({ node, selected }: NodeViewProps) {
  const { src, alt, width = 100, align = "center", wrap = "none" } = node.attrs;

  const isFloat = wrap === "square" && (align === "left" || align === "right");

  const style: React.CSSProperties = {
    width: `${Math.max(10, Math.min(100, Number(width)))}%`,
    maxWidth: "100%",
  };

  const className = [
    "wordImg",
    selected ? "wordImgSelected" : "",
    `align-${align}`,
    `wrap-${wrap}`,
   `float-${'left'}` ,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <NodeViewWrapper
      className={className}
      style={style}
      as="span"
      data-drag-handle
    >
      <img src={src} alt={alt || ""} draggable={false} />
    </NodeViewWrapper>
  );
}

type Align = "left" | "right" | "center";
type Wrap = "none" | "square";

function makeId() {
  // @ts-ignore
  return (
    globalThis.crypto?.randomUUID?.() ??
    `img_${Date.now()}_${Math.random().toString(16).slice(2)}`
  );
}

// Move selected image node up/down within its parent
function moveSelectedImage(dir: "up" | "down", state: any, dispatch?: any) {
  const { selection, tr } = state;
  if (!(selection instanceof NodeSelection)) return false;

  const pos = selection.from;
  const node = selection.node;
  if (!node || node.type.name !== "image") return false;

  const $pos = state.doc.resolve(pos);
  const depth = $pos.depth;
  const parent = $pos.node(depth);
  const index = $pos.index(depth);

  if (dir === "up" && index === 0) return false;
  if (dir === "down" && index >= parent.childCount - 1) return false;

  const start = $pos.before(depth);

  const posAtIndex = (i: number) => {
    let offset = 0;
    for (let k = 0; k < i; k++) offset += parent.child(k).nodeSize;
    return start + offset;
  };

  const from = posAtIndex(index);
  const to = from + node.nodeSize;

  const targetIndex = dir === "up" ? index - 1 : index + 1;
  const targetPos = posAtIndex(targetIndex);

  let nextTr = tr.delete(from, to);

  const insertPos = dir === "down" ? targetPos - node.nodeSize : targetPos;
  nextTr = nextTr.insert(insertPos, node);

  nextTr = nextTr.setSelection(NodeSelection.create(nextTr.doc, insertPos));

  if (dispatch) dispatch(nextTr.scrollIntoView());
  return true;
}

// ---------- WordImage Extension (attrs + commands + NodeView) ----------
const WordImage = Image.extend({
  name: "image",
  draggable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-id"),
        renderHTML: (attrs) => (attrs.id ? { "data-id": attrs.id } : {}),
      },
      align: {
        default: "center" as Align,
        parseHTML: (el) =>
          ((el as HTMLElement).getAttribute("data-align") as Align) || "center",
        renderHTML: (attrs) => ({ "data-align": attrs.align || "center" }),
      },
      wrap: {
        default: "none" as Wrap,
        parseHTML: (el) =>
          ((el as HTMLElement).getAttribute("data-wrap") as Wrap) || "none",
        renderHTML: (attrs) => ({ "data-wrap": attrs.wrap || "none" }),
      },
      width: {
        default: 100,
        parseHTML: (el) =>
          Number((el as HTMLElement).getAttribute("data-width") || "100"),
        renderHTML: (attrs) => ({ "data-width": String(attrs.width ?? 100) }),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    // keep a normal img element; NodeView handles wrapping/float in editor
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },

  addCommands() {
    return {
      ...this.parent?.(),

      setImageWrap:
        (wrap: Wrap) =>
            //@ts-ignore
        ({ editor }) => {
          const attrs = editor.getAttributes("image");
          if (!attrs?.src) return false;
          return editor.commands.updateAttributes("image", { wrap });
        },

      setImageAlign:
        (align: Align) =>
                        //@ts-ignore

        ({ editor }) => {
          const attrs = editor.getAttributes("image");
          if (!attrs?.src) return false;
          return editor.commands.updateAttributes("image", { align });
        },

      setImageWidth:
        (width: number) =>
                        //@ts-ignore

        ({ editor }) => {
          const attrs = editor.getAttributes("image");
          if (!attrs?.src) return false;
          return editor.commands.updateAttributes("image", { width });
        },

      moveImageUp:
        () =>
                        //@ts-ignore

        ({ state, dispatch }) =>
          moveSelectedImage("up", state, dispatch),

      moveImageDown:
        () =>
                      //@ts-ignore

        ({ state, dispatch }) =>
          moveSelectedImage("down", state, dispatch),
    } as any;
  },
});

export default function WordStyleEditor({ value = "", onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const extensions = useMemo(
    () => [
      StarterKit,
      Gapcursor,
      Dropcursor,
      BubbleMenuExtension,
      Placeholder.configure({ placeholder: "Write here..." }),
      TextStyle,
      Color,
      FontSize,
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        protocols: ["http", "https", "mailto", "tel"],
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      WordImage.configure({ inline: false }),
    ],
    [],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: value,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: { class: "ProseMirror wordProse" },
    },
  });

  // Prevent "controlled" resets
  const lastExternal = useRef(value);
  useEffect(() => {
    if (!editor) return;
    if (value !== lastExternal.current) {
      lastExternal.current = value;
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const focusEditor = useCallback(
    () => editor?.chain().focus().run(),
    [editor],
  );

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", prev || "");
    if (url === null) return;
    const clean = url.trim();
    if (!clean) editor.chain().focus().unsetLink().run();
    else
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: clean })
        .run();
  }, [editor]);

  // Insert placeholder image immediately, then replace src after upload
  const insertImageFromFile = useCallback(
    async (file: File) => {
      if (!editor) return;
      const id = makeId();
      const localUrl = URL.createObjectURL(file);

      editor.chain().focus().setImage({ src: localUrl, width: 100 }).run();

      try {
        const { pathname } = await uploadToVps(file);
        // update by searching node with the id
        const { state, view } = editor;
        let tr = state.tr;
        let found = false;

        state.doc.descendants((node, pos) => {
          if (node.type.name === "image" && node.attrs?.id === id) {
            found = true;
            tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: pathname });
            return false;
          }
          return true;
        });

        if (found) view.dispatch(tr);
      } finally {
        requestAnimationFrame(() => URL.revokeObjectURL(localUrl));
      }
    },
    [editor],
  );

  const pickImage = useCallback(() => fileRef.current?.click(), []);
  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) return;

      await insertImageFromFile(file);
      e.target.value = "";
    },
    [insertImageFromFile],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      const file = e.dataTransfer?.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      e.preventDefault();
      e.stopPropagation();
      insertImageFromFile(file);
    },
    [insertImageFromFile],
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const file = e.clipboardData?.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      e.preventDefault();
      insertImageFromFile(file);
    },
    [insertImageFromFile],
  );
  if (!mounted) return null;

  if (!editor) return null;

  const is = (name: any, attrs?: any) => editor.isActive(name, attrs);

  return (
    <div className="wordEditorWrap" onClick={(e) => e.stopPropagation()}>
      {/* Top toolbar */}
      <div className="toolbar">
        {/* Font size */}
        {/* <select
          className="select"
          defaultValue="16px"
          onChange={(e) => (editor as any).chain().focus().setFontSize(e.target.value).run()}
          title="Font size"
        >
          {["12px", "14px", "16px", "18px", "20px", "24px", "32px", "40px"].map((s) => (
            <option key={s} value={s}>
              {s.replace("px", "")}
            </option>
          ))}
        </select> */}

        <span className="sep" />
        <button style={{ display: "none" }}></button>
        <button
          className={is("bold") ? "btn active" : "btn"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          type="button"
        >
          B
        </button>
        <button
          className={is("italic") ? "btn active" : "btn"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          type="button"
        >
          I
        </button>
        <button
          className={is("underline") ? "btn active" : "btn"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          type="button"
        >
          U
        </button>

        <span className="sep" />

        <label className="colorLabel" title="Text color">
          A
          <input
            type="color"
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
          />
        </label>

        <label className="colorLabel" title="Highlight">
          🖍
          <input
            type="color"
            onChange={(e) =>
              editor
                .chain()
                .focus()
                .toggleHighlight({ color: e.target.value })
                .run()
            }
          />
        </label>

        <span className="sep" />

        {/* Headings */}
        <button
          className={is("heading", { level: 1 }) ? "btn active" : "btn"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          type="button"
        >
          H1
        </button>
        <button
          className={is("heading", { level: 2 }) ? "btn active" : "btn"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          type="button"
        >
          H2
        </button>
        <button
          className={is("heading", { level: 3 }) ? "btn active" : "btn"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          type="button"
        >
          H3
        </button>

        <span className="sep" />

        {/* Lists */}
        <button
          className={is("bulletList") ? "btn active" : "btn"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          type="button"
        >
          • List
        </button>
        <button
          className={is("orderedList") ? "btn active" : "btn"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          type="button"
        >
          1. List
        </button>

        <span className="sep" />

        {/* Alignment */}
        <button
          className={is({ textAlign: "left" }) ? "btn active" : "btn"}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          type="button"
        >
          ⬅
        </button>
        <button
          className={is({ textAlign: "center" }) ? "btn active" : "btn"}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          type="button"
        >
          ⬌
        </button>
        <button
          className={is({ textAlign: "right" }) ? "btn active" : "btn"}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          type="button"
        >
          ➡
        </button>
        <button
          className={is({ textAlign: "justify" }) ? "btn active" : "btn"}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          type="button"
        >
          ☰
        </button>

        <span className="sep" />

        {/* Link */}
        <button
          className={editor.isActive("link") ? "btn active" : "btn"}
          onClick={setLink}
          type="button"
        >
          🔗 Link
        </button>

        <span className="sep" />

        {/* Image */}
        <button className="btn" onClick={pickImage} type="button">
          🖼 Image
        </button>
        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/*"
          onChange={onFileChange}
        />

        <span className="sep" />

        {/* Undo / Redo */}
        <button
          className="btn"
          onClick={() => editor.chain().focus().undo().run()}
          type="button"
        >
          ↶
        </button>
        <button
          className="btn"
          onClick={() => editor.chain().focus().redo().run()}
          type="button"
        >
          ↷
        </button>
      </div>

      {/* Image bubble menu: wrap + align + resize + move */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => editor.isActive("image")}
      >
        <div className="imgMenu">
          <button
            className="btn"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => (editor as any).commands.setImageWrap("square")}
          >
            Wrap
          </button>
          <button
            className="btn"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => (editor as any).commands.setImageWrap("none")}
          >
            No wrap
          </button>

          <span className="sep" />

          <button
            className="btn"
            type="button"
            onClick={() => (editor as any).commands.setImageAlign("left")}
          >
            ⬅
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => (editor as any).commands.setImageAlign("center")}
          >
            ⬌
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => (editor as any).commands.setImageAlign("right")}
          >
            ➡
          </button>

          <span className="sep" />

          <input
            className="range"
            type="range"
            min={10}
            max={100}
            value={Number((editor.getAttributes("image") as any)?.width ?? 100)}
            onChange={(e) =>
              (editor as any).commands.setImageWidth(Number(e.target.value))
            }
            title="Width"
          />

          <span className="sep" />

          <button
            className="btn"
            type="button"
            onClick={() => (editor as any).commands.moveImageUp()}
          >
            ↑
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => (editor as any).commands.moveImageDown()}
          >
            ↓
          </button>
        </div>
      </BubbleMenu>

      {/* Editor surface */}
      <div
        className="editor"
        onClick={focusEditor}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={onPaste}
      >
        <EditorContent editor={editor} onClick={focusEditor} />
      </div>

      {/* Minimal styles inline (move these to css/module if you prefer) */}
      <style>{`
        .wordEditorWrap{border:1px solid rgba(0,0,0,.18);border-radius:12px;overflow:hidden;background:#fff}
        .toolbar{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;gap:8px;padding:10px;background:#f6f6f6;border-bottom:1px solid rgba(0,0,0,.12)}
        .btn,.select{height:34px;padding:0 10px;border:1px solid rgba(0,0,0,.2);background:#fff;border-radius:8px;cursor:pointer;font-size:14px}
        .btn.active{border-color:#1976d2;box-shadow:0 0 0 2px rgba(25,118,210,.15)}
        .sep{width:1px;background:rgba(0,0,0,.15);margin:0 4px}
        .colorLabel{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 10px;border:1px solid rgba(0,0,0,.2);background:#fff;border-radius:8px;cursor:pointer;font-size:14px}
        .colorLabel input{width:20px;height:20px;border:none;padding:0;background:transparent}
        .editor{padding:16px}
        .wordProse{min-height:380px;outline:none;line-height:1.5;font-size:16px;cursor:text}
        .wordProse p{margin:0 0 12px}
        .wordProse a{color:#1976d2;text-decoration:underline}

        .imgMenu{display:flex;align-items:center;gap:8px;padding:8px;background:#fff;border:1px solid rgba(0,0,0,.12);border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.12)}
        .range{width:160px}

        /* NodeView image styling */
        .wordImg{display:block;border-radius:10px;margin:8px auto;    width: fit-content !important;
    max-width: 100% ;
    float: left ;}
        .wordImg img{width:fit-content;height:auto;display:block;border-radius:10px}
        .wordImgSelected{outline:2px solid rgba(25,118,210,.6);outline-offset:3px}

        /* default alignment when not floating */
        .align-left{margin-left:0;margin-right:auto}
        .align-center{margin-left:auto;margin-right:auto}
        .align-right{margin-left:auto;margin-right:0}

        /* Word-like square wrap */
        .wrap-square.float-left{float:left;margin:8px 12px 8px 0}
        .wrap-square.float-right{float:right;margin:8px 0 8px 12px}

        /* If you want text to continue wrapping across multiple paragraphs, REMOVE this rule */
        .wordProse p{clear:both}
      `}</style>
    </div>
  );
}
