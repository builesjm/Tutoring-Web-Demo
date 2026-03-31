import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
<<<<<<< HEAD
import { Course, Session, Feedback, Resource, Student, Availability, Tutor } from '../types';
import { supabaseService } from '../services/supabaseService';
import { SESSIONS, FEEDBACK, RESOURCES, STUDENTS } from '../constants';
=======
import { Course, Session, Feedback, Resource, Student, Availability } from '../types';
import { supabaseService } from '../services/supabaseService';
import { COURSES, SESSIONS, FEEDBACK, RESOURCES, STUDENTS } from '../constants';
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b

interface DataContextType {
  courses: Course[];
  sessions: Session[];
  feedback: Feedback[];
  resources: Resource[];
  students: Student[];
<<<<<<< HEAD
  tutors: Tutor[];
=======
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
  availability: Availability[];
  isLoading: boolean;
  role: string | null;
  setRole: (role: string | null) => void;
<<<<<<< HEAD
  currentUserEmail: string | null;
  setCurrentUserEmail: (email: string | null) => void;
=======
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
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
<<<<<<< HEAD
  addTutor: (tutor: Omit<Tutor, 'id'>) => Promise<void>;
  deleteTutor: (id: string) => Promise<void>;
=======
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
<<<<<<< HEAD
  const [courses, setCourses] = useState<Course[]>([]);
=======
  const [courses, setCourses] = useState<Course[]>(COURSES);
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const [feedback, setFeedback] = useState<Feedback[]>(FEEDBACK);
  const [resources, setResources] = useState<Resource[]>(RESOURCES);
  const [students, setStudents] = useState<Student[]>(STUDENTS);
<<<<<<< HEAD
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [availability, setAvailabilityState] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
=======
  const [availability, setAvailabilityState] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b

  const fetchData = async () => {
    setIsLoading(true);
    try {
<<<<<<< HEAD
      const [c, s, f, r, st, t] = await Promise.all([
=======
      const [c, s, f, r] = await Promise.all([
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
        supabaseService.getCourses(),
        supabaseService.getSessions(),
        supabaseService.getFeedback(),
        supabaseService.getResources(),
<<<<<<< HEAD
        supabaseService.getStudents(),
        supabaseService.getTutors(),
      ]);

      setCourses(c);
      if (s.length > 0) setSessions(s);
      if (f.length > 0) setFeedback(f);
      if (r.length > 0) setResources(r);
      if (st.length > 0) setStudents(st);
      setTutors(t);
=======
      ]);

      // Only update if we actually got data (tables exist)
      if (c.length > 0) setCourses(c);
      if (s.length > 0) setSessions(s);
      if (f.length > 0) setFeedback(f);
      if (r.length > 0) setResources(r);
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
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
<<<<<<< HEAD
=======
      // Fallback for demo if supabase fails
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
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
<<<<<<< HEAD
    await supabaseService.deleteCourse(id);
    setCourses(prev => prev.filter(c => c.id !== id));
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
=======
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
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const addSession = async (session: Omit<Session, 'id'>) => {
<<<<<<< HEAD
    const result = await supabaseService.addSession(session);
    if (result) {
      setSessions(prev => [...prev, result]);
    } else {
      setSessions(prev => [...prev, { ...session, id: Math.random().toString(36).substr(2, 9) } as Session]);
    }
  };

  const deleteSession = async (id: string) => {
    await supabaseService.deleteSession(id);
=======
    const newSession = { ...session, id: Math.random().toString(36).substr(2, 9) };
    setSessions(prev => [...prev, newSession as Session]);
  };

  const deleteSession = async (id: string) => {
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const addResource = async (resource: Omit<Resource, 'id'>) => {
<<<<<<< HEAD
    const result = await supabaseService.addResource(resource);
    if (result) {
      setResources(prev => [...prev, result]);
    } else {
      setResources(prev => [...prev, { ...resource, id: Math.random().toString(36).substr(2, 9) } as Resource]);
    }
  };

  const deleteResource = async (id: string) => {
    await supabaseService.deleteResource(id);
=======
    const newResource = { ...resource, id: Math.random().toString(36).substr(2, 9) };
    setResources(prev => [...prev, newResource as Resource]);
  };

  const deleteResource = async (id: string) => {
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const addFeedback = async (f: Omit<Feedback, 'id'>) => {
<<<<<<< HEAD
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

  const deleteTutor = async (id: string) => {
    await supabaseService.deleteTutor(id);
    setTutors(prev => prev.filter(t => t.id !== id));
  };

=======
    const newFeedback = { ...f, id: Math.random().toString(36).substr(2, 9) };
    setFeedback(prev => [...prev, newFeedback as Feedback]);
  };

  const deleteFeedback = async (id: string) => {
    setFeedback(prev => prev.filter(f => f.id !== id));
  };

>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
  useEffect(() => {
    fetchData();
  }, []);

  return (
<<<<<<< HEAD
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
=======
    <DataContext.Provider value={{ 
      courses, 
      sessions, 
      feedback, 
      resources, 
      students,
      isLoading, 
      role,
      setRole,
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
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
<<<<<<< HEAD
      setAvailability: setAvailabilityState,
      addTutor,
      deleteTutor,
=======
      setAvailability: setAvailabilityState
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
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
