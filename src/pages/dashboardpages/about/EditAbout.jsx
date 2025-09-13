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

const EditAbout = () => {
  const [content, setContent] =
    useState(`Lorem ipsum dolor sit amet consectetur. Fringilla a cras vitae orci. Egestas duis id nisl sed ante congue scelerisque. Eleifend facilisis aliquet tempus morbi leo sagittis. Pellentesque odio amet turpis habitant. Imperdiet tincidunt nisl consectetur hendrerit accumsan vehicula imperdiet mattis. Neque a vitae diam pharetra duis habitasse convallis luctus pulvinar. Pharetra nunc morbi elementum nisl magna convallis arcu enim tortor. Cursus a sed tortor enim mi imperdiet massa donec mauris. Sem morbi morbi posuere faucibus. Cras risus ultrices duis pharetra sit porttitor elementum sagittis elementum. Ut vitae blandit pulvinar fermentum in id sed. At pellentesque non semper eget egestas vulputate id volutpat quis. Dolor etiam sodales at elementum mattis nibh quam placerat ut. Suspendisse est adipiscing proin et. Leo nisl bibendum donec ac non eget euismod suscipit. At ultrices nullam ipsum tellus. Non dictum orci at tortor convallis tortor suspendisse. Ac duis senectus arcu nullam in suspendisse vitae. Tellus interdum enim lorem vel morbi lectus.

Lorem ipsum dolor sit amet consectetur. Fringilla a cras vitae orci. Egestas duis id nisl sed ante congue scelerisque. Eleifend facilisis aliquet tempus morbi leo sagittis. Pellentesque odio amet turpis habitant. Imperdiet tincidunt nisl consectetur hendrerit accumsan vehicula imperdiet mattis. Neque a vitae diam pharetra duis habitasse convallis luctus pulvinar. Pharetra nunc morbi elementum nisl magna convallis arcu enim tortor. Cursus a sed tortor enim mi imperdiet massa donec mauris. Sem morbi morbi posuere faucibus. Cras risus ultrices duis pharetra sit porttitor elementum sagittis elementum. Ut vitae blandit pulvinar fermentum in id sed. At pellentesque non semper eget egestas vulputate id volutpat quis. Dolor etiam sodales at elementum mattis nibh quam placerat ut. Suspendisse est adipiscing proin et. Leo nisl bibendum donec ac non eget euismod suscipit. At ultrices nullam ipsum tellus. Non dictum orci at tortor convallis tortor suspendisse. Ac duis senectus arcu nullam in suspendisse vitae. Tellus interdum enim lorem vel morbi lectus.`);

  const [fontSize, setFontSize] = useState("16");

  const handleSaveChanges = () => {
    console.log("Saving content:", content);
    alert("Content saved successfully!");
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
      action: () => insertText("<u>Underlined Text</u>"),
    },
    {
      icon: Strikethrough,
      label: "Strikethrough",
      action: () => insertText("~~Strikethrough Text~~"),
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
    <div className=" bg-gray-100">
      {/* Header */}
      <div className="bg-[#017783] text-white p-4 flex items-center gap-3">
        <ChevronLeft className="h-6 w-6" />
        <h1 className="text-lg font-medium">Edit about us</h1>
      </div>

      {/* Main Content */}
      <div className="">
        <div className=" mx-auto">
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
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="14">14</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                    <SelectItem value="18">18</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                  </SelectContent>
                </Select>

                {/* Separator */}
                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Format Buttons */}
                {formatButtons.map((button) => {
                  const Icon = button.icon;
                  return (
                    <Button
                      key={button.label}
                      variant="ghost"
                      size="sm"
                      onClick={button.action}
                      className="h-8 w-8 p-0 hover:bg-gray-200"
                      title={button.label}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  );
                })}

                {/* Separator */}
                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Alignment Buttons */}
                {alignButtons.map((button) => {
                  const Icon = button.icon;
                  return (
                    <Button
                      key={button.label}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-200"
                      title={button.label}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  );
                })}

                {/* Separator */}
                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* List Buttons */}
                {listButtons.map((button) => {
                  const Icon = button.icon;
                  return (
                    <Button
                      key={button.label}
                      variant="ghost"
                      size="sm"
                      onClick={button.action}
                      className="h-8 w-8 p-0 hover:bg-gray-200"
                      title={button.label}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  );
                })}

                {/* Separator */}
                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Insert Buttons */}
                {insertButtons.map((button) => {
                  const Icon = button.icon;
                  return (
                    <Button
                      key={button.label}
                      variant="ghost"
                      size="sm"
                      onClick={button.action}
                      className="h-8 w-8 p-0 hover:bg-gray-200"
                      title={button.label}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Editor */}
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

export default EditAbout;
