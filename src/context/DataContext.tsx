import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course, Session, Feedback, Resource, Student, Availability, Tutor, Earning, ContentPost } from '../types';
import { supabaseService } from '../services/supabaseService';
import { SESSIONS, FEEDBACK, RESOURCES, STUDENTS } from '../constants';

interface DataContextType {
  courses: Course[];
  sessions: Session[];
  feedback: Feedback[];
  resources: Resource[];
  students: Student[];
  tutors: Tutor[];
  availability: Availability[];
  isLoading: boolean;
  role: string | null;
  setRole: (role: string | null) => void;
  currentUserEmail: string | null;
  setCurrentUserEmail: (email: string | null) => void;
  currentUserName: string | null;
  setCurrentUserName: (name: string | null) => void;
  refreshData: () => Promise<void>;
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addSession: (session: Omit<Session, 'id'>) => Promise<void>;
  updateSession: (id: string, updates: Partial<Session>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  addResource: (resource: Omit<Resource, 'id'>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  addFeedback: (feedback: Omit<Feedback, 'id'>) => Promise<void>;
  deleteFeedback: (id: string) => Promise<void>;
  setAvailability: (availability: Availability[]) => void;
  addTutor: (tutor: Omit<Tutor, 'id'>) => Promise<void>;
  updateTutor: (id: string, updates: Partial<Tutor>) => Promise<void>;
  deleteTutor: (id: string) => Promise<void>;
  earnings: Earning[];
  upsertEarning: (earning: Omit<Earning, 'id'>) => Promise<void>;
  contentPosts: ContentPost[];
  addContentPost: (post: Omit<ContentPost, 'id' | 'createdAt'>) => Promise<void>;
  updateContentPost: (id: string, updates: Partial<Omit<ContentPost, 'id' | 'createdAt'>>) => Promise<void>;
  deleteContentPost: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const [feedback, setFeedback] = useState<Feedback[]>(FEEDBACK);
  const [resources, setResources] = useState<Resource[]>(RESOURCES);
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [contentPosts, setContentPosts] = useState<ContentPost[]>([]);
  const [availability, setAvailabilityState] = useState<Availability[]>(() => {
    try {
      const saved = localStorage.getItem('tutor_availability');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [c, s, f, r, st, t, e, cp] = await Promise.all([
        supabaseService.getCourses(),
        supabaseService.getSessions(),
        supabaseService.getFeedback(),
        supabaseService.getResources(),
        supabaseService.getStudents(),
        supabaseService.getTutors(),
        supabaseService.getEarnings(),
        supabaseService.getContentPosts(),
      ]);

      setCourses(c);
      if (s.length > 0) setSessions(s);
      if (f.length > 0) setFeedback(f);
      if (r.length > 0) setResources(r);
      if (st.length > 0) setStudents(st);
      setTutors(t);
      setEarnings(e);
      setContentPosts(cp);
    } catch (error) {
      console.error('Error loading data from Supabase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addCourse = async (course: Omit<Course, 'id'>) => {
    const newCourse = await supabaseService.addCourse(course);
    if (newCourse) {
      setCourses(prev => [...prev, newCourse]);
    } else {
      setCourses(prev => [...prev, { ...course, id: Math.random().toString(36).substr(2, 9) }]);
    }
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    const updated = await supabaseService.updateCourse(id, updates);
    if (updated) {
      setCourses(prev => prev.map(c => c.id === id ? updated : c));
    } else {
      setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    }
  };

  const deleteCourse = async (id: string) => {
    await Promise.all([
      supabaseService.deleteCourse(id),
      supabaseService.deleteSessionsByCourse(id),
      supabaseService.deleteResourcesByCourse(id),
      supabaseService.deleteFeedbackByCourse(id),
      supabaseService.deleteContentPostsByCourse(id),
    ]);
    const affected = students.filter(s => s.enrolledCourseIds.includes(id));
    await Promise.all(
      affected.map(s => supabaseService.updateStudent(s.id, {
        enrolledCourseIds: s.enrolledCourseIds.filter(cid => cid !== id),
      }))
    );
    setCourses(prev => prev.filter(c => c.id !== id));
    setSessions(prev => prev.filter(s => s.courseId !== id));
    setResources(prev => prev.filter(r => r.courseId !== id));
    setFeedback(prev => prev.filter(f => f.courseId !== id));
    setContentPosts(prev => prev.filter(cp => cp.courseId !== id));
    setStudents(prev =>
      prev.map(s =>
        s.enrolledCourseIds.includes(id)
          ? { ...s, enrolledCourseIds: s.enrolledCourseIds.filter(cid => cid !== id) }
          : s
      )
    );
  };

  const addStudent = async (student: Omit<Student, 'id'>) => {
    const result = await supabaseService.addStudent(student);
    if (result) {
      setStudents(prev => [...prev, result]);
    } else {
      setStudents(prev => [...prev, { ...student, id: Math.random().toString(36).substr(2, 9) }]);
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    const result = await supabaseService.updateStudent(id, updates);
    if (result) {
      setStudents(prev => prev.map(s => s.id === id ? result : s));
    } else {
      setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }
  };

  const deleteStudent = async (id: string) => {
    await supabaseService.deleteStudent(id);
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const addSession = async (session: Omit<Session, 'id'>) => {
    const result = await supabaseService.addSession(session);
    if (result) {
      setSessions(prev => [...prev, result]);
    } else {
      setSessions(prev => [...prev, { ...session, id: Math.random().toString(36).substr(2, 9) } as Session]);
    }
  };

  const updateSession = async (id: string, updates: Partial<Session>) => {
    const result = await supabaseService.updateSession(id, updates);
    if (result) {
      setSessions(prev => prev.map(s => s.id === id ? result : s));
    } else {
      setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }
  };

  const deleteSession = async (id: string) => {
    await supabaseService.deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const addResource = async (resource: Omit<Resource, 'id'>) => {
    const result = await supabaseService.addResource(resource);
    if (result) {
      setResources(prev => [...prev, result]);
    } else {
      setResources(prev => [...prev, { ...resource, id: Math.random().toString(36).substr(2, 9) } as Resource]);
    }
  };

  const deleteResource = async (id: string) => {
    await supabaseService.deleteResource(id);
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const addFeedback = async (f: Omit<Feedback, 'id'>) => {
    const result = await supabaseService.addFeedback(f);
    if (result) {
      setFeedback(prev => [...prev, result]);
    } else {
      setFeedback(prev => [...prev, { ...f, id: Math.random().toString(36).substr(2, 9) } as Feedback]);
    }
  };

  const deleteFeedback = async (id: string) => {
    await supabaseService.deleteFeedback(id);
    setFeedback(prev => prev.filter(f => f.id !== id));
  };

  const addTutor = async (tutor: Omit<Tutor, 'id'>) => {
    const result = await supabaseService.addTutor(tutor);
    if (result) {
      setTutors(prev => [...prev, result]);
    } else {
      setTutors(prev => [...prev, { ...tutor, id: Math.random().toString(36).substr(2, 9) }]);
    }
  };

  const updateTutor = async (id: string, updates: Partial<Tutor>) => {
    const result = await supabaseService.updateTutor(id, updates);
    if (result) {
      setTutors(prev => prev.map(t => t.id === id ? result : t));
    } else {
      setTutors(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }
  };

  const deleteTutor = async (id: string) => {
    await supabaseService.deleteTutor(id);
    setTutors(prev => prev.filter(t => t.id !== id));
  };

  const addContentPost = async (post: Omit<ContentPost, 'id' | 'createdAt'>) => {
    const result = await supabaseService.addContentPost(post);
    if (result) {
      setContentPosts(prev => [...prev, result]);
    } else {
      setContentPosts(prev => [...prev, { ...post, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]);
    }
  };

  const updateContentPost = async (id: string, updates: Partial<Omit<ContentPost, 'id' | 'createdAt'>>) => {
    const result = await supabaseService.updateContentPost(id, updates);
    if (result) {
      setContentPosts(prev => prev.map(cp => cp.id === id ? result : cp));
    } else {
      setContentPosts(prev => prev.map(cp => cp.id === id ? { ...cp, ...updates } : cp));
    }
  };

  const deleteContentPost = async (id: string) => {
    await supabaseService.deleteContentPost(id);
    setContentPosts(prev => prev.filter(cp => cp.id !== id));
  };

  const upsertEarning = async (earning: Omit<Earning, 'id'>) => {
    const result = await supabaseService.upsertEarning(earning);
    if (result) {
      setEarnings(prev => {
        const idx = prev.findIndex(e => e.month === earning.month && e.year === earning.year);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = result;
          return updated;
        }
        return [...prev, result];
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (role === 'student' && currentUserEmail) {
      supabaseService.updateStudentLastActivity(currentUserEmail);
    }
  }, [role, currentUserEmail]);

  return (
    <DataContext.Provider value={{
      courses,
      sessions,
      feedback,
      resources,
      students,
      tutors,
      isLoading,
      role,
      setRole,
      currentUserEmail,
      setCurrentUserEmail,
      currentUserName,
      setCurrentUserName,
      refreshData: fetchData,
      addCourse,
      updateCourse,
      deleteCourse,
      addStudent,
      updateStudent,
      deleteStudent,
      addSession,
      updateSession,
      deleteSession,
      addResource,
      deleteResource,
      addFeedback,
      deleteFeedback,
      availability,
      setAvailability: (a: Availability[]) => {
        setAvailabilityState(a);
        try { localStorage.setItem('tutor_availability', JSON.stringify(a)); } catch {}
      },
      addTutor,
      updateTutor,
      deleteTutor,
      earnings,
      upsertEarning,
      contentPosts,
      addContentPost,
      updateContentPost,
      deleteContentPost,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
