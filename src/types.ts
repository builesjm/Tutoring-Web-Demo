export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: 'Elementary' | 'High School' | 'Uni';
  category?: string;
  image?: string;
  tutor?: string;
}

export interface Session {
  id: string;
  courseId?: string;
  studentId?: string;
  title: string;
  tutor: string;
  date: string;
  time: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'ongoing';
  type: 'video' | 'notes' | 'both';
  modality: 'online' | 'in-person';
  location?: string;
  image?: string;
}

export interface Feedback {
  id: string;
  courseId?: string;
  studentId?: string;
  tutor: string;
  text: string;
  date: string;
}

export interface Resource {
  id: string;
  courseId?: string;
  studentId?: string;
  title: string;
  type: 'pdf' | 'video' | 'zip';
  size?: string;
  duration?: string;
  itemsCount?: number;
  icon: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourseIds: string[];
  lastActivity: string;
}

export interface Availability {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}
<<<<<<< HEAD

export interface Tutor {
  id: string;
  name: string;
  email: string;
  subjects?: string[];
  lastActivity?: string;
}
=======
>>>>>>> cb3b7b0e70679f430807854dc87e1a18bffdd12b
