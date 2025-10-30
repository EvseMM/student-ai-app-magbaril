import React, { useEffect, useState } from "react";
import { GraduationCap, BookOpen, Award, Sparkles, Rocket } from "lucide-react";
import supabase from "../lib/supabase";

export default function LandingPage() {
  const [studentCount, setStudentCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [gradeCount, setGradeCount] = useState(0);

  const fetchCounts = async () => {
    try {
      const [students, subjects, grades] = await Promise.all([
        supabase.from("students").select("*", { count: "exact" }),
        supabase.from("subjects").select("*", { count: "exact" }),
        supabase.from("grades").select("*", { count: "exact" }),
      ]);

      setStudentCount(students.count);
      setSubjectCount(subjects.count);
      setGradeCount(grades.count);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase client not available — skipping fetchCounts');
      return;
    }
    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-slate-900 to-black">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950 bg-opacity-80 backdrop-blur-xl border-b border-cyan-500 border-opacity-20 shadow-lg shadow-cyan-500/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="text-cyan-400" size={24} />
              <h1 className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Portfolio
              </h1>
            </div>
            <div className="flex gap-8">
              <a href="/students" className="text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-2 group">
                <GraduationCap size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">Students</span>
              </a>
              <a href="/subjects" className="text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-2 group">
                <BookOpen size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">Subjects</span>
              </a>
              <a href="/grades" className="text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-2 group">
                <Award size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">Grades</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          {/* Profile Image */}
          <div className="inline-block mb-8 relative">
            <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative w-48 h-48 rounded-full bg-linear-to-br from-cyan-400 via-blue-500 to-indigo-600 p-1 shadow-2xl shadow-cyan-500/50">
                <img className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-5xl border-2 border-slate-900" src="https://scontent.fcrk3-4.fna.fbcdn.net/v/t39.30808-6/552680692_768512915958061_616744676019837975_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFjgJMrkvKmgyK0T2ou9hwHbdaIyN0nTLZt1ojI3SdMth58mOFDSPZjusKXA1OxZE67JMh5aauRDSZYDMZ5NQCp&_nc_ohc=tr2Abe2Svj4Q7kNvwG9usy2&_nc_oc=Adlb60Snc-NW4EnHU1649WiMl1LX735Y0TMsSAgYVMdnXDWvSrCp6xL3hoCzKzAyZTs&_nc_zt=23&_nc_ht=scontent.fcrk3-4.fna&_nc_gid=1U44WvuUru2rjxBGvjTUYw&oh=00_Afe2RZ4y92-QL4d_ATqO9JJ5ystnsCVO_0cMab6gioIKNg&oe=69064360" alt="user.png" />
            </div>
          </div>

          {/* Introduction */}
          <div className="space-y-4 mb-10">
            <h2 className="text-6xl md:text-7xl font-extrabold bg-linear-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight">
              Charlie T. Gadapan
            </h2>
            <p className="text-2xl text-cyan-300 font-light tracking-wide">
              IT Student & Aspiring Developer
            </p>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Building digital experiences with passion and precision. Transforming ideas into elegant solutions.
            </p>
          </div>

          {/* Modern Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/students" className="group relative px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/70 transition-all hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center gap-2">
                <GraduationCap size={20} />
                Explore Students
              </span>
            </a>
            <a href="/subjects" className="group relative px-8 py-4 bg-slate-800 text-white rounded-xl font-semibold border-2 border-cyan-500 hover:bg-slate-700 transition-all hover:scale-105 shadow-lg">
              <span className="flex items-center gap-2">
                <BookOpen size={20} />
                View Subjects
              </span>
            </a>
            <a href="/grades" className="group relative px-8 py-4 bg-transparent text-cyan-400 rounded-xl font-semibold border-2 border-cyan-400 hover:bg-cyan-400 hover:text-slate-900 transition-all hover:scale-105">
              <span className="flex items-center gap-2">
                <Award size={20} />
                Check Grades
              </span>
            </a>
          </div>
        </div>

        {/* IT Journey Section */}
        <div className="mt-32 mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <Rocket className="text-cyan-400" size={36} />
              <h3 className="text-4xl font-bold bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                My IT Journey
              </h3>
            </div>
            <p className="text-slate-400 text-lg">From beginner to builder</p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            {/* Vertical Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-linear-to-b from-cyan-500 via-blue-500 to-indigo-500 opacity-30"></div>
            
            {/* Timeline Items */}
            <div className="space-y-16">
              {/* First Year */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right">
                  <div className="inline-block md:block bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-cyan-500 border-opacity-30 hover:border-opacity-60 transition-all hover:shadow-2xl hover:shadow-cyan-500/30 group">
                    <h4 className="text-3xl font-bold text-white mb-2 justify-content-left flex">First Year</h4>
                    <p className="text-cyan-400 font-semibold mb-4 justify-content-left flex">The Beginning</p>
                    <p className="text-slate-300 leading-relaxed">
                      My journey started with curiosity and excitement. Learning the fundamentals of programming, writing my first "Hello World", and discovering the magic of making computers execute my instructions. Every bug taught me patience and problem-solving.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center md:justify-start">
                  <div className="relative z-10 w-20 h-20 bg-linear-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50 ring-8 ring-slate-900">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                </div>
              </div>

              {/* Second Year */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:col-start-2">
                  <div className="inline-block md:block bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-blue-500 border-opacity-30 hover:border-opacity-60 transition-all hover:shadow-2xl hover:shadow-blue-500/30 group">
                    <h4 className="text-3xl font-bold text-white mb-2">Second Year</h4>
                    <p className="text-blue-400 font-semibold mb-4">Building Foundations</p>
                    <p className="text-slate-300 leading-relaxed">
                      Diving deeper into data structures and algorithms. Understanding how software works under the hood. Object-oriented programming became my playground, and I started building projects that solved real problems.
                    </p>
                  </div>
                </div>
                <div className="md:col-start-1 md:row-start-1 flex justify-center md:justify-end">
                  <div className="relative z-10 w-20 h-20 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 ring-8 ring-slate-900">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                </div>
              </div>

              {/* Third Year */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right">
                  <div className="inline-block md:block bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-indigo-500 border-opacity-30 hover:border-opacity-60 transition-all hover:shadow-2xl hover:shadow-indigo-500/30 group">
                    <h4 className="text-3xl font-bold text-white mb-2 justify-content-left flex">Third Year</h4>
                    <p className="text-indigo-400 font-semibold mb-4 justify-content-left flex">Specialization</p>
                    <p className="text-slate-300 leading-relaxed">
                      Exploring web development and modern frameworks. Building full-stack applications, student management systems, and interactive interfaces. Learning about architecture, user experience, and clean code principles.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center md:justify-start">
                  <div className="relative z-10 w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/50 ring-8 ring-slate-900">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <a href="/students" className="group relative bg-linear-to-br from-cyan-600 to-cyan-800 rounded-2xl p-8 overflow-hidden hover:scale-105 transition-transform shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/50">
            <div className="absolute inset-0 bg-linear-to-t from-black to-transparent opacity-20"></div>
            <div className="relative">
              <GraduationCap className="text-white mb-4 group-hover:scale-110 transition-transform" size={48} />
              <h4 className="text-2xl font-bold text-white mb-2">Students</h4>
              <p className="text-cyan-100">Manage and view student information</p>
            </div>
          </a>

          <a href="/subjects" className="group relative bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl p-8 overflow-hidden hover:scale-105 transition-transform shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50">
            <div className="absolute inset-0 bg-linear-to-t from-black to-transparent opacity-20"></div>
            <div className="relative">
              <BookOpen className="text-white mb-4 group-hover:scale-110 transition-transform" size={48} />
              <h4 className="text-2xl font-bold text-white mb-2">Subjects</h4>
              <p className="text-blue-100">Browse available courses and subjects</p>
            </div>
          </a>

          <a href="/grades" className="group relative bg-linear-to-br from-indigo-600 to-indigo-800 rounded-2xl p-8 overflow-hidden hover:scale-105 transition-transform shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/50">
            <div className="absolute inset-0 bg-linear-to-t from-black to-transparent opacity-20"></div>
            <div className="relative">
              <Award className="text-white mb-4 group-hover:scale-110 transition-transform" size={48} />
              <h4 className="text-2xl font-bold text-white mb-2">Grades</h4>
              <p className="text-indigo-100">Track academic performance and grades</p>
            </div>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-cyan-500 border-opacity-20 mt-32">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <p className="text-slate-400">© 2025 Your Name. Built with React and Tailwind CSS.</p>
          <p className="text-slate-500 text-sm mt-2">Crafted with passion and precision</p>
        </div>
      </footer>
    </div>
  );
}