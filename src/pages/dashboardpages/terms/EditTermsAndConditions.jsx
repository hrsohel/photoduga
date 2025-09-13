import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  ImageIcon,
} from "lucide-react";

const EditTermsAndConditions = () => {
  const [content, setContent] = useState(
    `Lorem ipsum dolor sit amet consectetur. Fringilla a cras vitae orci...`
  );
  const [fontSize, setFontSize] = useState("16");

  const handleSaveChanges = () => {
    console.log("Saving Terms and Conditions:", content);
    alert("Terms and Conditions saved successfully!");
  };

  const insertText = (before, after = "") => {
    const newContent = content + before + after;
    setContent(newContent);
  };

  const formatButtons = [
    { icon: Bold, label: "Bold", action: () => insertText("**Bold Text**") },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertText("*Italic Text*"),
    },
    {
      icon: Underline,
      label: "Underline",
      action: () => insertText("<u>Underlined</u>"),
    },
    {
      icon: Strikethrough,
      label: "Strikethrough",
      action: () => insertText("~~Strikethrough~~"),
    },
  ];

  const alignButtons = [
    { icon: AlignLeft, label: "Align Left" },
    { icon: AlignCenter, label: "Align Center" },
    { icon: AlignRight, label: "Align Right" },
  ];

  const listButtons = [
    {
      icon: List,
      label: "Bullet List",
      action: () => insertText("\n• List item"),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertText("\n1. List item"),
    },
  ];

  const insertButtons = [
    {
      icon: Link,
      label: "Insert Link",
      action: () => {
        const url = prompt("Enter URL:");
        if (url) insertText(`[Link Text](${url})`);
      },
    },
    {
      icon: ImageIcon,
      label: "Insert Image",
      action: () => {
        const url = prompt("Enter image URL:");
        if (url) insertText(`![Image](${url})`);
      },
    },
  ];

  return (
    <div className="bg-gray-100">
      {/* Header */}
      <div className="bg-[#017783] text-white p-4 flex items-center gap-3">
        <ChevronLeft className="h-6 w-6" />
        <h1 className="text-lg font-medium">Edit Terms and Conditions</h1>
      </div>

      {/* Main Content */}
      <div className="">
        <div className="mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="border-b border-gray-200 p-3 bg-gray-50">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Font Size Selector */}
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger className="w-16 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["12", "14", "16", "18", "20", "24"].map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Format Buttons */}
                <div className="w-px h-6 bg-gray-300 mx-1" />
                {formatButtons.map(({ icon: Icon, label, action }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    onClick={action}
                    className="h-8 w-8 p-0 hover:bg-gray-200"
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}

                {/* Alignment Buttons */}
                <div className="w-px h-6 bg-gray-300 mx-1" />
                {alignButtons.map(({ icon: Icon, label }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-200"
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}

                {/* List Buttons */}
                <div className="w-px h-6 bg-gray-300 mx-1" />
                {listButtons.map(({ icon: Icon, label, action }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    onClick={action}
                    className="h-8 w-8 p-0 hover:bg-gray-200"
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}

                {/* Insert Buttons */}
                <div className="w-px h-6 bg-gray-300 mx-1" />
                {insertButtons.map(({ icon: Icon, label, action }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    onClick={action}
                    className="h-8 w-8 p-0 hover:bg-gray-200"
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing..."
                className="h-[500px] border-0 resize-none focus:ring-0 focus:outline-none text-sm leading-relaxed overflow-y-auto"
                style={{ fontSize: `${fontSize}px` }}
              />
            </div>

            {/* Save Button */}
            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={handleSaveChanges}
                className="bg-[#017783] hover:bg-[#015a63] text-white px-8 py-2 rounded-md"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTermsAndConditions;
