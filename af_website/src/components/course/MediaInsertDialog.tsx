import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link, Upload } from "lucide-react";

interface MediaInsertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: "link" | "image" | "video" | "pdf";
  onUrlInsert: (url: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  mediaFileInputRef: React.RefObject<HTMLInputElement>;
}

const MediaInsertDialog = ({
  isOpen,
  onClose,
  mediaType,
  onUrlInsert,
  onFileUpload,
  mediaFileInputRef
}: MediaInsertDialogProps) => {
  const [urlInput, setUrlInput] = useState("");
  const [insertMode, setInsertMode] = useState<"url" | "upload">("url");

  const handleUrlInsert = () => {
    if (!urlInput.trim()) return;
    onUrlInsert(urlInput);
    setUrlInput("");
  };

  const handleMediaFileUpload = () => {
    mediaFileInputRef.current?.click();
  };

  const getAcceptTypes = () => {
    switch (mediaType) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'pdf':
        return '.pdf,application/pdf';
      default:
        return '*/*';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Insert {mediaType === 'link' ? 'Link' : mediaType === 'image' ? 'Image' : mediaType === 'video' ? 'Video' : 'PDF'}
          </DialogTitle>
          <DialogDescription>
            Choose to enter a URL or upload a file for your {mediaType}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Toggle between URL and Upload */}
          <div className="flex gap-2">
            <Button
              variant={insertMode === "url" ? "default" : "outline"}
              size="sm"
              onClick={() => setInsertMode("url")}
              className="flex-1"
            >
              <Link className="h-4 w-4 mr-2" />
              Enter URL
            </Button>
            <Button
              variant={insertMode === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => setInsertMode("upload")}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>

          {insertMode === "url" && (
            <div>
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={`Enter ${mediaType} URL...`}
                autoFocus
              />
              {mediaType === 'video' && (
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: MP4, WebM, OGG
                </p>
              )}
              {mediaType === 'pdf' && (
                <p className="text-sm text-gray-500 mt-2">
                  Enter a direct link to a PDF file
                </p>
              )}
            </div>
          )}

          {insertMode === "upload" && (
            <div className="text-center">
              <input
                ref={mediaFileInputRef}
                type="file"
                accept={getAcceptTypes()}
                onChange={onFileUpload}
                className="hidden"
              />
              <Button 
                onClick={handleMediaFileUpload}
                variant="outline"
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose {mediaType === 'link' ? 'File' : mediaType} File
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                {mediaType === 'image' && 'Supported: JPG, PNG, GIF, WebP'}
                {mediaType === 'video' && 'Supported: MP4, WebM, MOV, AVI'}
                {mediaType === 'pdf' && 'Supported: PDF files only'}
                {mediaType === 'link' && 'Any file type'}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {insertMode === "url" && (
            <Button onClick={handleUrlInsert} disabled={!urlInput.trim()}>
              Insert {mediaType === 'link' ? 'Link' : mediaType === 'image' ? 'Image' : mediaType === 'video' ? 'Video' : 'PDF'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaInsertDialog;