export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: 'Elementary' | 'High School' | 'Uni';
  category?: string;
}

export interface Session {
  id: string;
  title: string;
  tutor: string;
  date: string;
  time: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'ongoing';
  type: 'video' | 'notes' | 'both';
  image?: string;
}

export interface Feedback {
  id: string;
  tutor: string;
  text: string;
  date: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'zip';
  size?: string;
  duration?: string;
  itemsCount?: number;
  icon: string;
}
