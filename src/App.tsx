import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  User, 
  Search, 

  ChevronRight, 
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Play, 
  FileText, 
  Clock,
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowRight,
  Star,
  CheckCircle2,
  BrainCircuit,
  Sparkles,
  ArrowUpRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Video,
  Users,
  UserCheck,
  PlusCircle,
  FilePlus,
  BarChart3,
  LayoutGrid,
  List,
  MapPin,
  Globe,
  RefreshCcw,
  Check,
  MoreVertical,
  Trash2,
  Edit3,
  Phone,
  Link2,
  DollarSign,
  Youtube,
  Upload,
  ExternalLink,
  FileIcon,
  Image,
  Film,
  Plus,
  Crown,
} from 'lucide-react';
import { Course, Session, Feedback, Resource, Student, Tutor, Earning, ContentPost, ContentItem } from './types';
import { DataProvider, useData } from './context/DataContext';
import { supabaseService } from './services/supabaseService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  Legend
} from 'recharts';
import { 
  format, 
  startOfWeek, 
  addDays, 
  isSameDay, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  subMonths, 
  addYears, 
  subYears,
  isToday,
  addWeeks,
  subWeeks,
  parse,
  isWithinInterval,
  setHours,
  setMinutes,
  startOfDay,
  endOfDay,
  formatDistanceToNow
} from 'date-fns';

const formatLastActivity = (lastActivity?: string): string => {
  if (!lastActivity) return 'Never';
  const d = new Date(lastActivity);
  if (!isNaN(d.getTime())) {
    return formatDistanceToNow(d, { addSuffix: true });
  }
  return lastActivity;
};

const toYouTubeEmbed = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (!match) return null;
  return `https://www.youtube.com/embed/${match[1]}`;
};

const fileIconForType = (fileType: string) => {
  if (fileType.startsWith('image/')) return <Image size={16} className="text-pink-500" />;
  if (fileType.startsWith('video/')) return <Film size={16} className="text-purple-500" />;
  if (fileType === 'application/pdf') return <FileText size={16} className="text-red-500" />;
  return <FileIcon size={16} className="text-on-surface-variant" />;
};

// --- Components ---

const Sidebar = ({ onLogout, role }: { onLogout: () => void, role: string }) => {
  const location = useLocation();
  const { currentUserEmail } = useData();
  const [profileOpen, setProfileOpen] = useState(false);
  
  const studentNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: GraduationCap, label: 'Resources', path: '/resources' },
  ];

  const tutorNavItems = [
    { icon: LayoutDashboard, label: 'Tutor Dashboard', path: '/' },
    { icon: BookOpen, label: 'Manage Courses', path: '/courses' },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: GraduationCap, label: 'Tutors', path: '/tutors' },
    { icon: FileText, label: 'Resources', path: '/resources' },
    { icon: BarChart3, label: 'Beta - Analytics', path: '/analytics' },
  ];

  const navItems = role === 'tutor' ? tutorNavItems : studentNavItems;

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-surface-container-low border-r border-outline-variant/30 p-6">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary">
          <BrainCircuit size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-primary">DM - Tutoring</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-container text-primary font-semibold shadow-sm' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-outline-variant/30 relative">
        <button
          onClick={() => setProfileOpen(prev => !prev)}
          className="flex items-center gap-3 w-full px-2 py-2 rounded-xl hover:bg-surface-container-high transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-bold text-sm">
            {currentUserEmail ? currentUserEmail[0].toUpperCase() : <User size={16} />}
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-xs font-semibold text-on-surface truncate">{currentUserEmail ?? 'Account'}</p>
            <p className="text-xs text-on-surface-variant capitalize">{role}</p>
          </div>
          <ChevronUp size={14} className={`text-on-surface-variant transition-transform ${profileOpen ? '' : 'rotate-180'}`} />
        </button>

        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-0 right-0 mb-2 bg-surface border border-outline-variant/30 rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => { setProfileOpen(false); onLogout(); }}
                className="flex items-center gap-3 px-4 py-3 text-red-600 w-full text-left hover:bg-red-50 transition-colors text-sm font-medium"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

