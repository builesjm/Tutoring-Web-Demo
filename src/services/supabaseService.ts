<<<<<<< HEAD
import { supabase, supabaseAdmin } from '../lib/supabase';
import { Course, Session, Feedback, Resource, Student, Tutor } from '../types';
=======
import { supabase } from '../lib/supabase';
import { Course, Session, Feedback, Resource } from '../types';
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b

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
<<<<<<< HEAD
    const record = { ...course, id: crypto.randomUUID() };
    const { data, error } = await supabase
      .from('courses')
      .insert([record])
      .select()
      .single();

=======
    const { data, error } = await supabase
      .from('courses')
      .insert([course])
      .select()
      .single();
    
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
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
<<<<<<< HEAD

=======
    
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
    if (error) {
      console.error('Error deleting course:', error);
      return false;
    }
    return true;
<<<<<<< HEAD
  },

  // Students
  async getStudents(): Promise<Student[]> {
    const { data, error } = await supabase.from('students').select('*');
    if (error) { console.error('Error fetching students:', error); return []; }
    return data as Student[];
  },

  async addStudent(student: Omit<Student, 'id'>): Promise<Student | null> {
    const record = { ...student, id: crypto.randomUUID() };
    const { data, error } = await supabase.from('students').insert([record]).select().single();
    if (error) { console.error('Error adding student:', error); return null; }
    return data as Student;
  },

  async inviteStudent(name: string, email: string): Promise<Student | null> {
    if (!supabaseAdmin) {
      console.error('Service role key not configured. Cannot send invites.');
      return null;
    }
    // Insert into students table first
    const record: Student = { id: crypto.randomUUID(), name, email, enrolledCourseIds: [], lastActivity: 'Invited' };
    const { data: studentData, error: studentError } = await supabase.from('students').insert([record]).select().single();
    if (studentError) { console.error('Error adding student:', studentError); return null; }

    // Send invite email via Supabase Auth
    const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { role: 'student', name },
    });
    if (inviteError) { console.error('Error sending invite:', inviteError); }

    return studentData as Student;
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student | null> {
    const { data, error } = await supabase.from('students').update(updates).eq('id', id).select().single();
    if (error) { console.error('Error updating student:', error); return null; }
    return data as Student;
  },

  async deleteStudent(id: string): Promise<boolean> {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) { console.error('Error deleting student:', error); return false; }
    return true;
  },

  // Sessions
  async addSession(session: Omit<Session, 'id'>): Promise<Session | null> {
    const record = { ...session, id: crypto.randomUUID() };
    const { data, error } = await supabase.from('sessions').insert([record]).select().single();
    if (error) { console.error('Error adding session:', error); return null; }
    return data as Session;
  },

  async deleteSession(id: string): Promise<boolean> {
    const { error } = await supabase.from('sessions').delete().eq('id', id);
    if (error) { console.error('Error deleting session:', error); return false; }
    return true;
  },

  // Resources
  async addResource(resource: Omit<Resource, 'id'>): Promise<Resource | null> {
    const record = { ...resource, id: crypto.randomUUID() };
    const { data, error } = await supabase.from('resources').insert([record]).select().single();
    if (error) { console.error('Error adding resource:', error); return null; }
    return data as Resource;
  },

  async deleteResource(id: string): Promise<boolean> {
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (error) { console.error('Error deleting resource:', error); return false; }
    return true;
  },

  // Feedback
  async addFeedback(feedback: Omit<Feedback, 'id'>): Promise<Feedback | null> {
    const record = { ...feedback, id: crypto.randomUUID() };
    const { data, error } = await supabase.from('feedback').insert([record]).select().single();
    if (error) { console.error('Error adding feedback:', error); return null; }
    return data as Feedback;
  },

  async deleteFeedback(id: string): Promise<boolean> {
    const { error } = await supabase.from('feedback').delete().eq('id', id);
    if (error) { console.error('Error deleting feedback:', error); return false; }
    return true;
  },

  // Tutors
  async getTutors(): Promise<Tutor[]> {
    const { data, error } = await supabase.from('tutors').select('*');
    if (error) { console.error('Error fetching tutors:', error); return []; }
    return data as Tutor[];
  },

  async addTutor(tutor: Omit<Tutor, 'id'>): Promise<Tutor | null> {
    const record = { ...tutor, id: crypto.randomUUID() };
    const { data, error } = await supabase.from('tutors').insert([record]).select().single();
    if (error) { console.error('Error adding tutor:', error); return null; }
    return data as Tutor;
  },

  async deleteTutor(id: string): Promise<boolean> {
    const { error } = await supabase.from('tutors').delete().eq('id', id);
    if (error) { console.error('Error deleting tutor:', error); return false; }
    return true;
  },

  // Auth
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signUp(email: string, password: string, name: string) {
    // Only tutors sign up directly; students must use invite links
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      await supabase.from('profiles').insert([{ id: data.user.id, role: 'tutor', name, email }]);
      await supabase.from('tutors').insert([{ id: crypto.randomUUID(), name, email, subjects: [], lastActivity: 'Just now' }]);
    }
    return data;
  },

  async setPasswordFromInvite(password: string, name: string) {
    // Called after student clicks invite link — session is already active
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    if (data.user) {
      await supabase.from('profiles').upsert([{ id: data.user.id, role: 'student', name, email: data.user.email }]);
    }
    return data;
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) return null;
    return data as { id: string; role: string; name: string; email: string };
  },
=======
  }
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
};
