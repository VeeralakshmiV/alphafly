import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, BookOpen, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CourseEditor from "./CourseEditor";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  sections: any[];
  status: string;
  enrollment_fee: number;
}

interface CourseManagerProps {
  role: "admin" | "staff" | "student";
}

const CourseManager = ({ role }: CourseManagerProps) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data = await res.json();
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  };

  const addCourse = async (courseData: Partial<Course>) => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(courseData)
    });
    if (!res.ok) throw new Error('Failed to create course');
    await fetchCourses();
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update course');
    await fetchCourses();
  };

  const deleteCourse = async (courseId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete course');
    await fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setShowEditor(true);
  };

  const handleEditCourse = (courseId: string) => {
    setEditingCourse(courseId);
    setShowEditor(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId);
        toast({
          title: "Success",
          description: "Course deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete course",
          variant: "destructive",
        });
      }
    }
  };

  const canManageCourses = role === 'admin' || role === 'staff';

  if (showEditor) {
    return (
      <CourseEditor
        course={editingCourse ? courses.find(c => c.id === editingCourse) : undefined}
        onClose={() => setShowEditor(false)}
        onSave={() => {
          setShowEditor(false);
          fetchCourses();
        }}
        addCourse={addCourse}
        updateCourse={updateCourse}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Course Management</h2>
          <p className="text-muted-foreground">
            Manage your courses, sections, and learning materials
          </p>
        </div>
        {canManageCourses && (
          <Button onClick={handleCreateCourse} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Course
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Instructor: {course.instructor}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={course.status === 'published' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {course.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.sections.length} sections</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${course.enrollment_fee}</span>
                    </div>
                  </div>
                </div>

                {canManageCourses && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCourse(course.id)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {courses.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-500 mb-4">
            {canManageCourses 
              ? "Get started by creating your first course."
              : "No courses are available yet."
            }
          </p>
          {canManageCourses && (
            <Button onClick={handleCreateCourse}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Course
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseManager;