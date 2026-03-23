import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  User, 
  Search, 
  Bell, 
  ChevronRight, 
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
  ArrowUpRight
} from 'lucide-react';
import { COURSES, SESSIONS, FEEDBACK, RESOURCES } from './constants';
import { Course, Session, Feedback, Resource } from './types';

// --- Components ---

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: GraduationCap, label: 'Resources', path: '/resources' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-surface-container-low border-r border-outline-variant/30 p-6">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary">
          <BrainCircuit size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-primary">Serene Scholar</h1>
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
        <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 w-full text-left hover:bg-red-50 transition-colors">
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

const MobileNav = () => {
  const location = useLocation();
  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

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

const Header = ({ title }: { title: string }) => (
  <header className="flex items-center justify-between mb-8">
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-on-surface">{title}</h2>
      <p className="text-on-surface-variant mt-1">Welcome back, Mateo. Ready to excel?</p>
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

const Dashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto"
    >
      <Header title="Dashboard" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-primary p-8 text-on-primary">
            <div className="relative z-10 max-w-md">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles size={14} />
                Next Milestone
              </span>
              <h3 className="text-2xl font-bold mb-2">Master Organic Chemistry Mechanisms</h3>
              <p className="text-on-primary/80 mb-6 text-sm leading-relaxed">
                Your next session with Dr. Aris Thorne starts in 2 hours. Review the pre-read materials to maximize your learning.
              </p>
              <button className="px-6 py-3 bg-white text-primary rounded-xl font-bold text-sm hover:bg-primary-container transition-colors flex items-center gap-2">
                Join Session <ArrowRight size={18} />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
              <BrainCircuit className="w-full h-full transform translate-x-1/4 -translate-y-1/4" />
            </div>
          </section>

          {/* Recent Sessions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-on-surface">Recent Sessions</h4>
              <Link to="/schedule" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SESSIONS.filter(s => s.status === 'completed').map((session) => (
                <div key={session.id} className="group bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-video relative overflow-hidden">
                    <img src={session.image} alt={session.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                        <Play size={24} fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      {session.type === 'video' && <span className="px-2 py-1 rounded bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">Video</span>}
                      {session.type === 'both' && <span className="px-2 py-1 rounded bg-primary/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">Video + Notes</span>}
                    </div>
                  </div>
                  <div className="p-4">
                    <h5 className="font-bold text-on-surface group-hover:text-primary transition-colors">{session.title}</h5>
                    <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1.5">
                      <User size={12} /> {session.tutor} • {session.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Courses */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-on-surface">Recommended for You</h4>
              <Link to="/courses" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                Explore <ChevronRight size={16} />
              </Link>
            </div>
            <div className="space-y-3">
              {COURSES.slice(0, 3).map((course) => (
                <div key={course.id} className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-primary/30 transition-colors group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container text-secondary flex items-center justify-center">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-on-surface group-hover:text-primary transition-colors">{course.title}</h5>
                    <p className="text-xs text-on-surface-variant line-clamp-1">{course.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary-container/50 px-2 py-1 rounded-full">
                      {course.level}
                    </span>
                  </div>
                  <ChevronRight size={20} className="text-outline-variant group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Stats/Feedback */}
        <div className="space-y-8">
          {/* Progress Card */}
          <section className="bg-surface-container-high rounded-3xl p-6 border border-outline-variant/30">
            <h4 className="font-bold text-on-surface mb-6 flex items-center gap-2">
              <Star size={18} className="text-primary" /> Your Progress
            </h4>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-on-surface-variant font-medium">Study Hours</span>
                  <span className="text-on-surface font-bold">24 / 40h</span>
                </div>
                <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[60%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-on-surface-variant font-medium">Course Completion</span>
                  <span className="text-on-surface font-bold">82%</span>
                </div>
                <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[82%] rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-2xl text-center border border-outline-variant/20">
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Completed</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-2xl text-center border border-outline-variant/20">
                <p className="text-2xl font-bold text-secondary">4</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Ongoing</p>
              </div>
            </div>
          </section>

          {/* Tutor Feedback */}
          <section>
            <h4 className="text-lg font-bold text-on-surface mb-4">Tutor Feedback</h4>
            <div className="space-y-4">
              {FEEDBACK.map((item) => (
                <div key={item.id} className="p-4 bg-tertiary-container rounded-2xl border border-tertiary/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MessageSquare size={48} />
                  </div>
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <span className="text-xs font-bold text-tertiary">{item.tutor}</span>
                    <span className="text-[10px] text-tertiary/60 font-medium">{item.date}</span>
                  </div>
                  <p className="text-sm text-tertiary/80 italic leading-relaxed relative z-10">"{item.text}"</p>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Resources */}
          <section>
            <h4 className="text-lg font-bold text-on-surface mb-4">Quick Resources</h4>
            <div className="space-y-2">
              {RESOURCES.map((res) => (
                <div key={res.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">{res.title}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">{res.type} • {res.size || res.duration || `${res.itemsCount} items`}</p>
                  </div>
                  <ArrowUpRight size={16} className="text-outline-variant group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

const Courses = () => {
  const [activeTab, setActiveTab] = React.useState<'All' | 'Elementary' | 'High School' | 'Uni'>('All');
  
  const filteredCourses = activeTab === 'All' 
    ? COURSES 
    : COURSES.filter(c => c.level === activeTab);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-7xl mx-auto"
    >
      <Header title="Courses" />

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text" 
            placeholder="Search for subjects, tutors, or topics..." 
            className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
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
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <motion.div 
            layout
            key={course.id} 
            className="group bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer flex flex-col"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary-container text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <BookOpen size={28} />
            </div>
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary-container/50 px-2.5 py-1 rounded-full">
                {course.level}
              </span>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6 flex-1">{course.description}</p>
            <div className="flex items-center justify-between pt-6 border-t border-outline-variant/20">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <img 
                    key={i}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.id + i}`} 
                    className="w-7 h-7 rounded-full border-2 border-surface-container-lowest bg-surface-container-high"
                    alt="Tutor"
                    referrerPolicy="no-referrer"
                  />
                ))}
                <div className="w-7 h-7 rounded-full border-2 border-surface-container-lowest bg-surface-container-high flex items-center justify-center text-[8px] font-bold text-on-surface-variant">
                  +2
                </div>
              </div>
              <button className="p-2 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Schedule = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-7xl mx-auto"
    >
      <Header title="Schedule" />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/30">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-on-surface">October 2026</h4>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant"><ChevronRight size={18} className="rotate-180" /></button>
                <button className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant"><ChevronRight size={18} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <span key={d} className="text-[10px] font-bold text-on-surface-variant">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isToday = day === 24;
                const hasSession = [21, 24, 26, 28].includes(day);
                return (
                  <button 
                    key={i} 
                    className={`aspect-square rounded-xl text-xs font-semibold flex flex-col items-center justify-center relative transition-all ${
                      isToday ? 'bg-primary text-on-primary shadow-lg' : 'hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    {day}
                    {hasSession && !isToday && <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-primary-container/30 rounded-3xl p-6 border border-primary/10">
            <h4 className="font-bold text-primary mb-2">Weekly Goal</h4>
            <p className="text-sm text-primary/80 mb-4">You've completed 12/15 hours of study this week. Almost there!</p>
            <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[80%]"></div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold text-on-surface">Upcoming Sessions</h4>
            <button className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              <Calendar size={18} /> Book New Session
            </button>
          </div>

          <div className="space-y-4">
            {SESSIONS.map((session) => (
              <div key={session.id} className={`p-6 rounded-3xl border transition-all ${
                session.status === 'upcoming' 
                  ? 'bg-surface-container-lowest border-primary/20 shadow-sm' 
                  : 'bg-surface-container-low border-outline-variant/30 opacity-70'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex flex-col items-center justify-center px-6 py-4 bg-surface-container-high rounded-2xl min-w-[100px]">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{session.date.split(',')[0]}</span>
                    <span className="text-2xl font-black text-on-surface">{session.date.includes('Today') ? '24' : session.date.split(' ')[2]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-xl font-bold text-on-surface">{session.title}</h5>
                      {session.status === 'upcoming' && <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">Confirmed</span>}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                      <span className="flex items-center gap-1.5"><User size={16} /> {session.tutor}</span>
                      <span className="flex items-center gap-1.5"><Clock size={16} /> {session.time} ({session.duration} min)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {session.status === 'upcoming' ? (
                      <>
                        <button className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-all">Join Room</button>
                        <button className="p-3 rounded-xl bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"><Settings size={20} /></button>
                      </>
                    ) : (
                      <button className="px-6 py-3 bg-surface-container-highest text-on-surface-variant rounded-xl font-bold text-sm flex items-center gap-2">
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

const Profile = () => {
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
            <button className="absolute -bottom-2 -right-2 p-3 bg-primary text-on-primary rounded-2xl shadow-lg border-4 border-surface-container-low hover:scale-110 transition-transform">
              <Settings size={20} />
            </button>
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

// --- Main App Component ---

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-surface selection:bg-primary/20 selection:text-primary">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 lg:p-12 pb-24 lg:pb-12 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/profile" element={<Profile />} />
              {/* Fallback routes */}
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </AnimatePresence>
        </main>

        <MobileNav />
      </div>
    </Router>
  );
}
