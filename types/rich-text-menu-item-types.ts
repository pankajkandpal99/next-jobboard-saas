import { Editor } from "@tiptap/react";

export type MenuItem = {
  type: "toggle" | "button";
  icon: React.ReactNode;
  tooltip: string;
  isActive?: (editor: Editor) => boolean;
  onClick: (editor: Editor) => void;
  disabled?: (editor: Editor) => boolean;
};
