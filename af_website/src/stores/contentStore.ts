import { create } from 'zustand';
import axios from 'axios';
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

  setContent: (sectionId, content) => {
    set(state => ({
      content: {
        ...state.content,
        [sectionId]: content,
      },
    }));
  },

  createContent: async (sectionId, contentData) => {
    try {
      const response = await axios.post('/api/content', {
        sectionId,
        ...contentData,
      });

      const newContent: CourseContent = response.data;

      set(state => ({
        content: {
          ...state.content,
          [sectionId]: [...(state.content[sectionId] || []), newContent],
        },
      }));

      return newContent;
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  },

  updateContent: async (id, updates) => {
    try {
      await axios.put(`/api/content/${id}`, updates);
      console.log('Content updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  },

  deleteContent: async (id) => {
    try {
      await axios.delete(`/api/content/${id}`);
      console.log('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  },

  createQuizQuestion: async (contentId, questionData) => {
    try {
      await axios.post(`/api/content/${contentId}/quiz`, questionData);
    } catch (error) {
      console.error('Error creating quiz question:', error);
      throw error;
    }
  },

  updateQuizQuestion: async (id, updates) => {
    try {
      await axios.put(`/api/quiz/${id}`, updates);
    } catch (error) {
      console.error('Error updating quiz question:', error);
      throw error;
    }
  },

  deleteQuizQuestion: async (id) => {
    try {
      await axios.delete(`/api/quiz/${id}`);
    } catch (error) {
      console.error('Error deleting quiz question:', error);
      throw error;
    }
  }
}));
