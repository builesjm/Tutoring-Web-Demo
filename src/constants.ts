import { Course, Session, Feedback, Resource } from './types';

export const COURSES: Course[] = [
  {
    id: 'math-1',
    title: 'Foundation Math',
    description: 'Mastering numeracy, logic, and problem-solving principles.',
    icon: 'calculate',
    level: 'Elementary',
  },
  {
    id: 'writing-1',
    title: 'Creative Writing',
    description: 'Unlocking imagination through structured storytelling.',
    icon: 'edit_note',
    level: 'Elementary',
  },
  {
    id: 'science-1',
    title: 'General Science',
    description: 'Exploration of the natural world and scientific principles.',
    icon: 'biotech',
    level: 'Elementary',
  },
  {
    id: 'study-1',
    title: 'Study Skills',
    description: 'Teaching students effective ways to learn and manage time.',
    icon: 'auto_stories',
    level: 'Elementary',
  },
  {
    id: 'functions-1',
    title: 'Advanced Functions',
    description: 'Master polynomial, rational, and trigonometric functions with intuitive mental models.',
    icon: 'functions',
    level: 'High School',
  },
  {
    id: 'physics-1',
    title: 'Physics',
    description: 'Exploring the laws of the universe from kinematics to quantum theory.',
    icon: 'architecture',
    level: 'High School',
  },
  {
    id: 'chem-1',
    title: 'Chemistry',
    description: 'Understand chemical trends and reactions through a structured lens.',
    icon: 'science',
    level: 'High School',
  },
  {
    id: 'lit-1',
    title: 'English Literature',
    description: 'Critical analysis and persuasive writing workshops focused on academic voice.',
    icon: 'history_edu',
    level: 'High School',
  },
  {
    id: 'inter-1',
    title: 'Interdisciplinary',
    description: 'Developing critical thinking skills for university success across all pathways.',
    icon: 'psychology',
    level: 'High School',
  },
  {
    id: 'algebra-1',
    title: 'Linear Algebra',
    description: 'Master vector spaces, inner products, and eigenvalue problems through visual frameworks.',
    icon: 'grid_3x3',
    level: 'Uni',
  },
  {
    id: 'ochem-1',
    title: 'Organic Chemistry',
    description: 'Breaking down reaction mechanisms, stereochemistry, and synthesis pathways into mental models.',
    icon: 'biotech',
    level: 'Uni',
  },
  {
    id: 'econ-1',
    title: 'Microeconomics',
    description: 'Exploring consumer theory, market structures, and game theory strategy for academia.',
    icon: 'trending_up',
    level: 'Uni',
  },
  {
    id: 'writing-uni',
    title: 'Academic Writing',
    description: 'Elevate your research papers, theses, and dissertation structure with peer-reviewed clarity.',
    icon: 'edit_note',
    level: 'Uni',
  },
  {
    id: 'quantum-1',
    title: 'Quantum Physics',
    description: 'Introduction to wave-particle duality, Schrödinger’s equation, and quantum mechanics.',
    icon: 'blur_on',
    level: 'Uni',
  },
  {
    id: 'history-1',
    title: 'Global History',
    description: 'A comprehensive analysis of historical turning points and their socio-economic impact.',
    icon: 'public',
    level: 'Uni',
  },
];

export const SESSIONS: Session[] = [
  {
    id: 's1',
    title: 'Organic Chemistry II',
    tutor: 'Dr. Aris Thorne',
    date: 'Monday, Oct 24',
    time: '4:00 PM',
    duration: 90,
    status: 'completed',
    type: 'both',
    image: 'https://picsum.photos/seed/lab/400/225',
  },
  {
    id: 's2',
    title: 'Macroeconomics Intro',
    tutor: 'Sarah Jenkins',
    date: 'Friday, Oct 21',
    time: '2:30 PM',
    duration: 60,
    status: 'completed',
    type: 'video',
    image: 'https://picsum.photos/seed/econ/400/225',
  },
  {
    id: 's3',
    title: 'Advanced Calculus',
    tutor: 'Dr. Aris Thorne',
    date: 'Today',
    time: '4:00 PM',
    duration: 60,
    status: 'upcoming',
    type: 'video',
  },
];

export const FEEDBACK: Feedback[] = [
  {
    id: 'f1',
    tutor: 'Prof. H. Miller',
    text: 'Your understanding of metabolic pathways has significantly improved. Try to focus on...',
    date: 'Oct 25',
  },
  {
    id: 'f2',
    tutor: 'Dr. Sarah Jenkins',
    text: 'Excellent progress on the thesis draft. The structural flow is much tighter.',
    date: 'Oct 23',
  },
];

export const RESOURCES: Resource[] = [
  {
    id: 'r1',
    title: 'Comprehensive Logic Gate Manual',
    type: 'pdf',
    size: '4.2 MB',
    icon: 'picture_as_pdf',
  },
  {
    id: 'r2',
    title: 'Statistical Analysis: R-Studio Basics',
    type: 'video',
    duration: '14:02',
    icon: 'play_lesson',
  },
  {
    id: 'r3',
    title: 'Exam Prep: Victorian Literature',
    type: 'zip',
    itemsCount: 12,
    icon: 'folder_open',
  },
];
