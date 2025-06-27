import { Button } from "@/components/ui/button";
import { Bold, Italic, List, Link, Image, Video, FileText } from "lucide-react";

interface ContentToolbarProps {
  onFormatInsert: (format: string) => void;
}

const ContentToolbar = ({ onFormatInsert }: ContentToolbarProps) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border flex-wrap">
      <select className="text-sm border rounded px-2 py-1">
        <option>Paragraph</option>
        <option>Heading 1</option>
        <option>Heading 2</option>
      </select>
      <div className="w-px h-6 bg-gray-300 mx-2" />
      
      {/* Text Formatting */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onFormatInsert('bold')}
        className="p-2"
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onFormatInsert('italic')}
        className="p-2"
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onFormatInsert('list')}
        className="p-2"
        title="List"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-2" />
      
      {/* Media Insertion */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onFormatInsert('link')}
        className="p-2"
        title="Insert Link"
      >
        <Link className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onFormatInsert('image')}
        className="p-2"
        title="Insert Image"
      >
        <Image className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onFormatInsert('video')}
        className="p-2"
        title="Insert Video"
      >
        <Video className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onFormatInsert('pdf')}
        className="p-2"
        title="Insert PDF"
      >
        <FileText className="h-4 w-4" />
      </Button>
      
      <div className="ml-auto">
        <select className="text-sm border rounded px-2 py-1">
          <option>Tutor ShortCode</option>
        </select>
      </div>
    </div>
  );
};

export default ContentToolbar;