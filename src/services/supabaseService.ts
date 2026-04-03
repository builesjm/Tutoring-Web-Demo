import { supabase, supabaseAdmin } from '../lib/supabase';
import { Course, Session, Feedback, Resource, Student, Tutor, Earning, ContentPost } from '../types';

export const supabaseService = {
  async getCourses(): Promise<Course[]> {
    const { data, error } = await supabase.from('courses').select('*');
    if (error) { console.error('Error fetching courses:', error); return []; }
    return data as Course[];
  },

  async getSessions(): Promise<Session[]> {
    const { data, error } = await supabase.from('sessions').select('*');
    if (error) { console.error('Error fetching sessions:', error); return []; }
    return data as Session[];
  },

  async getFeedback(): Promise<Feedback[]> {
    const { data, error } = await supabase.from('feedback').select('*');
    if (error) { console.error('Error fetching feedback:', error); return []; }
    return data as Feedback[];
  },

  async getResources(): Promise<Resource[]> {
    const { data, error } = await supabase.from('resources').select('*');
    if (error) { console.error('Error fetching resources:', error); return []; }
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
    const record = { ...course, id: crypto.randomUUID() };
    const { data, error } = await supabase.from('courses').insert([record]).select().single();
    if (error) { console.error('Error adding course:', error); return null; }
    return data as Course;
  },

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
    const { data, error } = await supabase.from('courses').update(updates).eq('id', id).select().single();
    if (error) { console.error('Error updating course:', error); return null; }
    return data as Course;
  },

  async deleteCourse(id: string): Promise<boolean> {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) { console.error('Error deleting course:', error); return false; }
    return true;
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
    const record: Student = { id: crypto.randomUUID(), name, email, enrolledCourseIds: [], lastActivity: 'Invited' };
    const { data: studentData, error: studentError } = await supabase.from('students').insert([record]).select().single();
    if (studentError) { console.error('Error adding student:', studentError); return null; }
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
    if (supabaseAdmin) {
      // Look up the student's email to delete their auth account too
      const { data: student } = await supabaseAdmin.from('students').select('email').eq('id', id).single();
      if (student?.email) {
        const { data: profile } = await supabaseAdmin.from('profiles').select('id').eq('email', student.email).single();
        if (profile?.id) {
          await supabaseAdmin.auth.admin.deleteUser(profile.id);
          await supabaseAdmin.from('profiles').delete().eq('id', profile.id);
        }
      }
      const { error } = await supabaseAdmin.from('students').delete().eq('id', id);
      if (error) { console.error('Error deleting student:', error); return false; }
    } else {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) { console.error('Error deleting student:', error); return false; }
    }
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

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | null> {
    const { data, error } = await supabase.from('sessions').update(updates).eq('id', id).select().single();
    if (error) { console.error('Error updating session:', error); return null; }
    return data as Session;
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

  async updateStudentLastActivity(email: string): Promise<void> {
    await supabase.from('students').update({ lastActivity: new Date().toISOString() }).eq('email', email);
  },

  // Auth
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      await supabase.from('profiles').insert([{ id: data.user.id, role: 'tutor', name, email }]);
      await supabase.from('tutors').insert([{ id: crypto.randomUUID(), name, email, subjects: [], lastActivity: 'Just now' }]);
    }
    return data;
  },

  async setPasswordFromInvite(password: string, name: string) {
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

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Earnings
  async getEarnings(): Promise<Earning[]> {
    const { data, error } = await supabase.from('earnings').select('*');
    if (error) { console.error('Error fetching earnings:', error); return []; }
    return data as Earning[];
  },

  async upsertEarning(earning: Omit<Earning, 'id'>): Promise<Earning | null> {
    const { data: existing } = await supabase
      .from('earnings')
      .select('id')
      .eq('month', earning.month)
      .eq('year', earning.year)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('earnings')
        .update({ amount: earning.amount })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) { console.error('Error updating earning:', error); return null; }
      return data as Earning;
    } else {
      const record = { ...earning, id: crypto.randomUUID() };
      const { data, error } = await supabase
        .from('earnings')
        .insert([record])
        .select()
        .single();
      if (error) { console.error('Error adding earning:', error); return null; }
      return data as Earning;
    }
  },

  // Content Posts
  async getContentPosts(): Promise<ContentPost[]> {
    const { data, error } = await supabase.from('content_posts').select('*');
    if (error) { console.error('Error fetching content posts:', error); return []; }
    return data as ContentPost[];
  },

  async addContentPost(post: Omit<ContentPost, 'id' | 'createdAt'>): Promise<ContentPost | null> {
    const record: ContentPost = { ...post, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const { data, error } = await supabase.from('content_posts').insert([record]).select().single();
    if (error) { console.error('Error adding content post:', error); return null; }
    return data as ContentPost;
  },

  async updateContentPost(id: string, updates: Partial<Omit<ContentPost, 'id' | 'createdAt'>>): Promise<ContentPost | null> {
    const { data, error } = await supabase.from('content_posts').update(updates).eq('id', id).select().single();
    if (error) { console.error('Error updating content post:', error); return null; }
    return data as ContentPost;
  },

  async deleteContentPost(id: string): Promise<boolean> {
    const { error } = await supabase.from('content_posts').delete().eq('id', id);
    if (error) { console.error('Error deleting content post:', error); return false; }
    return true;
  },

  async deleteContentPostsByCourse(courseId: string): Promise<boolean> {
    const { error } = await supabase.from('content_posts').delete().eq('courseId', courseId);
    if (error) { console.error('Error deleting content posts for course:', error); return false; }
    return true;
  },

  async deleteSessionsByCourse(courseId: string): Promise<boolean> {
    const { error } = await supabase.from('sessions').delete().eq('courseId', courseId);
    if (error) { console.error('Error deleting sessions for course:', error); return false; }
    return true;
  },

  async deleteResourcesByCourse(courseId: string): Promise<boolean> {
    const { error } = await supabase.from('resources').delete().eq('courseId', courseId);
    if (error) { console.error('Error deleting resources for course:', error); return false; }
    return true;
  },

  async deleteFeedbackByCourse(courseId: string): Promise<boolean> {
    const { error } = await supabase.from('feedback').delete().eq('courseId', courseId);
    if (error) { console.error('Error deleting feedback for course:', error); return false; }
    return true;
  },
};
