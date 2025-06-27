import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, X, HelpCircle, BookOpen } from "lucide-react";
import { Quiz, Assignment } from "@/stores/courseStore";

interface LessonSettingsProps {
  title: string;
  setTitle: (title: string) => void;
  quiz?: Quiz;
  assignment?: Assignment;
  onEditQuiz: () => void;
  onEditAssignment: () => void;
  onRemoveQuiz: () => void;
  onRemoveAssignment: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const LessonSettings = ({
  title,
  setTitle,
  quiz,
  assignment,
  onEditQuiz,
  onEditAssignment,
  onRemoveQuiz,
  onRemoveAssignment,
  onFileUpload,
  fileInputRef
}: LessonSettingsProps) => {
  return (
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
            onClick={onEditQuiz}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            {quiz ? 'Edit Quiz' : 'Add Quiz'}
          </Button>
          
          <Button 
            size="sm" 
            variant={assignment ? "default" : "outline"}
            className="w-full"
            onClick={onEditAssignment}
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
                    onClick={onRemoveQuiz}
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
                    onClick={onRemoveAssignment}
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
            onChange={onFileUpload}
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
  );
};

export default LessonSettings;