
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { CourseContent, QuizQuestion } from '@/types/courseTypes';

interface ContentState {
  content: Record<string, CourseContent[]>;
  quizQuestions: Record<string, QuizQuestion[]>;
  createContent: (sectionId: string, content: Omit<CourseContent, 'id'>) => Promise<CourseContent>;
  updateContent: (id: string, updates: Partial<CourseContent>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  createQuizQuestion: (contentId: string, question: Omit<QuizQuestion, 'id'>) => Promise<void>;
  updateQuizQuestion: (id: string, updates: Partial<QuizQuestion>) => Promise<void>;
  deleteQuizQuestion: (id: string) => Promise<void>;
  setContent: (sectionId: string, content: CourseContent[]) => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  content: {},
  quizQuestions: {},

  setContent: (sectionId: string, content: CourseContent[]) => {
    set(state => ({
      content: {
        ...state.content,
        [sectionId]: content
      }
    }));
  },

  createContent: async (sectionId, contentData) => {
    try {
      console.log('Creating content for section:', sectionId, contentData);
      
      const { data, error } = await supabase
        .from('course_content')
        .insert({
          section_id: sectionId,
          title: contentData.title,
          content: contentData.content,
          type: contentData.type,
          order_index: contentData.order,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating content:', error);
        throw error;
      }

      console.log('Content created successfully:', data);

      const newContent: CourseContent = {
        id: data.id,
        title: data.title,
        content: data.content || '',
        type: data.type as 'lesson' | 'quiz' | 'assignment',
        order: data.order_index,
        is_free: false,
      };

      set(state => ({
        content: {
          ...state.content,
          [sectionId]: [...(state.content[sectionId] || []), newContent]
        }
      }));

      return newContent;
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  },

  updateContent: async (id, updates) => {
    try {
      console.log('Updating content:', id, updates);
      
      const { error } = await supabase
        .from('course_content')
        .update({
          title: updates.title,
          content: updates.content,
          type: updates.type,
          order_index: updates.order,
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating content:', error);
        throw error;
      }

      console.log('Content updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  },

  deleteContent: async (id) => {
    try {
      console.log('Deleting content:', id);
      
      const { error } = await supabase
        .from('course_content')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting content:', error);
        throw error;
      }

      console.log('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  },

  // Quiz question actions (implemented for future use)
  createQuizQuestion: async (contentId, questionData) => {
    try {
      console.log('Quiz question creation - to be implemented with quiz table');
      // This will be implemented when quiz questions table is added
    } catch (error) {
      console.error('Error creating quiz question:', error);
      throw error;
    }
  },

  updateQuizQuestion: async (id, updates) => {
    try {
      console.log('Quiz question update - to be implemented with quiz table');
      // This will be implemented when quiz questions table is added
    } catch (error) {
      console.error('Error updating quiz question:', error);
      throw error;
    }
  },

  deleteQuizQuestion: async (id) => {
    try {
      console.log('Quiz question deletion - to be implemented with quiz table');
      // This will be implemented when quiz questions table is added
    } catch (error) {
      console.error('Error deleting quiz question:', error);
      throw error;
    }
  }
}));