import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course, Session, Feedback, Resource, Student, Availability } from '../types';
import { supabaseService } from '../services/supabaseService';
import { COURSES, SESSIONS, FEEDBACK, RESOURCES, STUDENTS } from '../constants';

interface DataContextType {
  courses: Course[];
  sessions: Session[];
  feedback: Feedback[];
  resources: Resource[];
  students: Student[];
  availability: Availability[];
  isLoading: boolean;
  role: string | null;
  setRole: (role: string | null) => void;
  refreshData: () => Promise<void>;
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addSession: (session: Omit<Session, 'id'>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  addResource: (resource: Omit<Resource, 'id'>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  addFeedback: (feedback: Omit<Feedback, 'id'>) => Promise<void>;
  deleteFeedback: (id: string) => Promise<void>;
  setAvailability: (availability: Availability[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const [feedback, setFeedback] = useState<Feedback[]>(FEEDBACK);
  const [resources, setResources] = useState<Resource[]>(RESOURCES);
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const [availability, setAvailabilityState] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [c, s, f, r] = await Promise.all([
        supabaseService.getCourses(),
        supabaseService.getSessions(),
        supabaseService.getFeedback(),
        supabaseService.getResources(),
      ]);

      // Only update if we actually got data (tables exist)
      if (c.length > 0) setCourses(c);
      if (s.length > 0) setSessions(s);
      if (f.length > 0) setFeedback(f);
      if (r.length > 0) setResources(r);
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
      // Fallback for demo if supabase fails
      const demoCourse = { ...course, id: Math.random().toString(36).substr(2, 9) };
      setCourses(prev => [...prev, demoCourse]);
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
    const success = await supabaseService.deleteCourse(id);
    if (success) {
      setCourses(prev => prev.filter(c => c.id !== id));
    } else {
      setCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  const addStudent = async (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Math.random().toString(36).substr(2, 9) };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStudent = async (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const addSession = async (session: Omit<Session, 'id'>) => {
    const newSession = { ...session, id: Math.random().toString(36).substr(2, 9) };
    setSessions(prev => [...prev, newSession as Session]);
  };

  const deleteSession = async (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const addResource = async (resource: Omit<Resource, 'id'>) => {
    const newResource = { ...resource, id: Math.random().toString(36).substr(2, 9) };
    setResources(prev => [...prev, newResource as Resource]);
  };

  const deleteResource = async (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const addFeedback = async (f: Omit<Feedback, 'id'>) => {
    const newFeedback = { ...f, id: Math.random().toString(36).substr(2, 9) };
    setFeedback(prev => [...prev, newFeedback as Feedback]);
  };

  const deleteFeedback = async (id: string) => {
    setFeedback(prev => prev.filter(f => f.id !== id));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ 
      courses, 
      sessions, 
      feedback, 
      resources, 
      students,
      isLoading, 
      role,
      setRole,
      refreshData: fetchData,
      addCourse,
      updateCourse,
      deleteCourse,
      addStudent,
      updateStudent,
      deleteStudent,
      addSession,
      deleteSession,
      addResource,
      deleteResource,
      addFeedback,
      deleteFeedback,
      availability,
      setAvailability: setAvailabilityState
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