const MobileNav = ({ role }: { role: string }) => {
  const location = useLocation();
  const studentNavItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: GraduationCap, label: 'Resources', path: '/resources' },
  ];

  const tutorNavItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: GraduationCap, label: 'Tutors', path: '/tutors' },
    { icon: FileText, label: 'Resources', path: '/resources' },
  ];

  const navItems = role === 'tutor' ? tutorNavItems : studentNavItems;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant/30 px-6 py-3 flex justify-between items-center z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const MobileTopBar = ({ onLogout }: { onLogout: () => void }) => {
  const { currentUserEmail, role } = useData();
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest border-b border-outline-variant/20 px-4 py-2.5 flex items-center justify-between">
      <span className="text-sm font-black text-on-surface tracking-tight">DM - Tutoring</span>
      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-9 h-9 rounded-full bg-primary-container border-2 border-primary/10 flex items-center justify-center text-primary"
        >
          <User size={18} />
        </button>
        {open && (
          <>
            <div className="fixed inset-0" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-2 bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden min-w-[180px] z-50">
              <div className="px-4 py-3 border-b border-outline-variant/20">
                <p className="text-xs font-bold text-on-surface truncate">{currentUserEmail ?? ''}</p>
                <p className="text-[10px] text-on-surface-variant capitalize">{role}</p>
              </div>
              <button
                onClick={() => { setOpen(false); onLogout(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} /> Log out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  const { currentUserName, role } = useData();

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-on-surface">{title}</h2>
        {subtitle && <p className="text-on-surface-variant mt-1">{subtitle}</p>}
      </div>
      <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-outline-variant/30">
        <div className="text-right">
          <p className="text-sm font-semibold text-on-surface">{currentUserName || 'User'}</p>
          <p className="text-xs text-on-surface-variant capitalize">{role || 'user'}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary-container border-2 border-primary/10 flex items-center justify-center text-primary">
          <User size={20} />
        </div>
      </div>
    </header>
  );
};

// --- Pages ---

const CourseModal = ({ course, onClose }: { course: Course, onClose: () => void }) => {
  const { sessions, feedback, resources } = useData();
  const courseSessions = sessions.filter(s => s.courseId === course.id);
  const courseFeedback = feedback.filter(f => f.courseId === course.id);
  const courseResources = resources.filter(r => r.courseId === course.id);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-surface-container-low w-full max-w-4xl max-h-[90vh] rounded-[40px] overflow-hidden shadow-2xl border border-outline-variant/30 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 md:p-8 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-surface-container-high text-on-surface-variant transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h3 className="text-2xl font-black text-on-surface">{course.title}</h3>
              <p className="text-sm text-on-surface-variant font-medium">{getLevelLabel(course.level)} • Academic Course</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-red-50 text-on-surface-variant hover:text-red-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar">
          {/* Course Overview */}
          <section>
            <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Course Overview</h4>
            <p className="text-on-surface-variant leading-relaxed">{course.description}</p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Videos & Sessions */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <Video size={20} className="text-primary" /> Videos & Sessions
              </h4>
              <div className="space-y-4">
                {courseSessions.length > 0 ? courseSessions.map(session => (
                  <div key={session.id} className="group bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 hover:border-primary/30 transition-all cursor-pointer">
                    <div className="flex gap-4">
                      <div className="w-24 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                        <img src={session.image || 'https://picsum.photos/seed/edu/200/150'} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play size={16} className="text-white" fill="currentColor" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-on-surface text-sm truncate group-hover:text-primary transition-colors">{session.title}</h5>
                        <p className="text-[10px] text-on-surface-variant mt-1 font-bold uppercase tracking-wider">{formatSessionDate(session.date)} • {session.duration}m</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-on-surface-variant italic">No sessions recorded yet.</p>
                )}
              </div>
            </div>

            {/* Files & Resources */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <FileText size={20} className="text-primary" /> Course Files
              </h4>
              <div className="space-y-3">
                {courseResources.length > 0 ? courseResources.map(res => (
                  <div key={res.id} className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 hover:bg-surface-container-high transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">{res.title}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">{res.type} • {res.size || res.duration || `${res.itemsCount} items`}</p>
                    </div>
                    <ArrowUpRight size={16} className="text-outline-variant group-hover:text-primary transition-colors" />
                  </div>
                )) : (
                  <p className="text-sm text-on-surface-variant italic">No resources uploaded yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Tutor Feedback */}
          <section>
            <h4 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-primary" /> Tutor Feedback
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courseFeedback.length > 0 ? courseFeedback.map(item => (
                <div key={item.id} className="p-5 bg-tertiary-container/30 rounded-3xl border border-tertiary/10 relative group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                        <User size={16} />
                      </div>
                      <span className="text-xs font-bold text-tertiary">{item.tutor}</span>
                    </div>
                    <span className="text-[10px] text-tertiary/60 font-medium">{item.date}</span>
                  </div>
                  <p className="text-sm text-tertiary/80 italic leading-relaxed">"{item.text}"</p>
                </div>
              )) : (
                <p className="text-sm text-on-surface-variant italic">No feedback received yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-6 md:p-8 bg-surface-container-lowest border-t border-outline-variant/20 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-primary text-on-primary rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { courses, students, contentPosts, currentUserEmail } = useData();

  const currentStudent = students.find(s => s.email === currentUserEmail);
  const enrolledCourses = currentStudent
    ? courses.filter(c => currentStudent.enrolledCourseIds.includes(c.id))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto"
    >
      <Header title="Dashboard" />

      {/* Welcome Banner */}
      <div className="bg-primary/10 rounded-[32px] p-7 mb-8 relative overflow-hidden border border-primary/20">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-end gap-1 pointer-events-none select-none opacity-20">
          <Sparkles size={56} className="text-primary" strokeWidth={1} />
          <Sparkles size={32} className="text-primary mb-4" strokeWidth={1} />
        </div>
        <div className="relative">
          <h2 className="text-2xl md:text-3xl font-black text-primary leading-snug">
            Welcome back, {currentStudent?.name?.split(' ')[0] ?? 'there'}.<br />
            <span className="font-medium">What would you like to learn today?</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column: Current Courses + Resources */}
        <div className="lg:col-span-8 space-y-8">
          {/* Current Courses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-3xl font-black text-on-surface">Current Courses</h4>
              <Link to="/courses" className="text-base font-bold text-primary hover:underline flex items-center gap-1">
                View all courses <ArrowRight size={15} />
              </Link>
            </div>

            {enrolledCourses.length === 0 && (
              <p className="text-on-surface-variant text-sm py-4">No courses assigned yet. Your tutor will add courses for you.</p>
            )}
            {enrolledCourses.map((course) => {
              const latestPost = contentPosts
                .filter(cp => cp.courseId === course.id && cp.status === 'published')
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
              const seenPostId = localStorage.getItem(`seen_post_${course.id}`);
              const isNew = latestPost
                ? latestPost.id !== seenPostId &&
                  (Date.now() - new Date(latestPost.createdAt).getTime()) < 7 * 86400000
                : false;
              return (
                <button
                  key={course.id}
                  onClick={() => {
                    if (latestPost) {
                      localStorage.setItem(`seen_post_${course.id}`, latestPost.id);
                    }
                    navigate(`/courses/${course.id}`);
                  }}
                  className={`w-full text-left rounded-[28px] border transition-all duration-200 p-6 flex items-center gap-6 group ${
                    isNew
                      ? 'bg-primary/5 border-primary/40 shadow-md hover:shadow-xl hover:border-primary/70'
                      : 'bg-surface-container-lowest border-outline-variant/20 hover:border-primary/40 hover:shadow-lg'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <h5 className="text-2xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">{course.title}</h5>
                    <div className="flex items-center gap-3 flex-wrap">
                      {latestPost && isNew && (
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                          </span>
                          <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary text-on-primary shadow-sm">
                            New Posting!
                          </span>
                          <span className="text-xs text-on-surface-variant font-medium truncate max-w-[200px]">
                            {latestPost.title}
                          </span>
                        </div>
                      )}
                      {!latestPost && (
                        <span className="text-xs text-on-surface-variant/50 italic">No posts yet</span>
                      )}
                    </div>
                  </div>
                  {course.tutor && (() => {
                    const tutorList = course.tutor!.split(',').map(t => t.trim()).filter(Boolean);
                    const multiple = tutorList.length > 1;
                    return (
                      <div className="flex flex-col items-center gap-1 flex-shrink-0" style={{ minWidth: multiple ? 80 : 72 }}>
                        {/* avatar row — overlapping when multiple */}
                        <div className={`flex items-center ${multiple ? '-space-x-3' : ''}`}>
                          {tutorList.map((name, i) => (
                            <div
                              key={i}
                              title={name}
                              className={`rounded-full bg-primary/10 text-primary flex items-center justify-center font-black border-2 border-surface-container-lowest group-hover:bg-primary group-hover:text-on-primary transition-all duration-200 ${
                                multiple ? 'w-10 h-10 text-sm' : 'w-16 h-16 text-2xl'
                              }`}
                              style={{ zIndex: tutorList.length - i }}
                            >
                              {name[0].toUpperCase()}
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mt-1">
                          {multiple ? 'Tutors' : 'Tutor'}
                        </p>
                        <p className="text-sm font-bold text-on-surface text-center leading-tight max-w-[90px]">
                          {tutorList.join(', ')}
                        </p>
                      </div>
                    );
                  })()}
                </button>
              );
            })}
          </div>

        </div>

        {/* Side Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Quote Card */}
          {(() => {
            const quotes = [
              { text: 'Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.', author: 'Albert Einstein', role: 'Theoretical Physicist' },
              { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain', role: 'Author' },
              { text: 'It always seems impossible until it is done.', author: 'Nelson Mandela', role: 'Leader & Activist' },
              { text: 'You don\'t have to be great to start, but you have to start to be great.', author: 'Zig Ziglar', role: 'Author & Speaker' },
              { text: 'The more that you read, the more things you will know. The more that you learn, the more places you\'ll go.', author: 'Dr. Seuss', role: 'Author' },
              { text: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier', role: 'Author' },
              { text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela', role: 'Leader & Activist' },
              { text: 'The beautiful thing about learning is that nobody can take it away from you.', author: 'B.B. King', role: 'Musician' },
              { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson', role: 'Author & Humorist' },
              { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', role: '26th U.S. President' },
            ];
            const q = quotes[Math.floor(Date.now() / 86400000) % quotes.length];
            return (
              <section className="bg-surface-container-low rounded-[40px] p-8 border border-outline-variant/30 border-l-4 border-l-primary">
                <p className="text-base italic text-on-surface leading-relaxed mb-6">"{q.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm flex-shrink-0">
                    {q.author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{q.author}</p>
                    <p className="text-xs text-on-surface-variant">{q.role}</p>
                  </div>
                </div>
              </section>
            );
          })()}

          {/* Tutoring Tip */}
          {(() => {
            const tips = [
              {
                title: 'The Feynman Technique',
                quote: 'If you want to master something, teach it. Simplify the concept until a friend could understand it from scratch.',
                label: 'Learn the technique',
                url: 'https://fs.blog/feynman-technique/',
              },
              {
                title: 'Space Out Your Studying',
                quote: 'Cramming feels productive but fades fast. Studying the same material across multiple shorter sessions locks it into long-term memory.',
                label: 'How spaced repetition works',
                url: 'https://www.youtube.com/watch?v=Z-zNHHpXoMM',
              },
              {
                title: 'Active Recall Beats Re-reading',
                quote: 'Closing your notes and trying to recall what you just learned — even imperfectly — is one of the most effective study habits you can build.',
                label: 'See the research',
                url: 'https://www.youtube.com/watch?v=ukLnPbIffxE',
              },
              {
                title: 'The 2-Minute Rule',
                quote: 'If a task takes less than two minutes, do it now. Letting small tasks pile up creates mental clutter that makes everything harder.',
                label: 'Read more',
                url: 'https://jamesclear.com/how-to-stop-procrastinating',
              },
              {
                title: 'Sleep Is Part of Studying',
                quote: 'Your brain consolidates what you learned during sleep. Pulling an all-nighter before a test often does more harm than good.',
                label: 'Why sleep matters for memory',
                url: 'https://www.youtube.com/watch?v=LWULB9Aoopc',
              },
              {
                title: 'Write It By Hand',
                quote: 'Taking notes by hand — instead of typing — forces you to process and summarize ideas, which leads to better understanding.',
                label: 'The science behind it',
                url: 'https://www.youtube.com/watch?v=IlU-zDU6aQ0',
              },
              {
                title: 'Start With the Hardest Thing',
                quote: 'Tackle your most difficult subject or task first, when your focus and energy are at their peak. Save easier work for later.',
                label: 'Explore deep work',
                url: 'https://www.youtube.com/watch?v=gTaJhjQHcf8',
              },
              {
                title: 'Ask "Why?" More Often',
                quote: 'Understanding why something works — not just how — makes it stick. Push past memorization and look for the logic underneath.',
                label: 'First principles thinking',
                url: 'https://fs.blog/first-principles/',
              },
              {
                title: 'Take Real Breaks',
                quote: 'Short breaks during study sessions improve focus over time. Step away fully — no phone, no half-studying. Then come back sharp.',
                label: 'The Pomodoro method',
                url: 'https://www.youtube.com/watch?v=mNBmG24djoY',
              },
              {
                title: 'Mistakes Are the Material',
                quote: 'Every wrong answer is information. Instead of moving on, pause and figure out exactly where your thinking went wrong.',
                label: 'Growth mindset explained',
                url: 'https://www.youtube.com/watch?v=hiiEeMN7vbQ',
              },
            ];
            const dayIndex = Math.floor(Date.now() / 86400000) % tips.length;
            const tip = tips[dayIndex];
            return (
              <section className="bg-primary rounded-[40px] p-8 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none select-none">
                  <BrainCircuit size={120} className="text-on-primary" strokeWidth={0.8} />
                </div>
                <div className="relative">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-primary/60 flex items-center gap-2 mb-3">
                    <Sparkles size={13} /> Scholar's Tip
                  </p>
                  <h5 className="text-xl font-black text-on-primary mb-3">{tip.title}</h5>
                  <p className="text-sm text-on-primary/80 leading-relaxed mb-6">"{tip.quote}"</p>
                  <a
                    href={tip.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-on-primary flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    {tip.label} <ExternalLink size={14} />
                  </a>
                </div>
              </section>
            );
          })()}
        </div>
      </div>
    </motion.div>
  );
};

const Courses = () => {
  const [activeTab, setActiveTab] = React.useState<'All' | 'Elementary' | 'High School' | 'Uni'>('All');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCourse, setSelectedCourse] = React.useState<import('./types').Course | null>(null);
  const { courses } = useData();

  const filteredCourses = courses.filter(course => {
    const matchesTab = activeTab === 'All' || course.level === activeTab;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-7xl mx-auto"
    >
      <Header title="Courses" />

      {/* Search & Filter & View Toggle */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for subjects, tutors, or topics..." 
            className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30 overflow-x-auto no-scrollbar">
            {(['All', 'Elementary', 'High School', 'Uni'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab === 'All' ? 'All' : getLevelLabel(tab)}
              </button>
            ))}
          </div>

          <div className="flex bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all ${
                viewMode === 'grid' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-all ${
                viewMode === 'list' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Course Grid/List */}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredCourses.length > 0 ? filteredCourses.map((course) => {
          if (viewMode === 'list') {
            return (
              <div key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="group bg-surface-container-lowest rounded-3xl border border-outline-variant/30 hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-container text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-all">
                  <BookOpen size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-0.5">
                    <h3 className="text-base font-black text-on-surface truncate group-hover:text-primary transition-colors">{course.title}</h3>
                    <span className="text-[8px] font-black uppercase tracking-widest text-secondary bg-secondary-container/50 px-2 py-0.5 rounded-full">{getLevelLabel(course.level)}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate">{course.description}</p>
                </div>
                <ChevronRight size={18} className="text-outline-variant group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            );
          }

          return (
            <div key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="group bg-surface-container-lowest rounded-[32px] border border-outline-variant/30 hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer flex flex-col p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary-container text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all duration-200">
                  <BookOpen size={28} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary-container/50 px-3 py-1 rounded-full">{getLevelLabel(course.level)}</span>
              </div>
              <h3 className="text-xl font-black text-on-surface mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2 flex-1">{course.description}</p>
              <div className="mt-6 flex items-center justify-end">
                <ChevronRight size={20} className="text-outline-variant group-hover:text-primary transition-colors" />
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-on-surface">No courses found</h3>
            <p className="text-on-surface-variant">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Course description modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCourse(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface rounded-[32px] border border-outline-variant/30 shadow-2xl max-w-lg w-full p-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary-container/30 px-2 py-0.5 rounded-md">{getLevelLabel(selectedCourse.level)}</span>
                    <h2 className="text-xl font-black text-on-surface mt-1">{selectedCourse.title}</h2>
                  </div>
                </div>
                <button onClick={() => setSelectedCourse(null)} className="text-on-surface-variant hover:text-on-surface transition-colors p-1">
                  <X size={22} />
                </button>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">{selectedCourse.description || 'No description available.'}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SessionDetailView = ({
  session,
  course,
  resources,
  onBack,
}: {
  session: Session;
  course: Course;
  resources: Resource[];
  onBack: () => void;
}) => {
  const sessionFiles = resources.slice(0, 3); // use course resources as shared files demo
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6 font-semibold">
        <ChevronLeft size={18} /> Back to Sessions
      </button>

      {/* Session Header */}
      <div className="mb-10">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <div>
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest mb-2 ${
              session.status === 'completed' ? 'text-primary' : session.status === 'upcoming' ? 'text-blue-500' : 'text-amber-500'
            }`}>
              {session.status === 'completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
              {session.status}
            </span>
            <h1 className="text-3xl font-black text-on-surface mb-1">{session.title}</h1>
            <p className="text-sm text-on-surface-variant">{course.title}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface">{formatSessionDate(session.date)}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{session.time} · {session.duration}min</p>
            {session.location && <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1 justify-end"><MapPin size={11} /> {session.location}</p>}
          </div>
        </div>
        {session.description && <p className="text-sm text-on-surface-variant leading-relaxed">{session.description}</p>}
      </div>

      <div className="space-y-12">
        {/* Recording */}
        <div>
          <h2 className="text-lg font-black text-on-surface mb-4">Recording</h2>
          {session.status === 'completed' ? (
            <div className="bg-surface-container rounded-2xl aspect-video flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Play size={28} className="text-on-primary ml-1" />
              </div>
              <p className="text-sm font-bold text-on-surface">Recording Available</p>
              <p className="text-xs text-on-surface-variant">{session.duration} min · {session.type === 'video' || session.type === 'both' ? 'Video + Audio' : 'Audio Only'}</p>
            </div>
          ) : (
            <div className="bg-surface-container rounded-2xl aspect-video flex flex-col items-center justify-center gap-3 opacity-50">
              <Film size={36} className="text-outline-variant" />
              <p className="text-sm text-on-surface-variant">Available after the session</p>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <h2 className="text-lg font-black text-on-surface mb-4">Session Notes</h2>
          {session.description ? (
            <p className="text-sm text-on-surface leading-relaxed">{session.description}</p>
          ) : (
            <p className="text-sm text-on-surface-variant italic">
              {session.status === 'upcoming' ? 'Notes will be added during or after the session.' : 'No notes added for this session yet.'}
            </p>
          )}
        </div>

        {/* Shared Files */}
        <div>
          <h2 className="text-lg font-black text-on-surface mb-4">Shared Files</h2>
          {sessionFiles.length === 0 ? (
            <p className="text-sm text-on-surface-variant italic">No files shared for this session.</p>
          ) : (
            <div className="divide-y divide-outline-variant/15">
              {sessionFiles.map(res => {
                const iconBg = res.type === 'pdf' ? 'bg-red-100 text-red-500' : res.type === 'video' ? 'bg-blue-100 text-blue-500' : 'bg-orange-100 text-orange-500';
                const iconEl = res.type === 'pdf' ? <FileText size={16} /> : res.type === 'video' ? <Film size={16} /> : <FileIcon size={16} />;
                return (
                  <div key={res.id} className="flex items-center gap-4 py-3 hover:bg-surface-container rounded-xl px-3 -mx-3 transition-colors cursor-pointer">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>{iconEl}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">{res.title}</p>
                      <p className="text-xs text-on-surface-variant">{res.type.toUpperCase()} · {res.size || res.duration || (res.itemsCount ? `${res.itemsCount} items` : '')}</p>
                    </div>
                    <ArrowUpRight size={15} className="text-outline-variant flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const StudentCoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courses, students, currentUserEmail, contentPosts, resources, tutors } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'content'>('overview');

  const course = courses.find(c => c.id === id);
  const currentStudent = students.find(s => s.email === currentUserEmail);

  if (!course) return <Navigate to="/courses" replace />;

  const coursePosts = contentPosts.filter(cp =>
    cp.courseId === course.id &&
    (!cp.studentId || cp.studentId === currentStudent?.id) &&
    cp.status === 'published'
  );
  const courseResources = resources.filter(r => r.courseId === course.id);

  const tutorList = course.tutor ? course.tutor.split(',').map(t => t.trim()).filter(Boolean) : [];

  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { key: 'content' as const, label: 'Content', icon: BookOpen },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-5xl mx-auto">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6 font-semibold">
        <ChevronLeft size={18} /> Back to Dashboard
      </button>

      {/* Tab Bar */}
      <div className="flex gap-6 mb-10 border-b border-outline-variant/20">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all duration-200 border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Course Hero */}
      <div className="mb-10">
        <div className="flex items-start justify-between gap-6 flex-wrap mb-4">
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-black uppercase tracking-widest text-primary/60 mb-2 block">{course.level === 'Uni' ? 'University' : course.level}</span>
            <h1 className="text-4xl font-black text-on-surface mb-3 leading-tight">{course.title}</h1>
            {course.description && <p className="text-base text-on-surface-variant leading-relaxed max-w-xl">{course.description}</p>}
          </div>
          {tutorList.length > 0 && (
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className={`flex items-center ${tutorList.length > 1 ? '-space-x-3' : ''}`}>
                {tutorList.map((name, i) => (
                  <div key={i} title={name} className={`rounded-full bg-primary/10 text-primary flex items-center justify-center font-black border-2 border-surface ${tutorList.length > 1 ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-lg'}`} style={{ zIndex: tutorList.length - i }}>
                    {name[0].toUpperCase()}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{tutorList.length > 1 ? 'Tutors' : 'Tutor'}</p>
                <p className="text-sm font-bold text-on-surface">{tutorList.join(', ')}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <p className="text-lg font-black text-primary">{coursePosts.length}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Posts</p>
          </div>
        </div>
      </div>

      {/* ── OVERVIEW TAB ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {coursePosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
                  <Calendar size={28} className="text-outline-variant opacity-50" />
                </div>
                <p className="text-base font-bold text-on-surface mb-1">No posts yet</p>
                <p className="text-sm text-on-surface-variant">Check back soon — your tutor will post updates here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {coursePosts.map(post => (
                  <div key={post.id} className="bg-surface-container-low rounded-[28px] p-8 border border-outline-variant/30 shadow-sm space-y-5">
                    {/* Post header */}
                    {(() => {
                      const author = post.tutorEmail
                        ? tutors.find(t => t.email === post.tutorEmail)
                        : null;
                      const authorName = author?.name ?? (tutorList.length > 0 ? tutorList[0] : null);
                      return (
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {authorName && (
                              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm flex-shrink-0">
                                {authorName[0].toUpperCase()}
                              </div>
                            )}
                            {authorName && (
                              <p className="text-sm font-bold text-on-surface">{authorName}</p>
                            )}
                          </div>
                          <p className="text-sm text-on-surface-variant flex-shrink-0">
                            {(() => { try { return format(new Date(post.createdAt), 'MMM d, yyyy'); } catch { return post.createdAt; } })()}
                          </p>
                        </div>
                      );
                    })()}

                    {/* Title */}
                    <h3 className="text-3xl font-black text-on-surface leading-tight tracking-tight">{post.title}</h3>

                    {/* Body */}
                    {post.description && (
                      <p className="text-base text-on-surface-variant leading-relaxed">{post.description}</p>
                    )}

                    {/* Attached media */}
                    {post.items.length > 0 && (
                      <div className="space-y-4 pt-1">
                        {post.items.map((item, i) => (
                          <div key={i}>
                            {item.type === 'video' && toYouTubeEmbed(item.url ?? '') && (
                              <div className="rounded-2xl overflow-hidden aspect-video w-full">
                                <iframe
                                  src={toYouTubeEmbed(item.url!)!}
                                  className="w-full h-full"
                                  allowFullScreen
                                />
                              </div>
                            )}
                            {item.type === 'file' && (
                              <div className="flex items-center gap-3 px-4 py-3 bg-surface-container rounded-xl border border-outline-variant/20">
                                {fileIconForType(item.fileType ?? '')}
                                <span className="text-sm font-semibold text-on-surface truncate flex-1">{item.fileName}</span>
                              </div>
                            )}
                            {item.type === 'link' && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 bg-primary/8 border border-primary/20 rounded-xl hover:bg-primary/15 transition-colors group w-fit max-w-full"
                              >
                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                                  <ExternalLink size={14} className="text-on-primary" />
                                </div>
                                <span className="text-sm font-bold text-primary group-hover:underline truncate">{item.label ?? item.url}</span>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── CONTENT TAB ── */}
        {activeTab === 'content' && (
          <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12">
            {/* Course resources (files, videos, zips) */}
            {courseResources.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-on-surface mb-5">Files & Resources</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {courseResources.map(res => {
                    const iconBg = res.type === 'pdf' ? 'bg-red-100 text-red-500' : res.type === 'video' ? 'bg-blue-100 text-blue-500' : 'bg-orange-100 text-orange-500';
                    const iconEl = res.type === 'pdf' ? <FileText size={22} /> : res.type === 'video' ? <Film size={22} /> : <FileIcon size={22} />;
                    return (
                      <div key={res.id} className="p-4 flex flex-col items-center text-center hover:bg-surface-container rounded-2xl transition-colors cursor-pointer">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${iconBg}`}>{iconEl}</div>
                        <p className="text-sm font-bold text-on-surface leading-snug mb-1 line-clamp-2">{res.title}</p>
                        <p className="text-[11px] text-on-surface-variant">{res.size ?? res.duration ?? (res.itemsCount ? `${res.itemsCount} items` : res.type.toUpperCase())}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Videos from posts */}
            {(() => {
              const allVideos = coursePosts.flatMap(p => p.items.filter(it => it.type === 'video' && toYouTubeEmbed(it.url ?? '')));
              if (allVideos.length === 0) return null;
              return (
                <div>
                  <h2 className="text-xl font-black text-on-surface mb-5">Videos</h2>
                  <div className="space-y-6">
                    {allVideos.map((item, i) => (
                      <div key={i}>
                        {item.label && <p className="text-sm font-bold text-on-surface mb-2">{item.label}</p>}
                        <div className="rounded-2xl overflow-hidden aspect-video w-full">
                          <iframe src={toYouTubeEmbed(item.url!)!} className="w-full h-full" allowFullScreen />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Files from posts */}
            {(() => {
              const allFiles = coursePosts.flatMap(p => p.items.filter(it => it.type === 'file'));
              if (allFiles.length === 0) return null;
              return (
                <div>
                  <h2 className="text-xl font-black text-on-surface mb-5">Files</h2>
                  <div className="space-y-2">
                    {allFiles.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
                        {fileIconForType(item.fileType ?? '')}
                        <span className="text-sm font-semibold text-on-surface truncate flex-1">{item.fileName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Links from posts */}
            {(() => {
              const allLinks = coursePosts.flatMap(p => p.items.filter(it => it.type === 'link'));
              if (allLinks.length === 0) return null;
              return (
                <div>
                  <h2 className="text-xl font-black text-on-surface mb-5">Links</h2>
                  <div className="space-y-2">
                    {allLinks.map((item, i) => (
                      <a
                        key={i}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-primary/8 border border-primary/20 rounded-xl hover:bg-primary/15 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                          <ExternalLink size={14} className="text-on-primary" />
                        </div>
                        <span className="text-sm font-bold text-primary group-hover:underline truncate flex-1">{item.label ?? item.url}</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })()}

            {courseResources.length === 0 && coursePosts.every(p => p.items.length === 0) && (
              <p className="text-on-surface-variant italic py-8 text-center">No content published for this course yet.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PracticeQuestion = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="py-3 border-b border-outline-variant/10 last:border-0">
      <div className="flex items-start gap-3 mb-2">
        <span className="text-xs font-black text-on-surface-variant/40 w-5 flex-shrink-0 mt-0.5">{index}.</span>
        <p className="text-sm font-semibold text-on-surface flex-1 leading-relaxed">{question}</p>
      </div>
      {!revealed ? (
        <div className="pl-8">
          <button onClick={() => setRevealed(true)} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            <Eye size={12} /> Reveal Answer
          </button>
        </div>
      ) : (
        <div className="pl-8">
          <p className="text-sm text-on-surface-variant leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const TutorAnalytics = () => {
  const { sessions, students, courses, earnings, upsertEarning } = useData();
  const [showEarningModal, setShowEarningModal] = useState(false);
  const [earningForm, setEarningForm] = useState({
    month: MONTH_ABBR[new Date().getMonth()],
    year: new Date().getFullYear(),
    amount: '',
  });
  const [savingEarning, setSavingEarning] = useState(false);

  // Weekly hours derived from real sessions data (current week, Mon–Sun)
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weeklyHoursData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((name, i) => {
    const day = addDays(weekStart, i);
    const dateStr = format(day, 'yyyy-MM-dd');
    const mins = sessions
      .filter(s => s.date === dateStr)
      .reduce((acc, s) => acc + (s.duration || 0), 0);
    return { name, hours: Math.round((mins / 60) * 10) / 10 };
  });

  // Course popularity from real sessions
  const courseDistributionData = courses.map(c => ({
    name: c.title,
    value: sessions.filter(s => s.courseId === c.id).length,
  })).filter(c => c.value > 0).slice(0, 5);

  // Sessions completed per month (last 6 months)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), 5 - i);
    return { month: MONTH_ABBR[d.getMonth()], monthNum: d.getMonth(), year: d.getFullYear() };
  });
  const sessionsByMonthData = last6Months.map(({ month, monthNum, year }) => {
    const count = sessions.filter(s => {
      const d = new Date(s.date);
      return d.getMonth() === monthNum && d.getFullYear() === year && s.status === 'completed';
    }).length;
    return { month, sessions: count };
  });

  // Monthly earnings from Supabase (last 12 months)
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const d = subMonths(new Date(), 11 - i);
    return { month: MONTH_ABBR[d.getMonth()], year: d.getFullYear() };
  });
  const earningsChartData = last12Months.map(({ month, year }) => {
    const entry = earnings.find(e => e.month === month && e.year === year);
    return { month: `${month} '${String(year).slice(2)}`, amount: entry?.amount ?? 0 };
  });

  const totalHours = Math.round(sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60);
  const totalEarnings = earnings.reduce((acc, e) => acc + e.amount, 0);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

  const handleSaveEarning = async () => {
    const amount = parseFloat(earningForm.amount);
    if (isNaN(amount) || amount < 0) return;
    setSavingEarning(true);
    await upsertEarning({ month: earningForm.month, year: earningForm.year, amount });
    setSavingEarning(false);
    setShowEarningModal(false);
    setEarningForm(f => ({ ...f, amount: '' }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto pb-12"
    >
      <Header title="Tutor Analytics" />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Sessions', value: sessions.length, icon: Video, color: 'bg-blue-500/10 text-blue-500' },
          { label: 'Total Hours', value: `${totalHours}h`, icon: Clock, color: 'bg-purple-500/10 text-purple-500' },
          { label: 'Active Students', value: students.length, icon: Users, color: 'bg-pink-500/10 text-pink-500' },
          { label: 'Total Earnings', value: `$${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'bg-amber-500/10 text-amber-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-low p-6 rounded-[32px] border border-outline-variant/30 shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-on-surface">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Hours Chart */}
        <div className="bg-surface-container-low p-8 rounded-[40px] border border-outline-variant/30 shadow-sm">
          <h3 className="text-xl font-black text-on-surface mb-8">Weekly Tutoring Hours</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyHoursData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(v: number) => [`${v}h`, 'Hours']}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Distribution */}
        <div className="bg-surface-container-low p-8 rounded-[40px] border border-outline-variant/30 shadow-sm">
          <h3 className="text-xl font-black text-on-surface mb-8">Course Popularity</h3>
          {courseDistributionData.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-on-surface-variant gap-2">
              <BarChart3 size={40} className="opacity-30" />
              <p className="text-sm font-semibold">No session data yet</p>
              <p className="text-xs">Sessions linked to courses will appear here</p>
            </div>
          ) : (
            <div className="h-[300px] w-full flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {courseDistributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sessions Completed per Month */}
        <div className="bg-surface-container-low p-8 rounded-[40px] border border-outline-variant/30 shadow-sm">
          <h3 className="text-xl font-black text-on-surface mb-8">Sessions Completed (Last 6 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sessionsByMonthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb'
                  }}
                  formatter={(v: number) => [v, 'Sessions']}
                />
                <Line type="monotone" dataKey="sessions" stroke="#ec4899" strokeWidth={4} dot={{ r: 6, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Earnings */}
        <div className="bg-surface-container-low p-8 rounded-[40px] border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-on-surface">Monthly Earnings ($)</h3>
            <button
              onClick={() => setShowEarningModal(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
            >
              <DollarSign size={13} /> Log Earnings
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb'
                  }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, 'Earnings']}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Log Earnings Modal */}
      <AnimatePresence>
        {showEarningModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEarningModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-container-low rounded-[32px] p-8 w-full max-w-sm shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-black text-on-surface mb-6">Log Earnings</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 block">Month</label>
                    <select
                      value={earningForm.month}
                      onChange={e => setEarningForm(f => ({ ...f, month: e.target.value }))}
                      className="w-full bg-surface border border-outline-variant rounded-2xl px-4 py-2.5 text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {MONTH_ABBR.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 block">Year</label>
                    <select
                      value={earningForm.year}
                      onChange={e => setEarningForm(f => ({ ...f, year: Number(e.target.value) }))}
                      className="w-full bg-surface border border-outline-variant rounded-2xl px-4 py-2.5 text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {[new Date().getFullYear() - 1, new Date().getFullYear()].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 block">Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={earningForm.amount}
                    onChange={e => setEarningForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full bg-surface border border-outline-variant rounded-2xl px-4 py-2.5 text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEarningModal(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-outline-variant text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEarning}
                  disabled={savingEarning || !earningForm.amount}
                  className="flex-1 py-2.5 rounded-2xl bg-primary text-on-primary text-sm font-bold disabled:opacity-50 transition-colors"
                >
                  {savingEarning ? 'Saving…' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


const Schedule = () => {
  const { sessions, students, currentUserEmail } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const currentStudent = students.find(s => s.email === currentUserEmail);

  // Filter sessions relevant to this student
  const studentSessions = sessions.filter(s =>
    !s.studentId || !currentStudent || s.studentId === currentStudent.id
  );

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const leadingBlanks = monthStart.getDay(); // 0=Sun … 6=Sat

  const selectedDaySessions = studentSessions.filter(s => {
    try { return isSameDay(new Date(s.date), selectedDay); } catch { return false; }
  });

  const upcomingSessions = studentSessions
    .filter(s => s.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const displaySessions = selectedDaySessions.length > 0 ? selectedDaySessions : upcomingSessions;
  const displayLabel = selectedDaySessions.length > 0
    ? format(selectedDay, 'EEEE, MMMM d')
    : 'Upcoming Sessions';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-7xl mx-auto"
    >
      <Header title="Schedule" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-low rounded-[40px] p-7 border border-outline-variant/30 shadow-sm">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 rounded-xl hover:bg-surface-container-high text-on-surface-variant transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h4 className="text-base font-black text-on-surface">{format(currentDate, 'MMMM yyyy')}</h4>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 rounded-xl hover:bg-surface-container-high text-on-surface-variant transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <span key={d} className="text-center text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest pb-2">{d}</span>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-y-1">
              {/* Leading blanks */}
              {Array.from({ length: leadingBlanks }).map((_, i) => (
                <div key={`blank-${i}`} />
              ))}

              {calendarDays.map((day) => {
                const todayFlag = isToday(day);
                const isSelected = isSameDay(day, selectedDay);
                const hasSession = studentSessions.some(s => {
                  try { return isSameDay(new Date(s.date), day); } catch { return false; }
                });

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDay(day)}
                    className={`relative flex flex-col items-center justify-center aspect-square rounded-full text-sm font-bold transition-all mx-auto w-9 h-9 ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-md'
                        : todayFlag
                        ? 'bg-primary/15 text-primary font-black'
                        : 'text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {format(day, 'd')}
                    {hasSession && !isSelected && (
                      <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${todayFlag ? 'bg-primary' : 'bg-secondary'}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 flex items-center gap-4 text-[10px] text-on-surface-variant font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-secondary inline-block" /> Session</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> Today</span>
            </div>
          </div>
        </div>

        {/* Session list */}
        <div className="lg:col-span-2 space-y-5">
          <h4 className="text-xl font-bold text-on-surface">{displayLabel}</h4>

          {displaySessions.length === 0 ? (
            <div className="bg-surface-container-low rounded-[32px] border border-outline-variant/30 p-12 text-center">
              <Calendar size={36} className="mx-auto mb-3 text-outline-variant opacity-40" />
              <p className="text-sm text-on-surface-variant italic">No sessions on this day.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displaySessions.map((session) => {
                let sessionDate: Date | null = null;
                try { sessionDate = new Date(session.date); } catch {}
                return (
                  <div key={session.id} className={`p-6 rounded-[32px] border transition-all ${
                    session.status === 'upcoming'
                      ? 'bg-surface-container-lowest border-primary/20 shadow-sm hover:shadow-md'
                      : 'bg-surface-container-low border-outline-variant/30 opacity-70'
                  }`}>
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex flex-col items-center justify-center px-5 py-4 bg-surface-container-high rounded-2xl min-w-[90px] border border-outline-variant/10 text-center">
                        {sessionDate ? (
                          <>
                            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{format(sessionDate, 'MMM')}</span>
                            <span className="text-3xl font-black text-on-surface">{format(sessionDate, 'd')}</span>
                            <span className="text-[10px] font-semibold text-on-surface-variant">{format(sessionDate, 'EEE')}</span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-on-surface">{session.date}</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h5 className="text-xl font-black text-on-surface">{session.title}</h5>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                            session.modality === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {session.modality === 'online' ? <Globe size={12} /> : <MapPin size={12} />}
                            {session.modality}
                          </div>
                          {session.status === 'upcoming' && (
                            <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                              <Check size={12} /> Confirmed
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                          <div className="flex items-center gap-2 text-on-surface-variant">
                            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                              <User size={16} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Tutor</span>
                              <span className="font-bold text-on-surface">{session.tutor}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-on-surface-variant">
                            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                              <Clock size={16} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Time & Duration</span>
                              <span className="font-bold text-on-surface">{session.time} · {session.duration} min</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-on-surface-variant sm:col-span-2">
                            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                              <MapPin size={16} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Location</span>
                              <span className="font-bold text-on-surface">
                                {session.modality === 'online' ? 'Virtual Classroom' : (session.location || 'TBD')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Resources = () => {
  const { resources, role } = useData();
  const [activeTab, setActiveTab] = useState<'All' | 'Videos' | 'Documents'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resources.filter(res => {
    const matchesTab = activeTab === 'All' || 
      (activeTab === 'Videos' && res.type === 'video') || 
      (activeTab === 'Documents' && (res.type === 'pdf' || res.type === 'zip'));
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const videos = filteredResources.filter(r => r.type === 'video');
  const documents = filteredResources.filter(r => r.type === 'pdf' || r.type === 'zip');

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-7xl mx-auto"
    >
      <Header title="Resources" />

      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for videos, guides, or documents..." 
            className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30">
          {['All', 'Videos', 'Documents'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-primary text-on-primary shadow-md' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        {/* Video Library */}
        {(activeTab === 'All' || activeTab === 'Videos') && videos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-on-surface flex items-center gap-3">
                <Video size={28} className="text-primary" /> Video Library
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  whileHover={{ y: -5 }}
                  onClick={() => video.url && window.open(video.url, '_blank')}
                  className={`bg-surface-container-low rounded-[32px] border border-outline-variant/30 overflow-hidden group shadow-sm hover:shadow-xl transition-all ${video.url ? 'cursor-pointer' : ''}`}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${video.id}/640/360`} 
                      alt={video.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                        <Play size={24} fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-md">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-1">{video.title}</h4>
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">Educational Video • High Quality</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Documents */}
        {(activeTab === 'All' || activeTab === 'Documents') && documents.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-on-surface flex items-center gap-3">
                <FileText size={28} className="text-primary" /> Documents & Guides
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => doc.url && window.open(doc.url, '_blank')}
                  className={`bg-surface-container-low p-6 rounded-[32px] border border-outline-variant/30 flex flex-col items-center text-center group hover:border-primary/30 hover:shadow-lg transition-all ${doc.url ? 'cursor-pointer' : ''}`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                    doc.type === 'pdf' ? 'bg-red-50 text-red-600 group-hover:bg-red-100' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                  }`}>
                    {doc.type === 'pdf' ? <FileText size={32} /> : <PlusCircle size={32} className="rotate-45" />}
                  </div>
                  <h4 className="font-bold text-on-surface mb-1 group-hover:text-primary transition-colors line-clamp-2">{doc.title}</h4>
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mt-auto pt-4">
                    {doc.type.toUpperCase()} • {doc.size || `${doc.itemsCount} items`}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {filteredResources.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-on-surface">No resources found</h3>
            <p className="text-on-surface-variant">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TutorResources = () => {
  const { resources, courses, addResource, deleteResource, currentUserEmail, tutors } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'pdf' as 'pdf' | 'video' | 'zip', url: '', courseId: '' });
  const [saving, setSaving] = useState(false);

  const currentTutor = tutors.find(t => t.email === currentUserEmail);
  const currentTutorName = currentTutor?.name ?? '';
  const myCourses = courses.filter(c =>
    (c.tutor || '').split(',').map(s => s.trim()).includes(currentTutorName)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await addResource({
      title: form.title,
      type: form.type,
      url: form.url,
      courseId: form.courseId || undefined,
      icon: form.type === 'video' ? '🎥' : form.type === 'pdf' ? '📄' : '📦',
    });
    setSaving(false);
    setIsModalOpen(false);
    setForm({ title: '', type: 'pdf', url: '', courseId: '' });
  };

  const typeIcon = (type: string) => {
    if (type === 'video') return <Video size={18} className="text-blue-500" />;
    if (type === 'pdf') return <FileText size={18} className="text-red-500" />;
    return <FileIcon size={18} className="text-green-500" />;
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-5xl mx-auto">
      <Header title="Resources" />

      <div className="flex items-center justify-between mb-8">
        <p className="text-on-surface-variant text-sm">Share links and materials with your students.</p>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-2xl font-bold text-sm hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Add Resource
        </button>
      </div>

      {resources.length === 0 ? (
        <div className="py-24 text-center">
          <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
            <GraduationCap size={32} />
          </div>
          <h3 className="text-xl font-bold text-on-surface">No resources yet</h3>
          <p className="text-on-surface-variant mt-1">Add a link to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {resources.map(res => (
            <div key={res.id} className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${res.type === 'video' ? 'bg-blue-50' : res.type === 'pdf' ? 'bg-red-50' : 'bg-green-50'}`}>
                {typeIcon(res.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-on-surface truncate">{res.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{res.type}</span>
                  {res.courseId && <span className="text-xs text-on-surface-variant truncate">· {courses.find(c => c.id === res.courseId)?.title}</span>}
                  {res.url && <span className="text-xs text-primary/70 truncate">· {res.url}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {res.url && (
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant" title="Open link">
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  onClick={async () => {
                    if (!confirm(`Delete "${res.title}"?`)) return;
                    await deleteResource(res.id);
                  }}
                  className="p-2 rounded-xl hover:bg-red-50 transition-colors text-on-surface-variant hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="relative w-full max-w-md bg-surface-container-low rounded-[40px] border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-outline-variant/20 flex-shrink-0">
                <h2 className="text-xl font-black text-on-surface">Add Resource</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Title</label>
                  <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Algebra Cheat Sheet" className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface">
                    <option value="pdf">Document / PDF</option>
                    <option value="video">Video</option>
                    <option value="zip">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Link (URL)</label>
                  <input required type="url" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Course (optional)</label>
                  <select value={form.courseId} onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))} className="w-full px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface">
                    <option value="">— No course —</option>
                    {myCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <div className="pt-2 space-y-3">
                  <button type="submit" disabled={saving} className="w-full py-3.5 bg-primary text-on-primary font-bold rounded-2xl hover:bg-primary/90 disabled:opacity-50 transition-colors">
                    {saving ? 'Saving…' : 'Add Resource'}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-3 text-sm font-bold text-on-surface-variant hover:text-on-surface rounded-2xl transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Profile = () => {
  const { role } = useData();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <Header title="Profile" />
      
      <div className="bg-surface-container-low rounded-[40px] p-8 md:p-12 border border-outline-variant/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mateo" 
              alt="Profile" 
              className="w-40 h-40 rounded-[40px] bg-primary-container border-4 border-white shadow-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h3 className="text-4xl font-black tracking-tight text-on-surface">Mateo Builes</h3>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-widest border border-primary/20">Premium</span>
            </div>
            <p className="text-on-surface-variant text-lg mb-6">Undergraduate Student • University of Toronto</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="px-6 py-3 bg-surface-container-high rounded-2xl border border-outline-variant/20">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Hours</p>
                <p className="text-xl font-bold text-on-surface">128.5 hrs</p>
              </div>
              <div className="px-6 py-3 bg-surface-container-high rounded-2xl border border-outline-variant/20">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Courses</p>
                <p className="text-xl font-bold text-on-surface">14 Subjects</p>
              </div>
              <div className="px-6 py-3 bg-surface-container-high rounded-2xl border border-outline-variant/20">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">GPA Goal</p>
                <p className="text-xl font-bold text-primary">3.9 / 4.0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <CheckCircle2 size={24} className="text-primary" /> Learning Preferences
            </h4>
            <div className="space-y-3">
              {['Visual Learning', 'Active Recall', 'Spaced Repetition', 'Project-based'].map(pref => (
                <div key={pref} className="flex items-center gap-3 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-on-surface font-medium">{pref}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <Star size={24} className="text-secondary" /> Top Tutors
            </h4>
            <div className="space-y-3">
              {['Dr. Aris Thorne', 'Sarah Jenkins', 'Prof. H. Miller'].map(tutor => (
                <div key={tutor} className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 group hover:border-secondary/30 transition-colors cursor-pointer">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor}`} 
                    alt={tutor} 
                    className="w-10 h-10 rounded-full bg-secondary-container"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <p className="text-on-surface font-bold group-hover:text-secondary transition-colors">{tutor}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">5 Sessions Completed</p>
                  </div>
                  <ArrowRight size={18} className="text-outline-variant group-hover:text-secondary transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TutorDashboard = () => {
  const { courses, students, tutors, currentUserEmail, currentUserName, contentPosts } = useData();
  const navigate = useNavigate();

  const currentTutor = tutors.find((t: import('./types').Tutor) => t.email === currentUserEmail);
  const currentTutorName = currentUserName ?? currentTutor?.name ?? '';

  const myCourses = courses.filter(c =>
    (c.tutor || '').split(',').map(s => s.trim()).includes(currentTutorName)
  );

  const myStudents = students.filter(s =>
    currentTutor && (s.assignedTutorIds ?? []).includes(currentTutor.id)
  );

  const myPostsCount = contentPosts.filter(cp =>
    cp.tutorEmail === currentUserEmail && cp.status === 'published'
  ).length;

  const hasAnyAdmin = tutors.some(t => t.isAdmin);
  const isEffectiveAdmin = currentTutor?.isAdmin || !hasAnyAdmin;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const todayStr = format(new Date(), 'EEEE, MMMM d');

  const quickActions = [
    ...(isEffectiveAdmin ? [{ icon: Users, label: 'Add Student', description: 'Enroll or invite a new student', color: 'bg-blue-100 text-blue-600', path: '/students' }] : []),
    { icon: FilePlus, label: 'Create Post', description: 'Pick a student → their course → post', color: 'bg-green-100 text-green-600', path: '/students' },
    { icon: BarChart3, label: 'View Analytics', description: 'Track earnings and progress', color: 'bg-purple-100 text-purple-600', path: '/analytics' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <Header title="Tutor Dashboard" />

      {/* Welcome card */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-[32px] p-8 mb-6 border border-primary/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-on-surface mb-1">
              {greeting}{currentTutorName ? `, ${currentTutorName}` : ''}!
            </h2>
            <p className="text-sm text-on-surface-variant">{todayStr}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="bg-surface-container px-4 py-2 rounded-full text-sm font-bold text-on-surface">
            {myStudents.length} {myStudents.length === 1 ? 'Student' : 'Students'}
          </span>
          <span className="bg-surface-container px-4 py-2 rounded-full text-sm font-bold text-on-surface">
            {myCourses.length} {myCourses.length === 1 ? 'Course' : 'Courses'}
          </span>
          <span className="bg-surface-container px-4 py-2 rounded-full text-sm font-bold text-on-surface">
            {myPostsCount} {myPostsCount === 1 ? 'Post' : 'Posts'} Published
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => navigate(action.path)}
            className="bg-surface-container-low rounded-[28px] p-6 border border-outline-variant/30 cursor-pointer hover:bg-surface-container transition-colors flex items-center gap-4 text-left w-full"
          >
            <div className={`w-11 h-11 ${action.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <action.icon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-on-surface text-sm">{action.label}</p>
              <p className="text-xs text-on-surface-variant truncate">{action.description}</p>
            </div>
            <ChevronRight size={18} className="text-on-surface-variant flex-shrink-0" />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <div className="bg-surface-container-low rounded-[28px] p-6 border border-outline-variant/30">
          <h3 className="text-lg font-black text-on-surface mb-4">My Courses</h3>
          {myCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <BookOpen size={32} className="text-on-surface-variant/40 mb-2" />
              <p className="text-sm text-on-surface-variant">No courses assigned yet.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {myCourses.map(course => {
                const coursePosts = contentPosts.filter(cp => cp.courseId === course.id);
                const latestPost = coursePosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                const enrolledCount = students.filter(s => s.enrolledCourseIds.includes(course.id)).length;
                return (
                  <div key={course.id} className="flex items-center gap-3 py-3 border-b border-outline-variant/20 last:border-0">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <BookOpen size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-on-surface truncate">{course.title}</p>
                      <p className="text-xs text-on-surface-variant">
                        {latestPost ? `Last post ${format(new Date(latestPost.createdAt), 'MMM d')}` : 'No posts yet'}
                      </p>
                    </div>
                    <span className="text-xs bg-surface-container px-2.5 py-1 rounded-full font-semibold text-on-surface-variant flex-shrink-0">
                      {enrolledCount} {enrolledCount === 1 ? 'student' : 'students'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* My Students */}
        <div className="bg-surface-container-low rounded-[28px] p-6 border border-outline-variant/30">
          <h3 className="text-lg font-black text-on-surface mb-4">My Students</h3>
          {myStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Users size={32} className="text-on-surface-variant/40 mb-2" />
              <p className="text-sm text-on-surface-variant">No students assigned to you yet.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {myStudents.map(student => {
                const enrolledCourseTitles = student.enrolledCourseIds
                  .map(id => courses.find(c => c.id === id)?.title)
                  .filter(Boolean)
                  .join(', ');
                return (
                  <button
                    key={student.id}
                    onClick={() => navigate(`/students/${student.id}`)}
                    className="flex items-center gap-3 py-3 border-b border-outline-variant/20 last:border-0 w-full text-left hover:bg-surface-container rounded-xl px-2 -mx-2 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm flex-shrink-0">
                      {student.name[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-on-surface truncate">{student.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">{enrolledCourseTitles || 'No courses'}</p>
                    </div>
                    <span className="text-xs text-on-surface-variant flex-shrink-0">{formatLastActivity(student.lastActivity)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const getLevelLabel = (level: string) => {
  if (level === 'Elementary') return 'Elementary/Middle School';
  if (level === 'Uni') return 'College/University';
  return level;
};

// Parse a session date string in either "yyyy-MM-dd" or legacy "EEEE, MMM d" format
const parseSessionDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  try {
    // ISO format
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const d = new Date(dateStr + 'T12:00:00');
      return isNaN(d.getTime()) ? null : d;
    }
    // Legacy "Monday, Apr 7" or "Apr 7"
    const parts = dateStr.split(', ');
    const datePart = parts.length > 1 ? parts[1] : dateStr;
    const d = parse(`${datePart} ${new Date().getFullYear()}`, 'MMM d yyyy', new Date());
    return isNaN(d.getTime()) ? null : d;
  } catch { return null; }
};

const formatSessionDate = (dateStr: string) => {
  const d = parseSessionDate(dateStr);
  return d ? format(d, 'EEE, MMM d') : dateStr;
};

const TutorCourses = () => {
  const { courses, tutors, addCourse, updateCourse, deleteCourse } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<'All' | Course['level']>('All');
  const [filterTutor, setFilterTutor] = useState('All');
  const [isTutorDropdownOpen, setIsTutorDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'High School' as Course['level'],
    tutor: '',
    image: '',
    icon: 'book'
  });

  const selectedTutors = formData.tutor ? formData.tutor.split(',').map(s => s.trim()).filter(Boolean) : [];

  const toggleTutor = (name: string) => {
    const updated = selectedTutors.includes(name)
      ? selectedTutors.filter(t => t !== name)
      : [...selectedTutors, name];
    setFormData({ ...formData, tutor: updated.join(', ') });
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'All' || c.level === filterLevel;
    const matchesTutor = filterTutor === 'All' || (c.tutor || '').split(',').map(s => s.trim()).includes(filterTutor);
    return matchesSearch && matchesLevel && matchesTutor;
  });

  const handleOpenAddModal = () => {
    setEditingCourse(null);
    setFormData({ title: '', description: '', level: 'High School', tutor: '', image: '', icon: 'book' });
    setIsTutorDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      level: course.level,
      tutor: course.tutor || '',
      image: course.image || '',
      icon: course.icon || 'book'
    });
    setIsTutorDropdownOpen(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      await updateCourse(editingCourse.id, formData);
    } else {
      await addCourse(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id);
    }
  };

  const levelFilters: Array<'All' | Course['level']> = ['All', 'Elementary', 'High School', 'Uni'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Header title="Manage Courses" />

      {/* Search + Add */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input
            type="text"
            placeholder="Search your courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={handleOpenAddModal}
          className="w-full md:w-auto px-6 py-4 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
        >
          <PlusCircle size={20} /> Add New Course
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        {/* Level filter pills — scrollable on mobile */}
        <div className="overflow-x-auto pb-1 -mx-1 px-1">
          <div className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-1.5 w-max min-w-full sm:w-auto sm:min-w-0">
            {levelFilters.map(lv => (
              <button
                key={lv}
                onClick={() => setFilterLevel(lv)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterLevel === lv
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {lv === 'All' ? 'All Levels' : getLevelLabel(lv)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Tutor filter dropdown */}
          <select
            value={filterTutor}
            onChange={(e) => setFilterTutor(e.target.value)}
            className="px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-xs font-bold text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
          >
            <option value="All">All Tutors</option>
            {tutors.map(t => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>

          {(filterLevel !== 'All' || filterTutor !== 'All') && (
            <button
              onClick={() => { setFilterLevel('All'); setFilterTutor('All'); }}
              className="px-3 py-2 text-xs font-bold text-on-surface-variant hover:text-primary rounded-xl transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-on-surface-variant">
            <Search size={48} className="opacity-20" />
            <p className="font-bold">No courses found matching your search.</p>
          </div>
        ) : filteredCourses.map((course) => (
          <button
            key={course.id}
            onClick={() => handleOpenEditModal(course)}
            className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-5 flex items-center gap-4 text-left w-full active:scale-[0.98] transition-transform"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <BookOpen size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-on-surface leading-tight truncate">{course.title}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-2.5 py-1 bg-surface-container-highest text-[10px] font-bold rounded-full text-on-surface-variant uppercase tracking-widest whitespace-nowrap">
                  {course.level === 'Elementary' ? 'Elem/Middle' : course.level === 'Uni' ? 'College/Uni' : course.level}
                </span>
                <span className="text-xs text-on-surface-variant truncate">{course.tutor || 'Unassigned'}</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-on-surface-variant flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-surface-container-low rounded-[40px] border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-high">
              <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Course</th>
              <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Level</th>
              <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Tutor(s)</th>
              <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {filteredCourses.map((course) => (
              <tr
                key={course.id}
                className="hover:bg-surface-container-lowest transition-colors"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{course.title}</p>
                      <p className="text-xs text-on-surface-variant line-clamp-1 max-w-xs">{course.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold rounded-full text-on-surface-variant uppercase tracking-widest">
                    {getLevelLabel(course.level)}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm text-on-surface-variant">
                  {course.tutor || 'Unassigned'}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditModal(course)}
                      className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 text-on-surface-variant">
                    <Search size={48} className="opacity-20" />
                    <p className="font-bold">No courses found matching your search.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-container-low rounded-3xl sm:rounded-[40px] border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-5 py-4 sm:p-8 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-high">
                <h3 className="text-xl sm:text-2xl font-black text-on-surface">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-surface-container-highest transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-5 overflow-y-auto flex-1">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Course Name</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Advanced Calculus"
                    className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Educational Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({...formData, level: e.target.value as Course['level']})}
                      className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                    >
                      <option value="Elementary">Elementary/Middle School</option>
                      <option value="High School">High School</option>
                      <option value="Uni">College/University</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Tutor(s)</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsTutorDropdownOpen(!isTutorDropdownOpen)}
                        className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-left flex items-center justify-between"
                      >
                        <span className={`text-sm truncate ${selectedTutors.length === 0 ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                          {selectedTutors.length > 0 ? selectedTutors.join(', ') : 'Select tutor(s)...'}
                        </span>
                        <ChevronDown size={16} className={`flex-shrink-0 ml-2 transition-transform ${isTutorDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isTutorDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl z-20 overflow-hidden max-h-48 overflow-y-auto">
                          {tutors.length === 0 ? (
                            <p className="px-5 py-3 text-sm text-on-surface-variant">No tutors available</p>
                          ) : tutors.map((t: import('./types').Tutor) => (
                            <label key={t.id} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedTutors.includes(t.name)}
                                onChange={() => toggleTutor(t.name)}
                                className="w-4 h-4 rounded accent-primary"
                              />
                              <span className="text-sm text-on-surface">{t.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe what students will learn in this course..."
                    className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 bg-surface-container-highest text-on-surface rounded-2xl font-bold hover:bg-surface-container-highest/80 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                    >
                      {editingCourse ? 'Save Changes' : 'Create Course'}
                    </button>
                  </div>
                  {editingCourse && (
                    <button
                      type="button"
                      onClick={() => { setIsModalOpen(false); handleDelete(editingCourse.id); }}
                      className="w-full py-3 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      Delete Course
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, courses, tutors, currentUserEmail, updateStudent, contentPosts, addContentPost, updateContentPost, deleteContentPost } = useData();

  const student = students.find(s => s.id === id);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Add course modal state
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [addCourseSelected, setAddCourseSelected] = useState<string | null>(null);
  const [addCourseTutorIds, setAddCourseTutorIds] = useState<string[]>([]);

  // Content post editor state
  const [postEditorOpen, setPostEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ContentPost | null>(null);
  const [postForm, setPostForm] = useState<{ title: string; description: string; items: ContentItem[] }>({ title: '', description: '', items: [] });
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [linkUrlInput, setLinkUrlInput] = useState('');
  const [linkLabelInput, setLinkLabelInput] = useState('');

  if (!student) return <Navigate to="/students" replace />;

  const toggleTutor = (tutorId: string) => {
    const current = student.assignedTutorIds ?? [];
    const isAssigned = current.includes(tutorId);
    updateStudent(student.id, {
      assignedTutorIds: isAssigned ? current.filter(tid => tid !== tutorId) : [...current, tutorId],
    });
  };

  const enrollStudent = (courseId: string) => {
    if (student.enrolledCourseIds.includes(courseId)) return;
    updateStudent(student.id, { enrolledCourseIds: [...student.enrolledCourseIds, courseId] });
  };

  const unenrollStudent = (courseId: string) => {
    updateStudent(student.id, { enrolledCourseIds: student.enrolledCourseIds.filter(cid => cid !== courseId) });
    if (selectedCourseId === courseId) setSelectedCourseId(null);
  };

  const openNewPost = () => {
    setEditingPost(null);
    setPostForm({ title: '', description: '', items: [] });
    setVideoUrlInput('');
    setLinkUrlInput('');
    setLinkLabelInput('');
    setPostEditorOpen(true);
  };

  const openEditPost = (post: ContentPost) => {
    setEditingPost(post);
    setPostForm({ title: post.title, description: post.description, items: [...post.items] });
    setVideoUrlInput('');
    setLinkUrlInput('');
    setLinkLabelInput('');
    setPostEditorOpen(true);
  };

  const closeEditor = () => { setPostEditorOpen(false); setEditingPost(null); };

  const handleSavePost = async (status: 'draft' | 'published') => {
    if (!postForm.title.trim()) return;
    const payload = { title: postForm.title, description: postForm.description, items: postForm.items, status, courseId: selectedCourseId ?? undefined, studentId: student.id, tutorEmail: currentUserEmail ?? undefined };
    if (editingPost) {
      await updateContentPost(editingPost.id, payload);
    } else {
      await addContentPost(payload);
    }
    closeEditor();
  };

  const addVideoItem = () => {
    const embedUrl = toYouTubeEmbed(videoUrlInput);
    if (!embedUrl) return;
    setPostForm(p => ({ ...p, items: [...p.items, { type: 'video' as const, url: videoUrlInput }] }));
    setVideoUrlInput('');
  };

  const addFileItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPostForm(p => ({ ...p, items: [...p.items, { type: 'file' as const, fileName: file.name, fileType: file.type }] }));
    e.target.value = '';
  };

  const addLinkItem = () => {
    if (!linkUrlInput.trim()) return;
    setPostForm(p => ({ ...p, items: [...p.items, { type: 'link' as const, url: linkUrlInput, label: linkLabelInput || linkUrlInput }] }));
    setLinkUrlInput('');
    setLinkLabelInput('');
  };

  const removeItem = (index: number) => {
    setPostForm(p => ({ ...p, items: p.items.filter((_, i) => i !== index) }));
  };

  const handleAddCourseConfirm = () => {
    if (!addCourseSelected) return;
    enrollStudent(addCourseSelected);
    addCourseTutorIds.forEach(tid => {
      if (!(student.assignedTutorIds ?? []).includes(tid)) toggleTutor(tid);
    });
    setShowAddCourseModal(false);
    setSelectedCourseId(addCourseSelected);
    setAddCourseSelected(null);
    setAddCourseTutorIds([]);
  };

  const enrolledCourses = courses.filter(c => student.enrolledCourseIds.includes(c.id));
  const unenrolledCourses = courses.filter(c => !student.enrolledCourseIds.includes(c.id));

  // ── LEVEL 2: Course detail view ──
  if (selectedCourseId) {
    const selectedCourse = courses.find(c => c.id === selectedCourseId);
    const courseTutorNames = (selectedCourse?.tutor || '').split(',').map(s => s.trim()).filter(Boolean);
    const eligibleTutors = tutors.filter((t: Tutor) => courseTutorNames.includes(t.name));
    const studentPosts = contentPosts
      .filter(cp => cp.courseId === selectedCourseId && cp.studentId === student.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const publishedPostsCount = studentPosts.filter(p => p.status === 'published').length;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
        {/* Back to student */}
        <button
          onClick={() => setSelectedCourseId(null)}
          className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6 font-semibold"
        >
          <ChevronLeft size={18} /> Back to {student.name}
        </button>

        {/* Course header */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-[32px] p-8 mb-8 border border-primary/10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{student.name}</p>
          <h2 className="text-2xl font-black text-on-surface mb-4">{selectedCourse?.title ?? 'Course'}</h2>
          <div className="flex flex-wrap gap-3">
            <span className="bg-surface-container px-4 py-2 rounded-full text-sm font-bold text-on-surface">
              {publishedPostsCount} {publishedPostsCount === 1 ? 'Post' : 'Posts'} Published
            </span>
            <span className="bg-surface-container px-4 py-2 rounded-full text-sm font-bold text-on-surface">
              {studentPosts.filter(p => p.status === 'draft').length} Drafts
            </span>
          </div>
        </div>

        {/* Assigned Tutors for this course */}
        {eligibleTutors.length > 0 && (
          <section className="mb-8">
            <h3 className="text-lg font-black text-on-surface mb-4">Tutors</h3>
            <div className="space-y-2">
              {eligibleTutors.map((t: Tutor) => {
                const isAssigned = (student.assignedTutorIds ?? []).includes(t.id);
                return (
                  <div key={t.id} className="flex items-center justify-between px-4 py-3 rounded-2xl border border-outline-variant/20 bg-surface-container-low">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm flex-shrink-0">
                        {t.name[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-on-surface truncate">{t.name}</p>
                        <p className="text-[11px] text-on-surface-variant truncate">{t.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleTutor(t.id)}
                      className={`ml-4 flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                        isAssigned
                          ? 'bg-primary border-primary text-on-primary'
                          : 'bg-transparent border-outline-variant/40 text-on-surface-variant hover:border-primary hover:text-primary'
                      }`}
                    >
                      {isAssigned ? 'Assigned' : 'Assign'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Posts feed */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-on-surface">Posts</h3>
            <button
              onClick={openNewPost}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-2xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
            >
              <PlusCircle size={16} /> New Post
            </button>
          </div>

          {studentPosts.length === 0 ? (
            <button
              onClick={openNewPost}
              className="w-full flex flex-col items-center justify-center gap-3 py-16 rounded-3xl border-2 border-dashed border-outline-variant/40 hover:border-primary hover:bg-primary/5 transition-all text-on-surface-variant hover:text-primary"
            >
              <PlusCircle size={32} />
              <span className="text-sm font-bold">Create the first post for this course</span>
            </button>
          ) : (
            <div className="space-y-4">
              {studentPosts.map(post => (
                <div key={post.id} className="bg-surface-container-low rounded-[28px] p-8 border border-outline-variant/30 shadow-sm space-y-4 relative group">
                  {/* Post actions overlay */}
                  <div className="absolute top-5 right-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${post.status === 'published' ? 'bg-green-500/15 text-green-600' : 'bg-on-surface/10 text-on-surface-variant'}`}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <button
                      onClick={() => openEditPost(post)}
                      className="p-2 rounded-xl bg-surface-container hover:bg-primary/10 hover:text-primary transition-colors"
                      title="Edit post"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this post?')) deleteContentPost(post.id); }}
                      className="p-2 rounded-xl bg-surface-container hover:bg-red-500/10 hover:text-red-500 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Author + date */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm flex-shrink-0">
                      {(tutors.find((t: Tutor) => t.email === post.tutorEmail)?.name?.[0] ?? '?').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface">
                        {tutors.find((t: Tutor) => t.email === post.tutorEmail)?.name ?? 'Tutor'}
                      </p>
                    </div>
                    <p className="text-xs text-on-surface-variant flex-shrink-0 pr-24">
                      {(() => { try { return format(new Date(post.createdAt), 'MMM d, yyyy'); } catch { return post.createdAt; } })()}
                    </p>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-on-surface leading-tight">{post.title}</h3>

                  {/* Body */}
                  {post.description && (
                    <p className="text-base text-on-surface-variant leading-relaxed">{post.description}</p>
                  )}

                  {/* Media items */}
                  {post.items.length > 0 && (
                    <div className="space-y-3 pt-1">
                      {post.items.map((item, i) => (
                        <div key={i}>
                          {item.type === 'video' && toYouTubeEmbed(item.url ?? '') && (
                            <div className="rounded-2xl overflow-hidden aspect-video w-full">
                              <iframe src={toYouTubeEmbed(item.url!)!} className="w-full h-full" allowFullScreen />
                            </div>
                          )}
                          {item.type === 'file' && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-surface-container rounded-xl border border-outline-variant/20">
                              {fileIconForType(item.fileType ?? '')}
                              <span className="text-sm font-semibold text-on-surface truncate flex-1">{item.fileName}</span>
                            </div>
                          )}
                          {item.type === 'link' && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-3 bg-primary/8 border border-primary/20 rounded-xl hover:bg-primary/15 transition-colors group/link w-fit max-w-full"
                            >
                              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                                <ExternalLink size={13} className="text-on-primary" />
                              </div>
                              <span className="text-sm font-bold text-primary group-hover/link:underline truncate">{item.label ?? item.url}</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Post Editor Modal */}
        <AnimatePresence>
          {postEditorOpen && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={closeEditor} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                onClick={e => e.stopPropagation()}
                className="relative w-full max-w-4xl max-h-[92vh] bg-surface-container-low rounded-t-[40px] sm:rounded-[40px] border border-outline-variant/30 shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="px-7 py-5 border-b border-outline-variant/20 flex items-center justify-between flex-shrink-0">
                  <h3 className="text-lg font-black text-on-surface">{editingPost ? 'Edit Post' : 'New Post'}</h3>
                  <button onClick={closeEditor} className="p-2 rounded-xl hover:bg-surface-container-high transition-colors"><X size={20} /></button>
                </div>
                <div className="flex flex-1 overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-7 space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Title</label>
                      <input value={postForm.title} onChange={e => setPostForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Introduction to Calculus"
                        className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Description</label>
                      <textarea value={postForm.description} rows={3} onChange={e => setPostForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="Brief description of this content..."
                        className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none" />
                    </div>
                    <div className="space-y-3 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <Youtube size={16} className="text-red-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Add YouTube Video</span>
                      </div>
                      <div className="flex gap-2">
                        <input value={videoUrlInput} onChange={e => setVideoUrlInput(e.target.value)} placeholder="https://youtube.com/watch?v=..."
                          className="flex-1 px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        <button type="button" onClick={addVideoItem} disabled={!toYouTubeEmbed(videoUrlInput)}
                          className="px-4 py-3 bg-primary text-on-primary rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-primary/90 transition-colors">Add</button>
                      </div>
                      {toYouTubeEmbed(videoUrlInput) && (
                        <iframe src={toYouTubeEmbed(videoUrlInput)!} width="240" height="135"
                          className="rounded-xl border border-outline-variant/20"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      )}
                    </div>
                    <div className="space-y-3 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <Upload size={16} className="text-secondary" />
                        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Attach File</span>
                      </div>
                      <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-outline-variant/30 rounded-xl cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-all">
                        <Upload size={16} className="text-secondary" />
                        <span className="text-sm text-on-surface-variant">Choose file (PDF, Word, Excel, image…)</span>
                        <input type="file" className="hidden" onChange={addFileItem} />
                      </label>
                    </div>
                    <div className="space-y-3 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <ExternalLink size={16} className="text-tertiary" />
                        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Add Link</span>
                      </div>
                      <input value={linkUrlInput} onChange={e => setLinkUrlInput(e.target.value)} placeholder="https://..."
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      <input value={linkLabelInput} onChange={e => setLinkLabelInput(e.target.value)} placeholder="Display label (optional)"
                        className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      <button type="button" onClick={addLinkItem} disabled={!linkUrlInput.trim()}
                        className="px-5 py-2.5 bg-tertiary text-on-tertiary rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-tertiary/90 transition-colors">Add Link</button>
                    </div>
                    {postForm.items.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Added Items</p>
                        {postForm.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between px-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/15">
                            <div className="flex items-center gap-3 min-w-0">
                              {item.type === 'video' && <Youtube size={14} className="text-red-500 flex-shrink-0" />}
                              {item.type === 'file' && fileIconForType(item.fileType ?? '')}
                              {item.type === 'link' && <ExternalLink size={14} className="text-tertiary flex-shrink-0" />}
                              <span className="text-sm truncate text-on-surface">{item.type === 'file' ? item.fileName : item.label ?? item.url}</span>
                            </div>
                            <button onClick={() => removeItem(i)} className="ml-3 flex-shrink-0 text-on-surface-variant hover:text-red-500 transition-colors"><X size={14} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:flex flex-col w-80 flex-shrink-0 border-l border-outline-variant/20 overflow-y-auto p-7 space-y-4 bg-surface-container-lowest">
                    <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Student Preview</p>
                    <h4 className="text-base font-black text-on-surface">{postForm.title || 'Untitled'}</h4>
                    {postForm.description && <p className="text-sm text-on-surface-variant leading-relaxed">{postForm.description}</p>}
                    {postForm.items.map((item, i) => (
                      <div key={i}>
                        {item.type === 'video' && toYouTubeEmbed(item.url ?? '') && (
                          <iframe src={toYouTubeEmbed(item.url!)!} width="100%" height="135" className="rounded-xl border border-outline-variant/20" allowFullScreen />
                        )}
                        {item.type === 'file' && (
                          <div className="flex items-center gap-3 px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/15">
                            {fileIconForType(item.fileType ?? '')}
                            <span className="text-sm font-medium text-on-surface truncate">{item.fileName}</span>
                          </div>
                        )}
                        {item.type === 'link' && (
                          <div className="flex items-center gap-2 px-4 py-3 bg-tertiary/5 rounded-xl border border-tertiary/20">
                            <ExternalLink size={14} className="text-tertiary flex-shrink-0" />
                            <span className="text-sm text-tertiary font-medium truncate">{item.label ?? item.url}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {postForm.items.length === 0 && <p className="text-xs text-on-surface-variant/50 italic">Add items on the left to see a preview.</p>}
                  </div>
                </div>
                <div className="flex gap-3 px-7 py-5 border-t border-outline-variant/20 flex-shrink-0">
                  <button type="button" onClick={closeEditor}
                    className="px-6 py-3 rounded-2xl border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors">Cancel</button>
                  <button type="button" onClick={() => handleSavePost('draft')} disabled={!postForm.title.trim()}
                    className="px-6 py-3 rounded-2xl border-2 border-primary text-primary font-bold text-sm disabled:opacity-40 hover:bg-primary/5 transition-colors">Save Draft</button>
                  <button type="button" onClick={() => handleSavePost('published')} disabled={!postForm.title.trim()}
                    className="flex-1 py-3 rounded-2xl bg-primary text-on-primary font-bold text-sm disabled:opacity-40 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">Publish</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ── LEVEL 1: Student overview ──
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <button onClick={() => navigate('/students')} className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6 font-semibold">
        <ChevronLeft size={18} /> Back to Students
      </button>

      <Header title={student.name} subtitle={student.email} />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Enrolled Courses', value: enrolledCourses.length },
          { label: 'Posts Published', value: contentPosts.filter(cp => cp.studentId === student.id && cp.status === 'published').length },
          { label: 'Drafts', value: contentPosts.filter(cp => cp.studentId === student.id && cp.status === 'draft').length },
        ].map(stat => (
          <div key={stat.label} className="bg-surface-container-low rounded-3xl p-5 border border-outline-variant/30">
            <p className="text-2xl font-black text-on-surface">{stat.value}</p>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Enrolled courses */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-on-surface">Enrolled Courses</h3>
          <button
            onClick={() => { setAddCourseSelected(null); setAddCourseTutorIds([]); setShowAddCourseModal(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-2xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
          >
            <PlusCircle size={16} /> Add Course
          </button>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-outline-variant/30 rounded-3xl">
            <BookOpen size={32} className="text-on-surface-variant/40 mb-3" />
            <p className="text-sm font-bold text-on-surface-variant mb-1">No courses yet</p>
            <p className="text-xs text-on-surface-variant/70">Click "Add Course" to enroll {student.name} in a course.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {enrolledCourses.map(course => {
              const courseTutorNames = (course.tutor || '').split(',').map(s => s.trim()).filter(Boolean);
              const postCount = contentPosts.filter(cp => cp.courseId === course.id && cp.studentId === student.id && cp.status === 'published').length;
              return (
                <div
                  key={course.id}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-outline-variant/20 bg-surface-container-low hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group"
                  onClick={() => setSelectedCourseId(course.id)}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-on-surface text-sm">{course.title}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {courseTutorNames.length > 0 ? courseTutorNames.join(', ') : 'No tutors assigned'}
                      {' · '}{postCount} {postCount === 1 ? 'post' : 'posts'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                    <button
                      onClick={e => { e.stopPropagation(); unenrollStudent(course.id); }}
                      className="p-2 rounded-xl text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove enrollment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Add Course Modal */}
      <AnimatePresence>
        {showAddCourseModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddCourseModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[85vh] bg-surface-container-low rounded-t-[40px] sm:rounded-[40px] border border-outline-variant/30 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="px-7 py-5 border-b border-outline-variant/20 flex items-center justify-between flex-shrink-0">
                <h3 className="text-lg font-black text-on-surface">Add Course</h3>
                <button onClick={() => setShowAddCourseModal(false)} className="p-2 rounded-xl hover:bg-surface-container-high transition-colors"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-7 space-y-6">
                {/* Course picker */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Select a Course</p>
                  {unenrolledCourses.length === 0 ? (
                    <p className="text-sm text-on-surface-variant py-4 text-center">No additional courses available.</p>
                  ) : (
                    <div className="space-y-2">
                      {unenrolledCourses.map(course => (
                        <button
                          key={course.id}
                          onClick={() => { setAddCourseSelected(course.id); setAddCourseTutorIds([]); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all ${
                            addCourseSelected === course.id
                              ? 'border-primary bg-primary/8'
                              : 'border-outline-variant/20 bg-surface-container-low hover:border-primary/40'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${addCourseSelected === course.id ? 'bg-primary text-on-primary' : 'bg-primary/10 text-primary'}`}>
                            <BookOpen size={15} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-on-surface truncate">{course.title}</p>
                            <p className="text-[11px] text-on-surface-variant">{getLevelLabel(course.level)}</p>
                          </div>
                          {addCourseSelected === course.id && <Check size={16} className="text-primary flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tutor assignment for selected course */}
                {addCourseSelected && (() => {
                  const selectedCourse = courses.find(c => c.id === addCourseSelected);
                  const eligibleNames = (selectedCourse?.tutor || '').split(',').map(s => s.trim()).filter(Boolean);
                  const eligibleTutorsForCourse = tutors.filter((t: Tutor) => eligibleNames.includes(t.name));
                  if (eligibleTutorsForCourse.length === 0) return null;
                  return (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Assign Tutors</p>
                      <div className="space-y-2">
                        {eligibleTutorsForCourse.map((t: Tutor) => {
                          const isSelected = addCourseTutorIds.includes(t.id);
                          return (
                            <button
                              key={t.id}
                              onClick={() => setAddCourseTutorIds(prev => isSelected ? prev.filter(tid => tid !== t.id) : [...prev, t.id])}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all ${
                                isSelected ? 'border-primary bg-primary/8' : 'border-outline-variant/20 hover:border-primary/40'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${isSelected ? 'bg-primary text-on-primary' : 'bg-primary/10 text-primary'}`}>
                                {t.name[0]?.toUpperCase() ?? '?'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-on-surface truncate">{t.name}</p>
                                <p className="text-[11px] text-on-surface-variant truncate">{t.email}</p>
                              </div>
                              {isSelected && <Check size={16} className="text-primary flex-shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex gap-3 px-7 py-5 border-t border-outline-variant/20 flex-shrink-0">
                <button onClick={() => setShowAddCourseModal(false)}
                  className="px-6 py-3 rounded-2xl border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors">
                  Cancel
                </button>
                <button onClick={handleAddCourseConfirm} disabled={!addCourseSelected}
                  className="flex-1 py-3 rounded-2xl bg-primary text-on-primary font-bold text-sm disabled:opacity-40 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                  Enroll & Open Course
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TutorStudents = () => {
  const { students, courses, tutors, deleteStudent, currentUserEmail } = useData();
  const navigate = useNavigate();
  const currentTutor = tutors.find(t => t.email === currentUserEmail);
  const hasAnyAdmin = tutors.some(t => t.isAdmin);
  const isEffectiveAdmin = currentTutor?.isAdmin || !hasAnyAdmin;
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', phone: '' });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [inviteTab, setInviteTab] = useState<'email' | 'sms' | 'link'>('email');
  const [linkCopied, setLinkCopied] = useState(false);
  const [smsMsgCopied, setSmsMsgCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteTab === 'link') {
      setInviteLoading(true);
      const token = await supabaseService.createInviteToken('student');
      setInviteLoading(false);
      if (token) {
        const link = `${window.location.origin}${window.location.pathname}?invite=${token}`;
        navigator.clipboard.writeText(link);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000);
      }
      return;
    }
    if (inviteTab === 'sms') {
      const appUrl = window.location.origin;
      const msg = `Hi ${newStudent.name}! You've been invited to join our tutoring platform. Visit ${appUrl} to sign up and get started.`;
      if (newStudent.phone) {
        window.open(`sms:${newStudent.phone.replace(/\s/g, '')}?body=${encodeURIComponent(msg)}`);
      } else {
        await navigator.clipboard.writeText(msg);
        setSmsMsgCopied(true);
        setTimeout(() => setSmsMsgCopied(false), 2000);
      }
      return;
    }
    setInviteLoading(true);
    setInviteStatus('idle');
    const result = await supabaseService.inviteStudent(newStudent.name, newStudent.email);
    setInviteLoading(false);
    if (result) {
      setInviteStatus('success');
      setTimeout(() => {
        setNewStudent({ name: '', email: '', phone: '' });
        setShowAddStudent(false);
        setInviteStatus('idle');
      }, 1500);
    } else {
      setInviteStatus('error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <Header title="Students" />

      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {isEffectiveAdmin && (
          <button
            onClick={() => setShowAddStudent(true)}
            className="w-full md:w-auto px-6 py-4 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <PlusCircle size={20} /> Add Student
          </button>
        )}
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showAddStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddStudent(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface-container-low rounded-[40px] border border-outline-variant/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-outline-variant/20 bg-surface-container-high flex-shrink-0">
                <h3 className="text-2xl font-black text-on-surface mb-1">Invite Student</h3>
                <p className="text-sm text-on-surface-variant">Send an invite via email, SMS, or share the link.</p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-outline-variant/20 flex-shrink-0">
                {([
                  { id: 'email', label: 'Email', icon: Mail },
                  { id: 'sms', label: 'SMS', icon: Phone },
                  { id: 'link', label: 'Copy Link', icon: Link2 },
                ] as const).map(tab => (
                  <button key={tab.id} onClick={() => setInviteTab(tab.id)}
                    className={`flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${inviteTab === tab.id ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-on-surface-variant hover:text-on-surface'}`}>
                    <tab.icon size={15} /> {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAddStudent} className="p-8 space-y-5 overflow-y-auto flex-1">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                  <input type="text" required value={newStudent.name}
                    onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="e.g. Alice Johnson"
                    className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                </div>

                {inviteTab === 'email' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
                    <input type="email" required value={newStudent.email}
                      onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                      placeholder="alice@email.com"
                      className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                  </div>
                )}

                {inviteTab === 'sms' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Phone Number <span className="normal-case font-normal">(optional)</span></label>
                      <input type="tel" value={newStudent.phone}
                        onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Message Preview</label>
                      <div className="w-full px-4 py-3 bg-surface-container-high rounded-2xl text-sm text-on-surface-variant leading-relaxed">
                        Hi <strong>{newStudent.name || '[Student Name]'}</strong>! You've been invited to join our tutoring platform. Visit <span className="text-primary font-medium">{window.location.origin}</span> to sign up and get started.
                      </div>
                      <button type="button" onClick={async () => {
                        const msg = `Hi ${newStudent.name || '[Student Name]'}! You've been invited to join our tutoring platform. Visit ${window.location.origin} to sign up and get started.`;
                        await navigator.clipboard.writeText(msg);
                        setSmsMsgCopied(true);
                        setTimeout(() => setSmsMsgCopied(false), 2000);
                      }} className="flex items-center gap-1.5 text-xs font-bold text-primary mt-1 ml-1">
                        {smsMsgCopied ? <><Check size={12} /> Copied!</> : <><Link2 size={12} /> Copy message</>}
                      </button>
                    </div>
                    <p className="text-xs text-on-surface-variant ml-1">
                      {newStudent.phone ? 'Click "Open SMS App" to send on mobile.' : 'Enter a phone number to open your SMS app, or copy the message to send manually.'}
                    </p>
                  </div>
                )}

                {inviteTab === 'link' && (
                  <div className="bg-surface-container-high rounded-2xl p-4 space-y-1.5">
                    <p className="text-sm font-semibold text-on-surface">Generate a secure invite link</p>
                    <p className="text-xs text-on-surface-variant">The link expires in <strong>24 hours</strong> and can only be used <strong>once</strong>. Send it however you like — text, WhatsApp, email, etc.</p>
                  </div>
                )}

                {inviteStatus === 'success' && (
                  <p className="text-sm text-green-600 bg-green-50 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Invite sent!
                  </p>
                )}
                {inviteStatus === 'error' && (
                  <p className="text-sm text-red-500 bg-red-50 rounded-2xl px-4 py-3">
                    Failed to send invite. The email may already have an account, or the service role key is missing from .env.local.
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddStudent(false)}
                    className="flex-1 py-4 bg-surface-container-high text-on-surface font-bold rounded-2xl hover:bg-surface-container-highest transition-all text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={inviteLoading || inviteStatus === 'success'}
                    className="flex-1 py-4 bg-primary text-on-primary font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-sm">
                    {inviteLoading
                      ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : inviteTab === 'email' ? <><Mail size={16} /> Send Email</>
                      : inviteTab === 'sms' ? (newStudent.phone ? <><Phone size={16} /> Open SMS App</> : <><Link2 size={16} /> {smsMsgCopied ? 'Copied!' : 'Copy Message'}</>)
                      : linkCopied ? <><Check size={16} /> Copied!</>
                      : <><Link2 size={16} /> Copy Link</>
                    }
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-on-surface-variant">
            <Users size={48} className="opacity-20" />
            <p className="font-bold">No students found.</p>
          </div>
        ) : filtered.map(student => {
          const enrolledCount = student.enrolledCourseIds.filter(id => courses.find(c => c.id === id)).length;
          const assignedTutorNames = Array.from(new Set([
            ...student.enrolledCourseIds.flatMap(cid => {
              const course = courses.find(c => c.id === cid);
              return course?.tutor ? course.tutor.split(',').map(s => s.trim()).filter(Boolean) : [];
            }),
            ...(student.assignedTutorIds ?? []).map(id => tutors.find(t => t.id === id)?.name).filter((n): n is string => !!n),
          ]));
          const assignedTutors = assignedTutorNames;
          return (
            <div
              key={student.id}
              onClick={() => navigate(`/students/${student.id}`)}
              className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-5 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center text-primary flex-shrink-0">
                <User size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-on-surface truncate">{student.name}</p>
                <p className="text-xs text-on-surface-variant truncate">{student.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full whitespace-nowrap">
                    {enrolledCount} {enrolledCount === 1 ? 'course' : 'courses'}
                  </span>
                  {assignedTutors.length > 0
                    ? <span className="text-[10px] text-on-surface-variant truncate">{assignedTutors.join(', ')}</span>
                    : <span className="text-[10px] text-amber-500 font-semibold italic">No tutor</span>
                  }
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                <button
                  onClick={async () => {
                    if (!confirm(`Delete ${student.name}? This will also remove their account.`)) return;
                    setDeletingId(student.id);
                    await deleteStudent(student.id);
                    setDeletingId(null);
                  }}
                  disabled={deletingId === student.id}
                  className="p-2 rounded-lg text-on-surface-variant hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                >
                  {deletingId === student.id
                    ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                    : <Trash2 size={16} />
                  }
                </button>
                <ChevronRight size={18} className="text-on-surface-variant" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-surface-container-low rounded-[40px] border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-high">
              <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Student</th>
              <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Assigned Tutor(s)</th>
              <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Enrolled Courses</th>
              <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Last Active</th>
              <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {filtered.map(student => (
              <tr key={student.id}
                className="hover:bg-surface-container-lowest transition-colors cursor-pointer"
                onClick={() => navigate(`/students/${student.id}`)}
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary flex-shrink-0">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{student.name}</p>
                      <p className="text-xs text-on-surface-variant">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-wrap gap-1.5">
                    {(() => {
                      const names = Array.from(new Set([
                        ...student.enrolledCourseIds.flatMap(cid => {
                          const course = courses.find(c => c.id === cid);
                          return course?.tutor ? course.tutor.split(',').map(s => s.trim()).filter(Boolean) : [];
                        }),
                        ...(student.assignedTutorIds ?? []).map(id => tutors.find(t => t.id === id)?.name).filter((n): n is string => !!n),
                      ]));
                      if (names.length === 0) return <span className="text-[10px] text-amber-500 font-semibold italic">None assigned</span>;
                      return names.map(name => (
                        <span key={name} className="px-2.5 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-lg">{name}</span>
                      ));
                    })()}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-wrap gap-1.5">
                    {(() => {
                      const validCourses = student.enrolledCourseIds
                        .map(id => courses.find(c => c.id === id))
                        .filter(Boolean);
                      return <>
                        {validCourses.slice(0, 3).map(course => (
                          <span key={course!.id} className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg">{course!.title}</span>
                        ))}
                        {validCourses.length > 3 && (
                          <span className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded-lg">+{validCourses.length - 3} more</span>
                        )}
                        {validCourses.length === 0 && <span className="text-[10px] text-on-surface-variant italic">No courses</span>}
                      </>;
                    })()}
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-on-surface-variant">{formatLastActivity(student.lastActivity)}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete ${student.name}? This will also remove their account.`)) return;
                        setDeletingId(student.id);
                        await deleteStudent(student.id);
                        setDeletingId(null);
                      }}
                      disabled={deletingId === student.id}
                      className="p-2 rounded-lg text-on-surface-variant hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                    >
                      {deletingId === student.id
                        ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                        : <Trash2 size={16} />
                      }
                    </button>
                    <button onClick={() => navigate(`/students/${student.id}`)}
                      className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-8 py-20 text-center">
                <div className="flex flex-col items-center gap-4 text-on-surface-variant">
                  <Users size={48} className="opacity-20" />
                  <p className="font-bold">No students found.</p>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const TutorsList = () => {
  const { tutors, deleteTutor, updateTutor, refreshData, currentUserEmail } = useData();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTutor, setNewTutor] = useState({ name: '', email: '' });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [tutorLinkCopied, setTutorLinkCopied] = useState(false);
  const [tutorLinkLoading, setTutorLinkLoading] = useState(false);

  const currentTutor = tutors.find(t => t.email === currentUserEmail);
  const hasAnyAdmin = tutors.some(t => t.isAdmin);
  // Bootstrap: if no admin exists yet, all tutors get admin controls so someone can claim it
  const isEffectiveAdmin = currentTutor?.isAdmin || !hasAnyAdmin;

  const filtered = tutors.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteStatus('idle');
    const result = await supabaseService.inviteTutor(newTutor.name, newTutor.email);
    if (result) {
      await refreshData();
      setInviteStatus('success');
      setTimeout(() => {
        setNewTutor({ name: '', email: '' });
        setShowModal(false);
        setInviteStatus('idle');
      }, 1500);
    } else {
      setInviteStatus('error');
    }
    setInviteLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <Header title="Tutors" />
      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
          <input
            type="text"
            placeholder="Search tutors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {isEffectiveAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <PlusCircle size={18} /> Add Tutor
          </button>
        )}
      </div>

      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-on-surface-variant">
            <GraduationCap size={48} className="opacity-20" />
            <p className="font-bold">No tutors found.</p>
          </div>
        ) : filtered.map(tutor => (
          <div
            key={tutor.id}
            className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-5 flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
              <GraduationCap size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-on-surface truncate">{tutor.name}</p>
                {tutor.isAdmin && <Crown size={12} className="text-amber-500 flex-shrink-0" style={{ fill: 'currentColor' }} />}
              </div>
              <p className="text-xs text-on-surface-variant truncate">{tutor.email}</p>
              {tutor.lastActivity && (
                <p className="text-[10px] text-on-surface-variant mt-1">{tutor.lastActivity}</p>
              )}
            </div>
            {isEffectiveAdmin && (
              <button
                title={tutor.isAdmin ? 'Remove admin' : 'Make admin'}
                onClick={() => updateTutor(tutor.id, { isAdmin: !tutor.isAdmin })}
                className="p-2 rounded-xl transition-colors flex-shrink-0 hover:bg-amber-50"
              >
                <Crown
                  size={16}
                  className={tutor.isAdmin ? 'text-amber-500' : 'text-on-surface-variant/30'}
                  style={{ fill: tutor.isAdmin ? 'currentColor' : 'none' }}
                />
              </button>
            )}
            {isEffectiveAdmin && (
              <button
                onClick={() => { if (confirm(`Delete ${tutor.name}?`)) deleteTutor(tutor.id); }}
                className="p-2 rounded-xl text-on-surface-variant hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-surface-container-low rounded-[28px] border border-outline-variant/30 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/20 text-left">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Name</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Email</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Last Active</th>
              {isEffectiveAdmin && <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={isEffectiveAdmin ? 4 : 3} className="px-6 py-12 text-center text-on-surface-variant">No tutors found.</td></tr>
            ) : (
              filtered.map(tutor => (
                <tr key={tutor.id} className="border-b border-outline-variant/10 hover:bg-surface-container-high/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-on-surface">{tutor.name}</span>
                      {tutor.isAdmin && <Crown size={13} className="text-amber-500" style={{ fill: 'currentColor' }} />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm">{tutor.email}</td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm">{tutor.lastActivity ?? '—'}</td>
                  {isEffectiveAdmin && (
                    <td className="px-6 py-4 flex items-center gap-1">
                      <button
                        title={tutor.isAdmin ? 'Remove admin' : 'Make admin'}
                        onClick={() => updateTutor(tutor.id, { isAdmin: !tutor.isAdmin })}
                        className="p-2 rounded-xl transition-colors hover:bg-amber-50"
                      >
                        <Crown
                          size={16}
                          className={tutor.isAdmin ? 'text-amber-500' : 'text-on-surface-variant/30'}
                          style={{ fill: tutor.isAdmin ? 'currentColor' : 'none' }}
                        />
                      </button>
                      <button
                        onClick={() => { if (confirm(`Delete ${tutor.name}?`)) deleteTutor(tutor.id); }}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-surface-container-low w-full max-w-md rounded-[32px] p-8 border border-outline-variant/30 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-on-surface mb-6">Invite Tutor</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Full Name</label>
                  <input required value={newTutor.name} onChange={e => setNewTutor(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-container-high rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Dr. Jane Smith" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Email Address</label>
                  <input required type="email" value={newTutor.email} onChange={e => setNewTutor(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-container-high rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="jane@tutoring.com" />
                </div>
                {inviteStatus === 'success' && (
                  <p className="text-sm font-semibold text-green-600 bg-green-50 px-4 py-2 rounded-xl">Invite sent successfully!</p>
                )}
                {inviteStatus === 'error' && (
                  <p className="text-sm font-semibold text-red-600 bg-red-50 px-4 py-2 rounded-xl">Failed to send invite. Check the service role key is configured.</p>
                )}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-2xl border border-outline-variant/30 text-on-surface-variant font-semibold text-sm hover:bg-surface-container-high transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={inviteLoading}
                    className="flex-1 py-3 rounded-2xl bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                    {inviteLoading ? 'Sending Invite...' : 'Send Invite'}
                  </button>
                </div>
                <button type="button" disabled={tutorLinkLoading} onClick={async () => {
                  setTutorLinkLoading(true);
                  const token = await supabaseService.createInviteToken('tutor');
                  setTutorLinkLoading(false);
                  if (token) {
                    const link = `${window.location.origin}${window.location.pathname}?invite=${token}`;
                    navigator.clipboard.writeText(link);
                    setTutorLinkCopied(true);
                    setTimeout(() => setTutorLinkCopied(false), 3000);
                  }
                }} className="w-full py-3 rounded-2xl border border-outline-variant/30 text-on-surface-variant font-semibold text-sm hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {tutorLinkLoading ? <div className="w-4 h-4 border-2 border-outline-variant border-t-primary rounded-full animate-spin" /> : tutorLinkCopied ? <><Check size={14} /> Link Copied!</> : <><Link2 size={14} /> Copy 24h Invite Link</>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InviteSignup = ({ token, onDone }: { token: string; onDone: (role: string) => void }) => {
  const [state, setState] = useState<'validating' | 'valid' | 'invalid'>('validating');
  const [role, setRole] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabaseService.validateInviteToken(token).then(result => {
      if (result.valid) { setRole(result.role!); setState('valid'); }
      else { setTokenError(result.error || 'Invalid invite link.'); setState('invalid'); }
    });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setIsLoading(true);
    setError('');
    try {
      const role = await supabaseService.signUpWithToken(email, password, name, token);
      setDone(true);
      window.history.replaceState(null, '', window.location.pathname);
      setTimeout(() => onDone(role), 1200);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-surface p-4 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-surface-container-low border border-outline-variant/30 rounded-[40px] shadow-2xl p-8 sm:p-10 relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary font-black text-lg">D</div>
          <span className="font-black text-lg text-on-surface tracking-tight">DM - Tutoring</span>
        </div>

        {state === 'validating' && (
          <div className="py-12 flex flex-col items-center gap-4 text-on-surface-variant">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-medium">Checking your invite link…</p>
          </div>
        )}

        {state === 'invalid' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><X size={28} /></div>
            <h2 className="text-xl font-black text-on-surface mb-2">Link Unavailable</h2>
            <p className="text-sm text-on-surface-variant">{tokenError}</p>
            <p className="text-xs text-on-surface-variant mt-4">Ask your tutor or admin to send a new invite link.</p>
          </div>
        )}

        {state === 'valid' && !done && (
          <>
            <div className="mb-8">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 ${role === 'tutor' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                {role} invite
              </span>
              <h2 className="text-2xl font-black text-on-surface">Create your account</h2>
              <p className="text-sm text-on-surface-variant mt-1">Your link expires in 24 hours and can only be used once.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                  className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"
                  className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Password</label>
                <div className="relative">
                  <input required type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full px-5 py-4 pr-12 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                  <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Confirm Password</label>
                <input required type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              {error && <p className="text-sm text-red-500 bg-red-50 rounded-2xl px-4 py-3">{error}</p>}
              <button type="submit" disabled={isLoading}
                className="w-full py-4 bg-primary text-on-primary font-bold rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 mt-2">
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
              </button>
            </form>
          </>
        )}

        {done && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500"><CheckCircle2 size={28} /></div>
            <h2 className="text-xl font-black text-on-surface mb-2">Account Created!</h2>
            <p className="text-sm text-on-surface-variant">Logging you in…</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const Login = ({ onLogin }: { onLogin: (role: string) => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await supabaseService.signIn(email, password);
      if (data.user) {
        const profile = await supabaseService.getProfile(data.user.id);
        if (profile) {
          onLogin(profile.role);
        } else {
          setError('No account found. Please contact your administrator.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-surface p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface-container-low rounded-[40px] p-8 md:p-10 border border-outline-variant/30 shadow-2xl relative z-10"
      >
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-on-primary mb-6 shadow-lg shadow-primary/20">
            <BrainCircuit size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-on-surface mb-2">DM - Tutoring</h1>
          <p className="text-on-surface-variant">Elevate your academic journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
              <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-2xl px-4 py-3">{error}</p>
          )}

          <button type="submit" disabled={isLoading}
            className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100">
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Sign In <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div className="mt-8">
          <p className="text-sm text-on-surface-variant text-center">
            New here? You need an invite link to create an account.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const AcceptInvite = ({ onDone }: { onDone: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabaseService.getCurrentUser().then(user => {
      if (user?.email) setEmail(user.email);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await supabaseService.setPasswordFromInvite(password, name);
      onDone();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-surface p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface-container-low rounded-[40px] p-8 md:p-10 border border-outline-variant/30 shadow-2xl relative z-10"
      >
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-on-primary mb-6 shadow-lg shadow-primary/20">
            <BrainCircuit size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-on-surface mb-2">Welcome!</h1>
          <p className="text-on-surface-variant">Set up your account to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
              <input
                type="email"
                value={email}
                readOnly
                className="w-full pl-12 pr-4 py-4 bg-surface-container-high border border-outline-variant/30 rounded-2xl text-on-surface-variant cursor-default"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Re-enter New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-2xl px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading
              ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <>Activate Account <ArrowRight size={20} /></>
            }
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isInvite, setIsInvite] = useState(() => {
    const hash = window.location.hash;
    return hash.includes('type=invite') || hash.includes('type=recovery');
  });
  const [inviteToken] = useState<string | null>(() => new URLSearchParams(window.location.search).get('invite'));
  const { role: userRole, setRole: setUserRole, setCurrentUserEmail, setCurrentUserName, refreshData } = useData();

  useEffect(() => {
    // PKCE invite flow: Supabase redirects with ?code= in the URL.
    // The SDK auto-exchanges it and fires SIGNED_IN. We only listen for this
    // when the URL actually has a code param (invite links), not during normal login.
    const hasPKCECode = new URLSearchParams(window.location.search).has('code');

    let subscription: { unsubscribe: () => void } | null = null;

    if (hasPKCECode) {
      const { data } = supabaseService.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const profile = await supabaseService.getProfile(session.user.id);
          if (!profile) {
            setIsInvite(true);
            // Clean the ?code= from the URL so it doesn't re-trigger
            window.history.replaceState(null, '', window.location.pathname);
          }
          // If they do have a profile, normal login flow handles it
        }
      });
      subscription = data.subscription;
    }

    // Restore an existing session on page load / refresh (normal users)
    supabaseService.getSession().then(async session => {
      if (session) {
        const profile = await supabaseService.getProfile(session.user.id);
        if (profile) {
          setIsAuthenticated(true);
          setUserRole(profile.role);
          setCurrentUserEmail(session.user.email ?? null);
          setCurrentUserName(profile.name ?? null);
        }
      }
      setAuthLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogin = async (role: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    const session = await supabaseService.getSession();
    setCurrentUserEmail(session?.user.email ?? null);
    if (session?.user) {
      const profile = await supabaseService.getProfile(session.user.id);
      setCurrentUserName(profile?.name ?? null);
    }
    await refreshData();
  };

  const handleInviteDone = async () => {
    setIsInvite(false);
    window.history.replaceState(null, '', window.location.pathname);
    const session = await supabaseService.getSession();
    if (session) {
      const profile = await supabaseService.getProfile(session.user.id);
      setUserRole(profile?.role ?? 'student');
      setCurrentUserEmail(session.user.email ?? null);
      setCurrentUserName(profile?.name ?? null);
    }
    setIsAuthenticated(true);
    await refreshData();
  };

  const handleLogout = async () => {
    await supabaseService.signOut();
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUserName(null);
  };

  if (inviteToken && !isAuthenticated) {
    return <InviteSignup token={inviteToken} onDone={handleLogin} />;
  }

  if (isInvite) {
    return <AcceptInvite onDone={handleInviteDone} />;
  }

  // Wait for auth check before rendering anything — prevents login flash
  if (authLoading) {
    return <div className="w-full min-h-screen bg-surface" />;
  }

  return (
    <Router>
      <div className="w-full flex min-h-screen bg-surface selection:bg-primary/20 selection:text-primary">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          ) : (
            <>
              <Sidebar onLogout={handleLogout} role={userRole || 'student'} />
              <MobileTopBar onLogout={handleLogout} />

              <main className="flex-1 p-4 pt-16 md:p-8 md:pt-8 lg:p-12 pb-24 lg:pb-12 overflow-x-hidden">
                <AnimatePresence mode="wait">
                  <Routes>
                    {userRole === 'tutor' ? (
                      <>
                        <Route path="/" element={<TutorDashboard />} />
                        <Route path="/courses" element={<TutorCourses />} />
                        <Route path="/students" element={<TutorStudents />} />
                        <Route path="/students/:id" element={<StudentDetail />} />
                        <Route path="/tutors" element={<TutorsList />} />
                        <Route path="/resources" element={<TutorResources />} />
                        <Route path="/analytics" element={<TutorAnalytics />} />
                        <Route path="/profile" element={<Profile />} />
                      </>
                    ) : (
                      <>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/courses/:id" element={<StudentCoursePage />} />
                        <Route path="/resources" element={<Resources />} />
                        <Route path="/profile" element={<Profile />} />
                      </>
                    )}
                    {/* Fallback routes */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AnimatePresence>
              </main>

              <MobileNav role={userRole || 'student'} />
            </>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}
