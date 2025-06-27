
// Updated types to match actual database schema
export interface DatabaseCourse {
  id: string;
  name: string;
  description: string | null;
  instructor_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  sections: CourseSection[];
  status: 'draft' | 'published';
  enrollment_fee: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: CourseContent[];
}

export interface CourseContent {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'assignment';
  content: string;
  order: number;
  is_free: boolean;
  video_url?: string;
  duration_minutes?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

// Legacy types for backward compatibility
export interface Lesson {
  id: string;
  title: string;
  content: string;
  quiz?: Quiz;
  assignment?: Assignment;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  dueDate?: Date;
  maxPoints: number;
  submissionType: 'text' | 'file' | 'both';
}