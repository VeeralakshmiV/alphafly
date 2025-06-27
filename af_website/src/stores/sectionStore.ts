
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { CourseSection } from '@/types/courseTypes';

interface SectionState {
  sections: Record<string, CourseSection[]>;
  createSection: (courseId: string, section: Omit<CourseSection, 'id' | 'lessons'>) => Promise<void>;
  updateSection: (id: string, updates: Partial<CourseSection>) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
  setSections: (courseId: string, sections: CourseSection[]) => void;
}

export const useSectionStore = create<SectionState>((set, get) => ({
  sections: {},

  setSections: (courseId: string, sections: CourseSection[]) => {
    set(state => ({
      sections: {
        ...state.sections,
        [courseId]: sections
      }
    }));
  },

  createSection: async (courseId, sectionData) => {
    try {
      const { data, error } = await supabase
        .from('course_sections')
        .insert({
          course_id: courseId,
          title: sectionData.title,
          order_index: sectionData.order
        })
        .select()
        .single();

      if (error) throw error;

      const newSection: CourseSection = {
        id: data.id,
        title: data.title,
        order: data.order_index,
        lessons: []
      };

      set(state => ({
        sections: {
          ...state.sections,
          [courseId]: [...(state.sections[courseId] || []), newSection]
        }
      }));
    } catch (error) {
      console.error('Error creating section:', error);
      throw error;
    }
  },

  updateSection: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('course_sections')
        .update({
          title: updates.title,
          order_index: updates.order
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  },

  deleteSection: async (id) => {
    try {
      const { error } = await supabase
        .from('course_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting section:', error);
      throw error;
    }
  }
}));