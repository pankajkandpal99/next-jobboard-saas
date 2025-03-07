import React from "react";
import { Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  ListIcon,
  ListOrdered,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { MenuItem } from "@/types";

interface iAppMenubarProps {
  editor: Editor | null;
}

const menuItems: MenuItem[] = [
  {
    type: "toggle",
    icon: <Bold />,
    tooltip: "Bold",
    isActive: (editor) => editor.isActive("bold"),
    onClick: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    type: "toggle",
    icon: <Italic />,
    tooltip: "Italic",
    isActive: (editor) => editor.isActive("italic"),
    onClick: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    type: "toggle",
    icon: <Strikethrough />,
    tooltip: "Strike",
    isActive: (editor) => editor.isActive("strike"),
    onClick: (editor) => editor.chain().focus().toggleStrike().run(),
  },
  {
    type: "toggle",
    icon: <Heading1 />,
    tooltip: "Heading 1",
    isActive: (editor) => editor.isActive("heading", { level: 1 }),
    onClick: (editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    type: "toggle",
    icon: <Heading2 />,
    tooltip: "Heading 2",
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
    onClick: (editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    type: "toggle",
    icon: <Heading3 />,
    tooltip: "Heading 3",
    isActive: (editor) => editor.isActive("heading", { level: 3 }),
    onClick: (editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    type: "toggle",
    icon: <ListIcon />,
    tooltip: "Bullet List",
    isActive: (editor) => editor.isActive("bulletList"),
    onClick: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    type: "toggle",
    icon: <ListOrdered />,
    tooltip: "Ordered List",
    isActive: (editor) => editor.isActive("orderedList"),
    onClick: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    type: "toggle",
    icon: <AlignLeft />,
    tooltip: "Align Left",
    isActive: (editor) => editor.isActive({ textAlign: "left" }),
    onClick: (editor) => editor.chain().focus().setTextAlign("left").run(),
  },
  {
    type: "toggle",
    icon: <AlignCenter />,
    tooltip: "Align Center",
    isActive: (editor) => editor.isActive({ textAlign: "center" }),
    onClick: (editor) => editor.chain().focus().setTextAlign("center").run(),
  },
  {
    type: "toggle",
    icon: <AlignRight />,
    tooltip: "Align Right",
    isActive: (editor) => editor.isActive({ textAlign: "right" }),
    onClick: (editor) => editor.chain().focus().setTextAlign("right").run(),
  },
  {
    type: "button",
    icon: <Undo />,
    tooltip: "Undo",
    onClick: (editor) => editor.chain().focus().undo().run(),
    disabled: (editor) => !editor.can().undo(),
  },
  {
    type: "button",
    icon: <Redo />,
    tooltip: "Redo",
    onClick: (editor) => editor.chain().focus().redo().run(),
    disabled: (editor) => !editor.can().redo(),
  },
];

const Menubar = ({ editor }: iAppMenubarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-t-lg p-2 bg-card flex flex-wrap gap-1">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          {menuItems.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                {item.type === "toggle" ? (
                  <Toggle
                    size="sm"
                    pressed={item.isActive?.(editor) || false}
                    onPressedChange={() => item.onClick(editor)}
                    className={cn(
                      item.isActive?.(editor) &&
                        "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.icon}
                  </Toggle>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    type="button"
                    onClick={() => item.onClick(editor)}
                    disabled={item.disabled?.(editor) || false}
                  >
                    {item.icon}
                  </Button>
                )}
              </TooltipTrigger>

              <TooltipContent className="text-white">
                {item.tooltip}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Menubar;
