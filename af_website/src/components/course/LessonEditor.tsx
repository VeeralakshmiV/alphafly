
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Save, X, Bold, Italic, List, Link, Image, Eye, Edit, FileText, Video, Upload, HelpCircle, BookOpen } from "lucide-react";
import { Lesson } from "@/types/courseTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuizEditor from "./QuizEditor";
import AssignmentEditor from "./AssignmentEditor";

interface LessonEditorProps {
  lesson?: Lesson;
  onSave: (lesson: Omit<Lesson, 'id'>) => void;
  onClose: () => void;
}

const LessonEditor = ({ lesson, onSave, onClose }: LessonEditorProps) => {
  const [title, setTitle] = useState(lesson?.title || "");
  const [content, setContent] = useState(lesson?.content || "");
  const [activeTab, setActiveTab] = useState("edit");
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [mediaType, setMediaType] = useState<"link" | "image" | "video" | "pdf">("link");
  const [insertMode, setInsertMode] = useState<"url" | "upload">("url");
  const [editingQuiz, setEditingQuiz] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(false);
  const [quiz, setQuiz] = useState(lesson?.quiz);
  const [assignment, setAssignment] = useState(lesson?.assignment);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave({
      title,
      content,
      quiz,
      assignment,
    });
  };

  // Show quiz editor
  if (editingQuiz) {
    return (
      <QuizEditor
        quiz={quiz}
        onSave={(quizData) => {
          const newQuiz = {
            id: quiz?.id || Date.now().toString(),
            ...quizData,
          };
          setQuiz(newQuiz);
          setEditingQuiz(false);
        }}
        onClose={() => setEditingQuiz(false)}
      />
    );
  }

  // Show assignment editor
  if (editingAssignment) {
    return (
      <AssignmentEditor
        assignment={assignment}
        onSave={(assignmentData) => {
          const newAssignment = {
            id: assignment?.id || Date.now().toString(),
            ...assignmentData,
          };
          setAssignment(newAssignment);
          setEditingAssignment(false);
        }}
        onClose={() => setEditingAssignment(false)}
      />
    );
  }

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('lesson-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = "";
    switch (format) {
      case 'bold':
        newText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        newText = `*${selectedText || 'italic text'}*`;
        break;
      case 'list':
        newText = `\n- ${selectedText || 'list item'}\n`;
        break;
      case 'link':
        setMediaType("link");
        setInsertMode("url");
        setIsMediaDialogOpen(true);
        return;
      case 'image':
        setMediaType("image");
        setInsertMode("url");
        setIsMediaDialogOpen(true);
        return;
      case 'video':
        setMediaType("video");
        setInsertMode("url");
        setIsMediaDialogOpen(true);
        return;
      case 'pdf':
        setMediaType("pdf");
        setInsertMode("url");
        setIsMediaDialogOpen(true);
        return;
      default:
        return;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  const handleUrlInsert = () => {
    if (!urlInput.trim()) return;

    const textarea = document.getElementById('lesson-content') as HTMLTextAreaElement;
    const start = textarea?.selectionStart || content.length;
    const end = textarea?.selectionEnd || content.length;
    
    let insertText = "";
    switch (mediaType) {
      case 'link':
        insertText = `[Link Text](${urlInput})`;
        break;
      case 'image':
        insertText = `![Image Description](${urlInput})`;
        break;
      case 'video':
        insertText = `\n<video controls width="100%">\n  <source src="${urlInput}" type="video/mp4">\n  Your browser does not support the video tag.\n</video>\n`;
        break;
      case 'pdf':
        insertText = `\n<embed src="${urlInput}" type="application/pdf" width="100%" height="600px" />\n`;
        break;
    }

    const newContent = content.substring(0, start) + insertText + content.substring(end);
    setContent(newContent);
    setUrlInput("");
    setIsMediaDialogOpen(false);

    setTimeout(() => {
      textarea?.focus();
    }, 0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const fileName = file.name;
    const fileType = file.type;

    let insertText = "";
    if (fileType.startsWith('image/')) {
      insertText = `![${fileName}](${fileUrl})`;
    } else if (fileType.startsWith('video/')) {
      insertText = `\n<video controls width="100%">\n  <source src="${fileUrl}" type="${fileType}">\n  Your browser does not support the video tag.\n</video>\n`;
    } else if (fileType === 'application/pdf') {
      insertText = `\n<embed src="${fileUrl}" type="application/pdf" width="100%" height="600px" />\n`;
    } else {
      insertText = `[${fileName}](${fileUrl})`;
    }

    const textarea = document.getElementById('lesson-content') as HTMLTextAreaElement;
    const start = textarea?.selectionStart || content.length;
    const end = textarea?.selectionEnd || content.length;
    
    const newContent = content.substring(0, start) + insertText + content.substring(end);
    setContent(newContent);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (mediaFileInputRef.current) {
      mediaFileInputRef.current.value = '';
    }
    setIsMediaDialogOpen(false);
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

  const renderPreview = () => {
    let preview = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '• $1')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
      .replace(/\n/g, '<br>');

    return { __html: preview };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {lesson ? 'Edit Lesson' : 'Create New Lesson'}
          </h2>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Lesson
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lesson Settings */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Settings</CardTitle>
              <CardDescription>Configure lesson properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Lesson Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter lesson title"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lesson titles are displayed publicly wherever required.
                </p>
              </div>
              
              {/* Interactive Content */}
              <div className="pt-4 space-y-3">
                <Badge variant="secondary" className="mb-2">
                  Interactive Content
                </Badge>
                
                <Button 
                  size="sm" 
                  variant={quiz ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setEditingQuiz(true)}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  {quiz ? 'Edit Quiz' : 'Add Quiz'}
                </Button>
                
                <Button 
                  size="sm" 
                  variant={assignment ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setEditingAssignment(true)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {assignment ? 'Edit Assignment' : 'Add Assignment'}
                </Button>

                {(quiz || assignment) && (
                  <div className="pt-2 space-y-1">
                    {quiz && (
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-xs text-blue-700">Quiz: {quiz.title}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setQuiz(undefined)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    {assignment && (
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-xs text-green-700">Assignment: {assignment.title}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setAssignment(undefined)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Badge variant="secondary" className="mb-2">
                  Quick Upload
                </Badge>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
              <CardDescription>Create engaging lesson content with rich formatting</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="edit" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Visual
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="edit" className="space-y-4">
                  {/* Enhanced Formatting Toolbar */}
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
                      onClick={() => insertFormatting('bold')}
                      className="p-2"
                      title="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => insertFormatting('italic')}
                      className="p-2"
                      title="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => insertFormatting('list')}
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
                      onClick={() => insertFormatting('link')}
                      className="p-2"
                      title="Insert Link"
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => insertFormatting('image')}
                      className="p-2"
                      title="Insert Image"
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => insertFormatting('video')}
                      className="p-2"
                      title="Insert Video"
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => insertFormatting('pdf')}
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

                  <Textarea
                    id="lesson-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your lesson content here. Use the toolbar buttons to add media..."
                    className="min-h-[400px] resize-none"
                  />

                  <div className="text-sm text-gray-500 space-y-2">
                    <p>💡 Use the toolbar buttons to insert images, videos, PDFs, and links into your content.</p>
                    <p>📁 Upload files directly using the "Quick Upload" button or choose URL/Upload in the media dialogs.</p>
                    <p>🎯 Add interactive content with quizzes and assignments to engage your students.</p>
                  </div>
                </TabsContent>

                <TabsContent value="preview">
                  <div className="min-h-[400px] p-4 border rounded-lg bg-white">
                    <h3 className="text-xl font-semibold mb-4">{title || "Lesson Preview"}</h3>
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={renderPreview()}
                    />
                    
                    {/* Preview interactive content */}
                    {(quiz || assignment) && (
                      <div className="mt-8 space-y-4">
                        <h4 className="text-lg font-semibold">Interactive Content</h4>
                        {quiz && (
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h5 className="font-medium text-blue-900">📝 Quiz: {quiz.title}</h5>
                            <p className="text-sm text-blue-700">{quiz.questions.length} questions</p>
                          </div>
                        )}
                        {assignment && (
                          <div className="p-4 bg-green-50 rounded-lg">
                            <h5 className="font-medium text-green-900">📋 Assignment: {assignment.title}</h5>
                            <p className="text-sm text-green-700">{assignment.maxPoints} points</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Media Insert Dialog */}
      <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
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
                  onChange={handleFileUpload}
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
            <Button variant="outline" onClick={() => setIsMediaDialogOpen(false)}>
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
    </div>
  );
};

export default LessonEditor;