import { supabase } from '../lib/supabase';
import { Course, Session, Feedback, Resource } from '../types';

export const supabaseService = {
  async getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*');
    
    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
    return data as Course[];
  },

  async getSessions(): Promise<Session[]> {
    const { data, error } = await supabase
      .from('sessions')
      .select('*');
    
    if (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
    return data as Session[];
  },

  async getFeedback(): Promise<Feedback[]> {
    const { data, error } = await supabase
      .from('feedback')
      .select('*');
    
    if (error) {
      console.error('Error fetching feedback:', error);
      return [];
    }
    return data as Feedback[];
  },

  async getResources(): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*');
    
    if (error) {
      console.error('Error fetching resources:', error);
      return [];
    }
    return data as Resource[];
  },

  async testConnection() {
    try {
      const { data, error } = await supabase.from('courses').select('id').limit(1);
      if (error) throw error;
      console.log('Supabase connection successful');
      return true;
    } catch (error) {
      console.error('Supabase connection failed:', error);
      return false;
    }
  },

  async addCourse(course: Omit<Course, 'id'>): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .insert([course])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding course:', error);
      return null;
    }
    return data as Course;
  },

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating course:', error);
      return null;
    }
    return data as Course;
  },

  async deleteCourse(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting course:', error);
      return false;
    }
    return true;
  }
};
