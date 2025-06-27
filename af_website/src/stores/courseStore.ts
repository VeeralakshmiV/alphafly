import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Course, DatabaseCourse, Lesson } from '@/types/courseTypes';

interface CourseState {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  createCourse: (course: Omit<Course, 'id' | 'sections' | 'createdAt' | 'updatedAt'>) => Promise<Course>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  getCourseById: (id: string) => Course | undefined;
  addCourse: (courseData: Omit<Course, 'id' | 'sections' | 'createdAt' | 'updatedAt'>) => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('Fetching courses from Supabase...');
      
      // Fetch courses with sections and content
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          course_sections (
            *,
            course_content (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        throw coursesError;
      }

      console.log('Courses data received:', coursesData);

      // Transform database courses to application format
      const transformedCourses: Course[] = coursesData?.map((dbCourse: any) => ({
        id: dbCourse.id,
        title: dbCourse.name,
        description: dbCourse.description || '',
        instructor: 'System Admin',
        status: 'published' as const,
        enrollment_fee: 0,
        createdAt: dbCourse.created_at,
        updatedAt: dbCourse.updated_at,
        sections: dbCourse.course_sections?.map((section: any) => ({
          id: section.id,
          title: section.title,
          order: section.order_index,
          lessons: section.course_content?.map((content: any) => ({
            id: content.id,
            title: content.title,
            content: content.content || '',
            type: content.type as 'lesson' | 'quiz' | 'assignment',
            order: content.order_index,
            is_free: false,
          })) || []
        })) || []
      })) || [];

      console.log('Transformed courses:', transformedCourses);
      set({ courses: transformedCourses, isLoading: false });
    } catch (error) {
      console.error('Error in fetchCourses:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch courses', 
        isLoading: false 
      });
    }
  },

  createCourse: async (courseData) => {
    try {
      console.log('Creating course:', courseData);
      
      const { data, error } = await supabase
        .from('courses')
        .insert({
          name: courseData.title,
          description: courseData.description,
          instructor_id: null // Will be set when user management is implemented
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating course:', error);
        throw error;
      }

      console.log('Course created successfully:', data);

      const newCourse: Course = {
        id: data.id,
        title: data.name,
        description: data.description || '',
        instructor: courseData.instructor,
        status: courseData.status,
        enrollment_fee: courseData.enrollment_fee,
        sections: [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      set(state => ({
        courses: [newCourse, ...state.courses]
      }));

      return newCourse;
    } catch (error) {
      console.error('Error in createCourse:', error);
      throw error;
    }
  },

  updateCourse: async (id, updates) => {
    try {
      console.log('Updating course:', id, updates);
      
      const { error } = await supabase
        .from('courses')
        .update({
          name: updates.title,
          description: updates.description,
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating course:', error);
        throw error;
      }

      console.log('Course updated successfully');

      set(state => ({
        courses: state.courses.map(course =>
          course.id === id ? { ...course, ...updates } : course
        )
      }));
    } catch (error) {
      console.error('Error in updateCourse:', error);
      throw error;
    }
  },

  deleteCourse: async (id) => {
    try {
      console.log('Deleting course:', id);
      
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting course:', error);
        throw error;
      }

      console.log('Course deleted successfully');

      set(state => ({
        courses: state.courses.filter(course => course.id !== id)
      }));
    } catch (error) {
      console.error('Error in deleteCourse:', error);
      throw error;
    }
  },

  getCourseById: (id) => {
    return get().courses.find(course => course.id === id);
  },

  addCourse: (courseData) => {
    // For local state only (if you want to support local add)
    const newCourse: Course = {
      id: Date.now().toString(),
      title: courseData.title,
      description: courseData.description,
      instructor: 'System Admin',
      status: 'draft',
      enrollment_fee: 0,
      sections: courseData.sections || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      courses: [newCourse, ...state.courses],
    }));
  },
}));

export type { Course, Lesson };