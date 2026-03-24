import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  User, 
  Search, 
  Bell, 
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
  Edit3
} from 'lucide-react';
import { Course, Session, Feedback, Resource } from './types';
import { DataProvider, useData } from './context/DataContext';
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
  endOfDay
} from 'date-fns';

// --- Components ---

const Sidebar = ({ onLogout, role }: { onLogout: () => void, role: string }) => {
  const location = useLocation();
  
  const studentNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: GraduationCap, label: 'Resources', path: '/resources' },
  ];

  const tutorNavItems = [
    { icon: LayoutDashboard, label: 'Tutor Dashboard', path: '/' },
    { icon: BookOpen, label: 'Manage Courses', path: '/courses' },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: Calendar, label: 'Manage Schedule', path: '/schedule' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
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

      <div className="mt-auto pt-6 border-t border-outline-variant/30 space-y-2">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 w-full text-left hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

const MobileNav = ({ role }: { role: string }) => {
  const location = useLocation();
  const studentNavItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const tutorNavItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
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

const Header = ({ title, role }: { title: string, role?: string }) => (
  <header className="flex items-center justify-between mb-8">
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-on-surface">{title}</h2>
      <p className="text-on-surface-variant mt-1">
        {role === 'tutor' ? 'Welcome back, Professor. Your students are waiting.' : 'Welcome back, Mateo. Ready to excel?'}
      </p>
    </div>
    <div className="flex items-center gap-4">
      <button className="p-2.5 rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors relative">
        <Bell size={22} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-surface-container-high"></span>
      </button>
      <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-on-surface">Mateo Builes</p>
          <p className="text-xs text-on-surface-variant">Premium Scholar</p>
        </div>
        <img 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mateo" 
          alt="Avatar" 
          className="w-10 h-10 rounded-full bg-primary-container border-2 border-primary/10"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  </header>
);

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
              <p className="text-sm text-on-surface-variant font-medium">{course.level} • Academic Course</p>
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
                        <p className="text-[10px] text-on-surface-variant mt-1 font-bold uppercase tracking-wider">{session.date} • {session.duration}m</p>
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
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const { courses, sessions, feedback, resources, role } = useData();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto"
    >
      <Header title="Dashboard" role={role || 'student'} />

      <AnimatePresence>
        {selectedCourse && (
          <CourseModal 
            course={selectedCourse} 
            onClose={() => setSelectedCourse(null)} 
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column: Current Courses */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-surface-container-low rounded-[40px] p-8 border border-outline-variant/30">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-2xl font-black text-on-surface flex items-center gap-3">
                <GraduationCap size={28} className="text-primary" /> Current Courses
              </h4>
              <Link to="/courses" className="text-sm font-bold text-primary hover:underline bg-primary/5 px-4 py-2 rounded-full">View All Courses</Link>
            </div>
            
            <div className="space-y-6">
              {courses.slice(0, 3).map((course) => {
                const isExpanded = expandedCourseId === course.id;
                const currentStudentId = 's1'; // Hardcoded for demo (Alice)
                const courseSessions = sessions.filter(s => s.courseId === course.id && s.studentId === currentStudentId);
                const courseResources = resources.filter(r => r.courseId === course.id && r.studentId === currentStudentId);
                const courseFeedback = feedback.filter(f => f.courseId === course.id && f.studentId === currentStudentId);

                return (
                  <div 
                    key={course.id} 
                    className={`bg-surface-container-lowest rounded-[32px] border transition-all duration-300 overflow-hidden ${
                      isExpanded ? 'border-primary ring-1 ring-primary/20 shadow-xl' : 'border-outline-variant/20 hover:border-primary/30'
                    }`}
                  >
                    <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <BookOpen size={32} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary-container/30 px-2 py-0.5 rounded-md">
                            {course.level}
                          </span>
                          <span className="text-[10px] font-bold text-on-surface-variant">65% Complete</span>
                        </div>
                        <h5 className="text-xl font-bold text-on-surface truncate">{course.title}</h5>
                        <div className="mt-2 h-1.5 bg-surface-container-highest rounded-full overflow-hidden w-full max-w-xs">
                          <div className="h-full bg-primary w-[65%] rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                          className={`p-3 rounded-2xl transition-all ${
                            isExpanded ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
                          }`}
                        >
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        <button 
                          onClick={() => setSelectedCourse(course)}
                          className="px-6 py-3 bg-primary text-on-primary text-sm font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                        >
                          Open Course
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-outline-variant/20 bg-surface-container-low/50"
                        >
                          <div className="p-8 space-y-6">
                            {/* Notes & Videos Widget Row */}
                            <div className="bg-surface-container-lowest p-6 rounded-[32px] border border-outline-variant/10 shadow-sm">
                              <h6 className="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Play size={14} /> Notes & Videos
                              </h6>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {courseSessions.length > 0 ? courseSessions.map(session => (
                                  <div key={session.id} className="flex items-center gap-4 p-4 bg-surface-container-high/30 rounded-2xl border border-outline-variant/10 hover:border-primary/20 transition-all cursor-pointer group">
                                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary flex-shrink-0">
                                      <Play size={20} fill="currentColor" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-on-surface truncate">{session.title}</p>
                                      <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">{session.date} • {session.duration}m</p>
                                    </div>
                                  </div>
                                )) : (
                                  <p className="text-sm text-on-surface-variant italic col-span-full">No sessions found for this course.</p>
                                )}
                              </div>
                            </div>

                            {/* Tutor Feedback Widget Row */}
                            <div className="bg-surface-container-lowest p-6 rounded-[32px] border border-outline-variant/10 shadow-sm">
                              <h6 className="text-xs font-black text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MessageSquare size={14} /> Tutor Feedback
                              </h6>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseFeedback.length > 0 ? courseFeedback.map(item => (
                                  <div key={item.id} className="p-5 bg-tertiary-container/10 rounded-2xl border border-tertiary/10">
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                                          <User size={12} />
                                        </div>
                                        <span className="text-[10px] font-black text-tertiary uppercase tracking-wider">{item.tutor}</span>
                                      </div>
                                      <span className="text-[10px] text-tertiary/60 font-medium">{item.date}</span>
                                    </div>
                                    <p className="text-xs text-tertiary/80 italic leading-relaxed">"{item.text}"</p>
                                  </div>
                                )) : (
                                  <p className="text-sm text-on-surface-variant italic col-span-full">No feedback received for this course yet.</p>
                                )}
                              </div>
                            </div>

                            {/* Additional Resources Widget Row */}
                            <div className="bg-surface-container-lowest p-6 rounded-[32px] border border-outline-variant/10 shadow-sm">
                              <h6 className="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FileText size={14} /> Additional Resources
                              </h6>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {courseResources.length > 0 ? courseResources.map(res => (
                                  <div key={res.id} className="flex items-center gap-4 p-4 bg-surface-container-high/30 rounded-2xl border border-outline-variant/10 hover:border-primary/20 transition-all cursor-pointer group">
                                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary flex-shrink-0">
                                      <FileText size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-on-surface truncate">{res.title}</p>
                                      <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">{res.type} • {res.size || '1.2MB'}</p>
                                    </div>
                                  </div>
                                )) : (
                                  <p className="text-sm text-on-surface-variant italic col-span-full">No resources found for this course.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Side Column: Schedule */}
        <div className="lg:col-span-4">
          <section className="bg-surface-container-low rounded-[40px] p-8 border border-outline-variant/30 sticky top-8">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-black text-on-surface flex items-center gap-3">
                <Calendar size={24} className="text-primary" /> Schedule
              </h4>
              <Link to="/schedule" className="text-xs font-bold text-primary hover:underline">Full View</Link>
            </div>
            
            <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20 mb-8">
              <div className="grid grid-cols-7 gap-1 text-center mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <span key={`dash-cal-${d}-${i}`} className="text-[10px] font-black text-on-surface-variant">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === 24;
                  const hasSession = [21, 24, 26, 28].includes(day);
                  return (
                    <div 
                      key={i} 
                      className={`aspect-square rounded-xl text-[10px] font-black flex flex-col items-center justify-center relative transition-all ${
                        isToday ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {day}
                      {hasSession && !isToday && <span className="absolute bottom-1.5 w-1 h-1 bg-primary rounded-full"></span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-2">Today's Sessions</p>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex flex-col items-center justify-center">
                  <span className="text-[10px] font-black leading-none">OCT</span>
                  <span className="text-lg font-black leading-none">24</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface truncate">Organic Chemistry</p>
                  <p className="text-xs text-on-surface-variant">14:00 • Dr. Thorne</p>
                </div>
              </div>
              <button className="w-full py-4 bg-surface-container-high text-on-surface text-sm font-bold rounded-2xl hover:bg-surface-container-highest transition-all">
                View Full Schedule
              </button>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

const Courses = () => {
  const [activeTab, setActiveTab] = React.useState<'All' | 'Elementary' | 'High School' | 'Uni'>('All');
  const [expandedCourseId, setExpandedCourseId] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');
  const { courses, sessions, role } = useData();
  
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
      <Header title="Courses" role={role || 'student'} />

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
            {['All', 'Elementary', 'High School', 'Uni'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-primary text-on-primary shadow-md' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab}
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
          const isExpanded = expandedCourseId === course.id;
          const courseTutor = sessions.find(s => s.courseId === course.id)?.tutor || 'Expert Tutor';

          if (viewMode === 'list') {
            return (
              <motion.div 
                layout
                key={course.id} 
                onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                className={`group bg-surface-container-lowest rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isExpanded ? 'border-primary ring-1 ring-primary/20 shadow-xl' : 'border-outline-variant/30 hover:shadow-md hover:border-primary/20'
                }`}
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-container text-primary flex items-center justify-center flex-shrink-0">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-0.5">
                      <h3 className="text-base font-black text-on-surface truncate group-hover:text-primary transition-colors">{course.title}</h3>
                      <span className="text-[8px] font-black uppercase tracking-widest text-secondary bg-secondary-container/50 px-2 py-0.5 rounded-full">
                        {course.level}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant truncate">{course.description}</p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end mr-4">
                    <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-wider">Tutor</span>
                    <span className="text-xs font-bold text-on-surface">{courseTutor}</span>
                  </div>
                  <div className={`p-2 rounded-full transition-all ${isExpanded ? 'bg-primary text-on-primary rotate-180' : 'bg-primary/5 text-primary'}`}>
                    <ChevronDown size={18} />
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-outline-variant/20 bg-surface-container-low/30"
                    >
                      <div className="p-6 flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                          <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Course Description</h4>
                          <p className="text-sm text-on-surface-variant leading-relaxed">
                            {course.description}
                          </p>
                        </div>
                        <div className="w-full md:w-64 flex flex-col justify-end">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Request sent for ${course.title}!`);
                            }}
                            className="w-full py-3 bg-primary text-on-primary rounded-2xl font-black text-xs shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
                          >
                            <PlusCircle size={16} />
                            Request Course
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          }

          return (
            <motion.div 
              layout
              key={course.id} 
              onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
              className={`group bg-surface-container-lowest rounded-[32px] border transition-all duration-300 cursor-pointer flex flex-col overflow-hidden ${
                isExpanded ? 'border-primary ring-1 ring-primary/20 shadow-xl' : 'border-outline-variant/30 hover:shadow-lg hover:border-primary/20'
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary-container text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BookOpen size={28} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary-container/50 px-3 py-1 rounded-full">
                    {course.level}
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-on-surface mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                
                <AnimatePresence>
                  {!isExpanded && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-on-surface-variant leading-relaxed line-clamp-2"
                    >
                      {course.description}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                      <User size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">Available Tutor</span>
                      <span className="text-xs font-bold text-on-surface">{courseTutor}</span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-full transition-all ${isExpanded ? 'bg-primary text-on-primary rotate-180' : 'bg-primary/5 text-primary'}`}>
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-outline-variant/20 bg-surface-container-low/30"
                  >
                    <div className="p-6 space-y-6">
                      <div>
                        <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-2">Course Description</h4>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-outline-variant/10">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Request sent for ${course.title}!`);
                          }}
                          className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
                        >
                          <PlusCircle size={18} />
                          Request to take this course
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
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
    </motion.div>
  );
};

const TutorAnalytics = () => {
  const { sessions, students, courses, feedback } = useData();

  // Mock data for analytics
  const weeklyHoursData = [
    { name: 'Mon', hours: 4 },
    { name: 'Tue', hours: 6 },
    { name: 'Wed', hours: 5 },
    { name: 'Thu', hours: 8 },
    { name: 'Fri', hours: 4 },
    { name: 'Sat', hours: 2 },
    { name: 'Sun', hours: 0 },
  ];

  const courseDistributionData = courses.map(c => ({
    name: c.title,
    value: sessions.filter(s => s.courseId === c.id).length || Math.floor(Math.random() * 10) + 1
  })).slice(0, 5);

  const studentProgressData = [
    { month: 'Jan', avgScore: 65 },
    { month: 'Feb', avgScore: 72 },
    { month: 'Mar', avgScore: 68 },
    { month: 'Apr', avgScore: 78 },
    { month: 'May', avgScore: 85 },
    { month: 'Jun', avgScore: 82 },
  ];

  const earningsData = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 1500 },
    { month: 'Mar', amount: 1100 },
    { month: 'Apr', amount: 1800 },
    { month: 'May', amount: 2200 },
    { month: 'Jun', amount: 1900 },
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto pb-12"
    >
      <Header title="Tutor Analytics" role="tutor" />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Sessions', value: sessions.length, icon: Video, color: 'bg-blue-500/10 text-blue-500' },
          { label: 'Total Hours', value: '124h', icon: Clock, color: 'bg-purple-500/10 text-purple-500' },
          { label: 'Active Students', value: students.length, icon: Users, color: 'bg-pink-500/10 text-pink-500' },
          { label: 'Avg. Rating', value: '4.9', icon: Star, color: 'bg-amber-500/10 text-amber-500' },
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
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-on-surface">Weekly Tutoring Hours</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
              <ArrowUpRight size={14} /> +12% vs last week
            </div>
          </div>
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
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Distribution */}
        <div className="bg-surface-container-low p-8 rounded-[40px] border border-outline-variant/30 shadow-sm">
          <h3 className="text-xl font-black text-on-surface mb-8">Course Popularity</h3>
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
                  {courseDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Progress */}
        <div className="bg-surface-container-low p-8 rounded-[40px] border border-outline-variant/30 shadow-sm">
          <h3 className="text-xl font-black text-on-surface mb-8">Average Student Progress</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentProgressData}>
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
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: '1px solid #e5e7eb'
                  }}
                />
                <Line type="monotone" dataKey="avgScore" stroke="#ec4899" strokeWidth={4} dot={{ r: 6, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Earnings */}
        <div className="bg-surface-container-low p-8 rounded-[40px] border border-outline-variant/30 shadow-sm">
          <h3 className="text-xl font-black text-on-surface mb-8">Monthly Earnings ($)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
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
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: '1px solid #e5e7eb'
                  }}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TutorSchedule = () => {
  const { sessions, students, courses, availability, setAvailability, addSession, role } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('week');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date, time: string } | null>(null);
  const [bookingData, setBookingData] = useState({ studentId: '', courseId: '', title: '', duration: 60 });

  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const hours = Array.from({ length: 14 }).map((_, i) => i + 8); // 8 AM to 9 PM

  const toggleAvailability = (day: number, hour: number) => {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    const existing = availability.find(a => a.dayOfWeek === day && a.startTime === timeStr);
    
    if (existing) {
      setAvailability(availability.filter(a => a.id !== existing.id));
    } else {
      setAvailability([...availability, {
        id: Math.random().toString(36).substr(2, 9),
        dayOfWeek: day,
        startTime: timeStr,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`
      }]);
    }
  };

  const isUnavailable = (day: number, hour: number) => {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    return availability.some(a => a.dayOfWeek === day && a.startTime === timeStr);
  };

  const getSessionAt = (date: Date, hour: number) => {
    return sessions.find(s => {
      let sessionDate: Date;
      if (s.date === 'Today') {
        sessionDate = new Date();
      } else {
        // Handle "Monday, Oct 24" format
        const parts = s.date.split(', ');
        const dateStr = parts.length > 1 ? parts[1] : s.date;
        sessionDate = new Date(`${dateStr}, ${new Date().getFullYear()}`);
      }
      
      if (!isSameDay(sessionDate, date)) return false;

      // Parse "4:00 PM"
      const [timePart, ampm] = s.time.split(' ');
      const [sHourStr] = timePart.split(':');
      let sHour = parseInt(sHourStr);
      if (ampm === 'PM' && sHour !== 12) sHour += 12;
      if (ampm === 'AM' && sHour === 12) sHour = 0;
      
      return sHour === hour;
    });
  };

  const handleSlotClick = (date: Date, hour: number) => {
    const day = date.getDay();
    if (isUnavailable(day, hour)) {
      toggleAvailability(day, hour);
    } else {
      const session = getSessionAt(date, hour);
      if (!session) {
        setSelectedSlot({ date, time: `${hour.toString().padStart(2, '0')}:00` });
        setShowBookingModal(true);
      }
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    const student = students.find(s => s.id === bookingData.studentId);
    const course = courses.find(c => c.id === bookingData.courseId);

    addSession({
      studentId: bookingData.studentId,
      courseId: bookingData.courseId,
      title: bookingData.title || (course ? `${course.title} Session` : 'Tutoring Session'),
      tutor: 'Dr. Aris Thorne',
      date: format(selectedSlot.date, 'EEEE, MMM d'),
      time: format(parse(selectedSlot.time, 'HH:mm', new Date()), 'h:mm a'),
      duration: bookingData.duration,
      status: 'upcoming',
      type: 'both',
      modality: 'online'
    });

    setShowBookingModal(false);
    setBookingData({ studentId: '', courseId: '', title: '', duration: 60 });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-7xl mx-auto"
    >
      <Header title="Manage Schedule" role="tutor" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation & Controls */}
        <div className="lg:w-80 space-y-6">
          <div className="bg-surface-container-low rounded-[40px] p-8 border border-outline-variant/30 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-black text-on-surface">{format(currentDate, 'MMMM yyyy')}</h4>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <span key={d} className="text-[10px] font-black text-on-surface-variant/50">{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {eachDayOfInterval({
                start: startOfMonth(currentDate),
                end: endOfMonth(currentDate)
              }).map((day, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentDate(day)}
                  className={`aspect-square rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                    isSameDay(day, currentDate) 
                      ? 'bg-primary text-on-primary shadow-lg' 
                      : isToday(day) ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  {format(day, 'd')}
                </button>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between p-1 bg-surface-container-high rounded-2xl border border-outline-variant/20">
                <button 
                  onClick={() => setView('month')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${view === 'month' ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant'}`}
                >
                  Month
                </button>
                <button 
                  onClick={() => setView('week')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${view === 'week' ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant'}`}
                >
                  Week
                </button>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="flex-1 py-3 bg-surface-container-high rounded-xl text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center gap-2">
                  <ChevronLeft size={16} /> Month
                </button>
                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="flex-1 py-3 bg-surface-container-high rounded-xl text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center gap-2">
                  Month <ChevronRight size={16} />
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCurrentDate(subYears(currentDate, 1))} className="flex-1 py-3 bg-surface-container-high rounded-xl text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center gap-2">
                  <ChevronLeft size={16} /> Year
                </button>
                <button onClick={() => setCurrentDate(addYears(currentDate, 1))} className="flex-1 py-3 bg-surface-container-high rounded-xl text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center gap-2">
                  Year <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-[40px] p-8 border border-outline-variant/30 shadow-sm">
            <h5 className="text-sm font-black text-on-surface uppercase tracking-widest mb-4">Legend</h5>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-on-surface-variant">
                <div className="w-4 h-4 rounded bg-primary/10 border border-primary/20"></div> Available
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-on-surface-variant">
                <div className="w-4 h-4 rounded bg-surface-container-highest border border-outline-variant/30"></div> Unavailable
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-on-surface-variant">
                <div className="w-4 h-4 rounded bg-primary shadow-sm"></div> Session Booked
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Calendar Grid */}
        <div className="flex-1 bg-surface-container-low rounded-[40px] border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-bottom border-outline-variant/20 flex items-center justify-between bg-surface-container-high/50">
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))} className="p-2 hover:bg-surface-container-highest rounded-xl transition-all"><ChevronLeft size={20} /></button>
              <h4 className="text-lg font-black text-on-surface">Week of {format(weekStart, 'MMM d, yyyy')}</h4>
              <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="p-2 hover:bg-surface-container-highest rounded-xl transition-all"><ChevronRight size={20} /></button>
            </div>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold text-xs hover:bg-primary/20 transition-all">Today</button>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="grid grid-cols-8 border-b border-outline-variant/20">
                <div className="p-4 border-r border-outline-variant/20"></div>
                {weekDays.map(day => (
                  <div key={day.toString()} className={`p-4 text-center border-r border-outline-variant/20 ${isToday(day) ? 'bg-primary/5' : ''}`}>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{format(day, 'EEE')}</p>
                    <p className={`text-xl font-black ${isToday(day) ? 'text-primary' : 'text-on-surface'}`}>{format(day, 'd')}</p>
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="relative">
                {hours.map(hour => (
                  <div key={hour} className="grid grid-cols-8 border-b border-outline-variant/10 h-20">
                    <div className="p-2 text-[10px] font-black text-on-surface-variant/60 text-right border-r border-outline-variant/20">
                      {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                    </div>
                    {weekDays.map(day => {
                      const unavailable = isUnavailable(day.getDay(), hour);
                      const session = getSessionAt(day, hour);
                      
                      return (
                        <div 
                          key={`${day}-${hour}`}
                          onClick={() => handleSlotClick(day, hour)}
                          className={`relative border-r border-outline-variant/10 cursor-pointer transition-all ${
                            unavailable ? 'bg-surface-container-highest/50' : 'hover:bg-primary/5'
                          }`}
                        >
                          {session && (
                            <div className="absolute inset-1 bg-primary text-on-primary rounded-xl p-2 shadow-lg z-10 overflow-hidden">
                              <p className="text-[10px] font-black truncate">{session.title}</p>
                              <p className="text-[8px] opacity-80 truncate">{session.time}</p>
                            </div>
                          )}
                          {unavailable && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                              <X size={24} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface-container-low rounded-[40px] p-8 border border-outline-variant/30 shadow-2xl"
            >
              <h3 className="text-2xl font-black text-on-surface mb-6">Book Session</h3>
              <p className="text-sm text-on-surface-variant mb-6">
                Booking for {selectedSlot && format(selectedSlot.date, 'EEEE, MMM d')} at {selectedSlot?.time}
              </p>
              
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Student</label>
                  <select 
                    required
                    value={bookingData.studentId}
                    onChange={(e) => setBookingData({...bookingData, studentId: e.target.value})}
                    className="w-full px-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select a student</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Course</label>
                  <select 
                    required
                    value={bookingData.courseId}
                    onChange={(e) => setBookingData({...bookingData, courseId: e.target.value})}
                    className="w-full px-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select a course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Session Title (Optional)</label>
                  <input 
                    type="text"
                    value={bookingData.title}
                    onChange={(e) => setBookingData({...bookingData, title: e.target.value})}
                    placeholder="e.g. Exam Prep"
                    className="w-full px-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 py-4 bg-surface-container-high text-on-surface font-bold rounded-2xl hover:bg-surface-container-highest transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-primary text-on-primary font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Schedule = () => {
  const { sessions, role, courses } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());

  const activeCourseIds = courses.slice(0, 3).map(c => c.id);
  const activeSessions = sessions.filter(s => s.courseId && activeCourseIds.includes(s.courseId));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-7xl mx-auto"
    >
      <Header title="Schedule" role={role || 'student'} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-low rounded-[40px] p-8 border border-outline-variant/30 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-black text-on-surface">{format(currentDate, 'MMMM yyyy')}</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="p-2 rounded-xl hover:bg-surface-container-high text-on-surface-variant transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="p-2 rounded-xl hover:bg-surface-container-high text-on-surface-variant transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-6">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={`sched-cal-${d}-${i}`} className="text-xs font-black text-on-surface-variant/50 uppercase tracking-widest">{d}</span>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center">
              {calendarDays.map((day, i) => {
                const isSelected = isSameDay(day, currentDate);
                const hasSession = sessions.some(s => isSameDay(new Date(s.date), day));
                
                return (
                  <button 
                    key={i} 
                    onClick={() => setCurrentDate(day)}
                    className={`aspect-square rounded-2xl text-sm font-black flex flex-col items-center justify-center relative transition-all ${
                      isSelected ? 'bg-primary text-on-primary shadow-xl scale-110 z-10' : 'hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    {format(day, 'd')}
                    {hasSession && !isSelected && <span className="absolute bottom-2 w-1.5 h-1.5 bg-primary rounded-full"></span>}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-2">
              <button 
                onClick={() => setCurrentDate(subYears(currentDate, 1))}
                className="py-3 bg-surface-container-high rounded-xl text-xs font-bold text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft size={14} /> Year
              </button>
              <button 
                onClick={() => setCurrentDate(addYears(currentDate, 1))}
                className="py-3 bg-surface-container-high rounded-xl text-xs font-bold text-on-surface-variant hover:text-on-surface transition-all flex items-center justify-center gap-2"
              >
                Year <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold text-on-surface">Upcoming Sessions</h4>
          </div>

          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div key={session.id} className={`p-6 rounded-[32px] border transition-all ${
                session.status === 'upcoming' 
                  ? 'bg-surface-container-lowest border-primary/20 shadow-sm hover:shadow-md' 
                  : 'bg-surface-container-low border-outline-variant/30 opacity-70'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex flex-col items-center justify-center px-6 py-4 bg-surface-container-high rounded-2xl min-w-[100px] border border-outline-variant/10">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{session.date.split(',')[0]}</span>
                    <span className="text-3xl font-black text-on-surface">{session.date.includes('Today') ? '24' : session.date.split(' ').pop()}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
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
                          <span className="font-bold text-on-surface">{session.time} • {session.duration} min</span>
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

                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch gap-3">
                    {session.status !== 'upcoming' && (
                      <button className="px-6 py-3 bg-surface-container-highest text-on-surface-variant rounded-2xl font-black text-sm flex items-center justify-center gap-2 border border-outline-variant/20 hover:bg-surface-container-high transition-all">
                        <Play size={16} /> Watch Recording
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      <Header title="Resources" role={role || 'student'} />

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
                  className="bg-surface-container-low rounded-[32px] border border-outline-variant/30 overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all"
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
                  className="bg-surface-container-low p-6 rounded-[32px] border border-outline-variant/30 flex flex-col items-center text-center group cursor-pointer hover:border-primary/30 hover:shadow-lg transition-all"
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

const Profile = () => {
  const { role } = useData();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <Header title="Profile" role={role || 'student'} />
      
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
  const { courses, sessions, students } = useData();
  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');

  const stats = [
    { label: 'Total Students', value: '156', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Students', value: '42', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Students', value: students.length.toString(), icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Active Courses', value: courses.length.toString(), icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Header title="Tutor Dashboard" role="tutor" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface-container-low p-6 rounded-[32px] border border-outline-variant/30 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-on-surface">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-on-surface">Upcoming Sessions</h4>
            <Link to="/schedule" className="text-sm font-bold text-primary hover:underline">View Full Schedule</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSessions.slice(0, 4).map((session) => (
              <div key={session.id} className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/30 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">{session.date.split(' ')[1]}</span>
                  <span className="text-xl font-black text-on-surface">{session.date.split(' ')[2]}</span>
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-on-surface">{session.title}</h5>
                  <p className="text-sm text-on-surface-variant">Student: {session.tutor} • {session.time}</p>
                </div>
                <button className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm">Start Session</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

const TutorCourses = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'High School' as Course['level'],
    tutor: '',
    image: '',
    icon: 'book'
  });

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      level: 'High School',
      tutor: '',
      image: '',
      icon: 'book'
    });
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Header title="Manage Courses" role="tutor" />
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
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

      <div className="bg-surface-container-low rounded-[40px] border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Course</th>
                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Level</th>
                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Tutor</th>
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
                      {course.level}
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
              className="relative w-full max-w-2xl bg-surface-container-low rounded-[40px] border border-outline-variant/30 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-high">
                <h3 className="text-2xl font-black text-on-surface">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-surface-container-highest transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
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
                      <option value="Elementary">Elementary</option>
                      <option value="High School">High School</option>
                      <option value="Uni">University</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Tutor Name</label>
                    <input 
                      type="text" 
                      value={formData.tutor}
                      onChange={(e) => setFormData({...formData, tutor: e.target.value})}
                      placeholder="e.g. Dr. Aris Thorne"
                      className="w-full px-5 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
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

                <div className="pt-4 flex gap-4">
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
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TutorStudents = () => {
  const { 
    students, courses, sessions, feedback, resources,
    addStudent, updateStudent, deleteStudent,
    addSession, deleteSession, addResource, deleteResource, addFeedback, deleteFeedback
  } = useData();
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '' });
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent({ ...newStudent, enrolledCourseIds: [], lastActivity: 'Just now' });
    setNewStudent({ name: '', email: '' });
    setShowAddStudent(false);
  };

  const toggleCourse = (studentId: string, courseId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const isEnrolled = student.enrolledCourseIds.includes(courseId);
    const newEnrolledIds = isEnrolled 
      ? student.enrolledCourseIds.filter(id => id !== courseId)
      : [...student.enrolledCourseIds, courseId];
    
    updateStudent(studentId, { enrolledCourseIds: newEnrolledIds });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center justify-between mb-8">
        <Header title="Students" role="tutor" />
        <button 
          onClick={() => setShowAddStudent(true)}
          className="px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-2"
        >
          <PlusCircle size={20} /> Add Student
        </button>
      </div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddStudent(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface-container-low rounded-[40px] p-8 border border-outline-variant/30 shadow-2xl"
            >
              <h3 className="text-2xl font-black text-on-surface mb-6">Add New Student</h3>
              <form onSubmit={handleAddStudent} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    placeholder="e.g. Alice Johnson"
                    className="w-full px-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    placeholder="e.g. alice@student.edu"
                    className="w-full px-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddStudent(false)}
                    className="flex-1 py-4 bg-surface-container-high text-on-surface font-bold rounded-2xl hover:bg-surface-container-highest transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-primary text-on-primary font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="bg-surface-container-low rounded-[40px] border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Student</th>
                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Enrolled Courses</th>
                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Last Activity</th>
                <th className="px-8 py-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {students.map((student) => {
                const isExpanded = expandedStudentId === student.id;
                return (
                  <React.Fragment key={student.id}>
                    <tr 
                      className={`hover:bg-surface-container-lowest transition-colors cursor-pointer ${isExpanded ? 'bg-surface-container-lowest' : ''}`}
                      onClick={() => setExpandedStudentId(isExpanded ? null : student.id)}
                    >
                      <td className="px-8 py-6">
                        <div>
                          <p className="font-bold text-on-surface">{student.name}</p>
                          <p className="text-xs text-on-surface-variant">{student.email}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          {student.enrolledCourseIds.map(id => {
                            const course = courses.find(c => c.id === id);
                            return (
                              <span key={id} className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-md">
                                {course?.title || id}
                              </span>
                            );
                          })}
                          {student.enrolledCourseIds.length === 0 && (
                            <span className="text-[10px] text-on-surface-variant italic">No courses enrolled</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-on-surface-variant">{student.lastActivity}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if(confirm('Are you sure you want to remove this student?')) deleteStudent(student.id);
                            }}
                            className="p-2 text-on-surface-variant hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className={`p-2 rounded-full transition-all ${isExpanded ? 'bg-primary text-on-primary rotate-180' : 'bg-primary/5 text-primary'}`}>
                            <ChevronDown size={18} />
                          </div>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Row */}
                    <AnimatePresence>
                      {isExpanded && (
                        <tr>
                          <td colSpan={4} className="p-0 border-none">
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="bg-surface-container-lowest/50 border-t border-outline-variant/10"
                            >
                              <div className="p-8 space-y-8">
                                {/* Course Enrollment Management */}
                                <section>
                                  <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <BookOpen size={16} /> Course Enrollment
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {courses.map(course => {
                                      const isEnrolled = student.enrolledCourseIds.includes(course.id);
                                      return (
                                        <button 
                                          key={course.id}
                                          onClick={() => toggleCourse(student.id, course.id)}
                                          className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                                            isEnrolled 
                                              ? 'bg-primary/5 border-primary/30 text-primary' 
                                              : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-primary/30'
                                          }`}
                                        >
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{course.title}</p>
                                            <p className="text-[10px] uppercase tracking-wider opacity-70">{course.level}</p>
                                          </div>
                                          {isEnrolled ? <CheckCircle2 size={18} /> : <PlusCircle size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </section>

                                {/* Course Content Management */}
                                {student.enrolledCourseIds.length > 0 && (
                                  <section>
                                    <h4 className="text-sm font-black text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                                      <Settings size={16} /> Manage Student Content
                                    </h4>
                                    <div className="flex gap-4 mb-6 overflow-x-auto pb-2 no-scrollbar">
                                      {student.enrolledCourseIds.map(id => {
                                        const course = courses.find(c => c.id === id);
                                        return (
                                          <button 
                                            key={id}
                                            onClick={() => setSelectedCourseId(id)}
                                            className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                                              selectedCourseId === id 
                                                ? 'bg-secondary text-on-secondary shadow-lg' 
                                                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                                            }`}
                                          >
                                            {course?.title || id}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {selectedCourseId && (
                                      <div className="space-y-6 bg-surface-container-low/50 p-6 rounded-[32px] border border-outline-variant/20">
                                        <div className="flex items-center justify-between mb-2">
                                          <h5 className="text-lg font-bold text-on-surface">
                                            {courses.find(c => c.id === selectedCourseId)?.title} - Content
                                          </h5>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                          {/* Videos & Notes */}
                                          <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                              <h6 className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Videos & Notes</h6>
                                              <button 
                                                onClick={() => {
                                                  const title = prompt('Session Title:');
                                                  if(title) addSession({ 
                                                    courseId: selectedCourseId, 
                                                    studentId: student.id,
                                                    title, 
                                                    tutor: 'Dr. Aris Thorne', 
                                                    date: 'Today', 
                                                    time: '4:00 PM', 
                                                    duration: 60, 
                                                    status: 'completed', 
                                                    type: 'video', 
                                                    modality: 'online' 
                                                  });
                                                }}
                                                className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                              >
                                                <PlusCircle size={16} />
                                              </button>
                                            </div>
                                            <div className="space-y-2">
                                              {sessions.filter(s => s.courseId === selectedCourseId && s.studentId === student.id).map(session => (
                                                <div key={session.id} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                                                  <div className="flex items-center gap-3">
                                                    <Play size={14} className="text-primary" />
                                                    <span className="text-sm font-medium">{session.title}</span>
                                                  </div>
                                                  <button onClick={() => deleteSession(session.id)} className="text-on-surface-variant hover:text-red-600">
                                                    <Trash2 size={14} />
                                                  </button>
                                                </div>
                                              ))}
                                            </div>
                                          </div>

                                          {/* Resources */}
                                          <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                              <h6 className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Resources</h6>
                                              <button 
                                                onClick={() => {
                                                  const title = prompt('Resource Title:');
                                                  if(title) addResource({ 
                                                    courseId: selectedCourseId, 
                                                    studentId: student.id,
                                                    title, 
                                                    type: 'pdf', 
                                                    icon: 'picture_as_pdf' 
                                                  });
                                                }}
                                                className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                              >
                                                <PlusCircle size={16} />
                                              </button>
                                            </div>
                                            <div className="space-y-2">
                                              {resources.filter(r => r.courseId === selectedCourseId && r.studentId === student.id).map(res => (
                                                <div key={res.id} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                                                  <div className="flex items-center gap-3">
                                                    <FileText size={14} className="text-primary" />
                                                    <span className="text-sm font-medium">{res.title}</span>
                                                  </div>
                                                  <button onClick={() => deleteResource(res.id)} className="text-on-surface-variant hover:text-red-600">
                                                    <Trash2 size={14} />
                                                  </button>
                                                </div>
                                              ))}
                                            </div>
                                          </div>

                                          {/* Feedback */}
                                          <div className="space-y-4 lg:col-span-2">
                                            <div className="flex items-center justify-between">
                                              <h6 className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Feedback</h6>
                                              <button 
                                                onClick={() => {
                                                  const text = prompt('Feedback Text:');
                                                  if(text) addFeedback({ 
                                                    courseId: selectedCourseId, 
                                                    studentId: student.id,
                                                    tutor: 'Dr. Aris Thorne', 
                                                    text, 
                                                    date: 'Today' 
                                                  });
                                                }}
                                                className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                              >
                                                <PlusCircle size={16} />
                                              </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              {feedback.filter(f => f.courseId === selectedCourseId && f.studentId === student.id).map(f => (
                                                <div key={f.id} className="p-4 bg-tertiary-container/10 rounded-xl border border-tertiary/10 relative group">
                                                  <p className="text-xs text-tertiary/80 italic mb-2">"{f.text}"</p>
                                                  <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">{f.date}</span>
                                                    <button onClick={() => deleteFeedback(f.id)} className="text-tertiary/60 hover:text-red-600">
                                                      <Trash2 size={12} />
                                                    </button>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </section>
                                )}
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const Login = ({ onLogin }: { onLogin: (role: string) => void }) => {
  const [role, setRole] = useState<'student' | 'tutor'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin(role);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-surface p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface-container-low rounded-[40px] p-8 md:p-10 border border-outline-variant/30 shadow-2xl relative z-10"
      >
        <div className="mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-on-primary mb-6 shadow-lg shadow-primary/20">
            <BrainCircuit size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-on-surface mb-2">DM - Tutoring</h1>
          <p className="text-on-surface-variant">Elevate your academic journey</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-surface-container-high p-1.5 rounded-2xl mb-8 border border-outline-variant/20">
          <button 
            onClick={() => setRole('student')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              role === 'student' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Student
          </button>
          <button 
            onClick={() => setRole('tutor')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              role === 'tutor' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Tutor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mateo@scholar.edu"
                className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
              <button type="button" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Forgot Password?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={20} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Sign In as {role.charAt(0).toUpperCase() + role.slice(1)} <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div className="mt-10">
          <p className="text-sm text-on-surface-variant">
            New to DM - Tutoring? <button className="text-primary font-bold hover:underline">Create an account</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { role: userRole, setRole: setUserRole } = useData();

  const handleLogin = (role: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

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
              
              <main className="flex-1 p-4 md:p-8 lg:p-12 pb-24 lg:pb-12 overflow-x-hidden">
                <AnimatePresence mode="wait">
                  <Routes>
                    {userRole === 'tutor' ? (
                      <>
                        <Route path="/" element={<TutorDashboard />} />
                        <Route path="/courses" element={<TutorCourses />} />
                        <Route path="/students" element={<TutorStudents />} />
                        <Route path="/schedule" element={<TutorSchedule />} />
                        <Route path="/analytics" element={<TutorAnalytics />} />
                        <Route path="/profile" element={<Profile />} />
                      </>
                    ) : (
                      <>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/schedule" element={<Schedule />} />
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
