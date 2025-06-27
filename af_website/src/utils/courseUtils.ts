
import { DatabaseCourse, Course, CourseSection } from '@/types/courseTypes';

// Helper function to convert database course to frontend course
export const convertDatabaseCourse = (dbCourse: DatabaseCourse, sections: CourseSection[] = []): Course => ({
  id: dbCourse.id,
  title: dbCourse.name,
  description: dbCourse.description || '',
  instructor: dbCourse.instructor_id || 'Unknown',
  sections: sections,
  status: 'draft' as const,
  enrollment_fee: 0,
  createdAt: dbCourse.created_at,
  updatedAt: dbCourse.updated_at
});