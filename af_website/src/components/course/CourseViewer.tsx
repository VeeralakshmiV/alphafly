import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, CheckCircle, Clock, BookOpen, LogOut, ChevronRight, ChevronDown } from "lucide-react";
import { Course, Lesson } from "@/stores/courseStore";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
  onLogout: () => void;
}

const CourseViewer = ({ course, onBack, onLogout }: CourseViewerProps) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const markLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const totalLessons = course.sections.reduce((total, section) => total + section.lessons.length, 0);
  const progressPercentage = (completedLessons.size / totalLessons) * 100;

  const renderLessonContent = (content: string) => {
    // Simple markdown-like rendering
    let rendered = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '• $1')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
      .replace(/\n/g, '<br>');

    return { __html: rendered };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                  <p className="text-sm text-gray-500">{course.description}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Course Progress</CardTitle>
                <CardDescription>
                  {completedLessons.size} of {totalLessons} lessons completed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progressPercentage} className="h-3" />
                <p className="text-sm text-gray-600">{Math.round(progressPercentage)}% Complete</p>

                <div className="space-y-2">
                  {course.sections.map((section) => (
                    <Collapsible
                      key={section.id}
                      open={openSections[section.id]}
                      onOpenChange={() => toggleSection(section.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-2 h-auto"
                        >
                          <span className="font-medium text-left">{section.title}</span>
                          {openSections[section.id] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 ml-4">
                        {section.lessons.map((lesson) => {
                          const isCompleted = completedLessons.has(lesson.id);
                          const isActive = selectedLesson?.id === lesson.id;
                          
                          return (
                            <Button
                              key={lesson.id}
                              variant={isActive ? "secondary" : "ghost"}
                              className="w-full justify-start text-sm p-2 h-auto"
                              onClick={() => setSelectedLesson(lesson)}
                            >
                              <div className="flex items-center gap-2">
                                {isCompleted ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Clock className="h-4 w-4 text-gray-400" />
                                )}
                                <span className="text-left">{lesson.title}</span>
                              </div>
                            </Button>
                          );
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-3">
            {selectedLesson ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedLesson.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {completedLessons.has(selectedLesson.id) ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                        )}
                      </div>
                    </div>
                    {!completedLessons.has(selectedLesson.id) && (
                      <Button
                        onClick={() => markLessonComplete(selectedLesson.id)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={renderLessonContent(selectedLesson.content)}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-16">
                <CardContent>
                  <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Welcome to {course.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Select a lesson from the sidebar to start learning
                  </p>
                  {course.sections.length > 0 && course.sections[0].lessons.length > 0 && (
                    <Button
                      onClick={() => setSelectedLesson(course.sections[0].lessons[0])}
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <Play className="h-5 w-5" />
                      Start First Lesson
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
