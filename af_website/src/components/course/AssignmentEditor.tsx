
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, ArrowLeft, Calendar } from "lucide-react";
import { Assignment } from "@/types/courseTypes";

interface AssignmentEditorProps {
  assignment?: Assignment;
  onSave: (assignment: Omit<Assignment, 'id'>) => void;
  onClose: () => void;
}

const AssignmentEditor = ({ assignment, onSave, onClose }: AssignmentEditorProps) => {
  const [title, setTitle] = useState(assignment?.title || "");
  const [description, setDescription] = useState(assignment?.description || "");
  const [instructions, setInstructions] = useState(assignment?.instructions || "");
  const [dueDate, setDueDate] = useState(
    assignment?.dueDate ? assignment.dueDate.toISOString().split('T')[0] : ""
  );
  const [maxPoints, setMaxPoints] = useState(assignment?.maxPoints?.toString() || "100");
  const [submissionType, setSubmissionType] = useState<'text' | 'file' | 'both'>(
    assignment?.submissionType || 'text'
  );

  const handleSave = () => {
    onSave({
      title,
      description,
      instructions,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      maxPoints: parseInt(maxPoints),
      submissionType,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {assignment ? 'Edit Assignment' : 'Create Assignment'}
          </h2>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment Settings */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Settings</CardTitle>
              <CardDescription>Configure assignment properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Assignment Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter assignment title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Max Points</label>
                <Input
                  type="number"
                  value={maxPoints}
                  onChange={(e) => setMaxPoints(e.target.value)}
                  placeholder="100"
                  min="1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Submission Type</label>
                <Select value={submissionType} onValueChange={(value: 'text' | 'file' | 'both') => setSubmissionType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Submission</SelectItem>
                    <SelectItem value="file">File Upload</SelectItem>
                    <SelectItem value="both">Text + File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignment Content */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Description</CardTitle>
                <CardDescription>Provide an overview of what students need to do</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the assignment objectives and what students will learn..."
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
                <CardDescription>Detailed step-by-step instructions for completing the assignment</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Provide detailed instructions on how to complete this assignment..."
                  rows={8}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentEditor;