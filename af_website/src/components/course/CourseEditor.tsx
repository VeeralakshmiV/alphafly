import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useCourseStore, Course } from "@/stores/courseStore";

type Section = {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
    content: string;
  }[];
};
import LessonEditor from "./LessonEditor";

interface CourseEditorProps {
  course?: Course;
  onClose: () => void;
  onSave: () => void;
}

const CourseEditor = ({ course, onClose, onSave }: CourseEditorProps) => {
  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [sections, setSections] = useState<Section[]>(course?.sections || []);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ sectionId: string; lessonId?: string } | null>(null);
  const { addCourse, updateCourse } = useCourseStore();

  const handleSave = () => {
    const mappedSections = sections.map((section, idx) => ({
      id: section.id,
      title: section.title,
      description: "", // or section.description if you add it to your Section type
      order: idx,
      lessons: section.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
      })),
    }));

    const courseData = {
      title,
      description,
      sections: mappedSections,
    };

    if (course) {
      updateCourse(course.id, courseData);
    } else {
      addCourse(courseData);
    }
    onSave();
  };

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: "New Section",
      lessons: [],
    };
    setSections([...sections, newSection]);
    setEditingSection(newSection.id);
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    ));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  if (editingLesson) {
    const section = sections.find(s => s.id === editingLesson.sectionId);
    const lesson = editingLesson.lessonId 
      ? section?.lessons.find(l => l.id === editingLesson.lessonId)
      : undefined;

    return (
      <LessonEditor
        lesson={lesson}
        onSave={(lessonData) => {
          const updatedSections = sections.map(section => {
            if (section.id === editingLesson.sectionId) {
              if (editingLesson.lessonId) {
                // Update existing lesson
                return {
                  ...section,
                  lessons: section.lessons.map(lesson =>
                    lesson.id === editingLesson.lessonId ? { ...lesson, ...lessonData } : lesson
                  )
                };
              } else {
                // Add new lesson
                const newLesson = {
                  id: Date.now().toString(),
                  ...lessonData,
                };
                return {
                  ...section,
                  lessons: [...section.lessons, newLesson]
                };
              }
            }
            return section;
          });
          setSections(updatedSections);
          setEditingLesson(null);
        }}
        onClose={() => setEditingLesson(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {course ? 'Edit Course' : 'Create New Course'}
          </h2>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Course
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>Basic information about the course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Course Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter course title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter course description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sections */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Course Sections</CardTitle>
                  <CardDescription>Organize your course content into sections</CardDescription>
                </div>
                <Button onClick={addSection} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {sections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No sections yet. Add your first section to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map((section) => (
                    <Card key={section.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          {editingSection === section.id ? (
                            <div className="flex-1 flex items-center gap-2">
                              <Input
                                value={section.title}
                                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                className="flex-1"
                              />
                              <Button
                                size="sm"
                                onClick={() => setEditingSection(null)}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex-1">
                              <h4 className="font-semibold">{section.title}</h4>
                              <p className="text-sm text-gray-500">
                                {section.lessons.length} lessons
                              </p>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingLesson({ sectionId: section.id })}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingSection(section.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteSection(section.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      {section.lessons.length > 0 && (
                        <CardContent>
                          <div className="space-y-2">
                            {section.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <h5 className="font-medium">{lesson.title}</h5>
                                  <p className="text-sm text-gray-500">
                                    {lesson.content.substring(0, 100)}...
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingLesson({ sectionId: section.id, lessonId: lesson.id })}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;