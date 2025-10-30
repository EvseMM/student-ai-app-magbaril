import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Edit, Trash2, X, Save, ArrowLeft, Sparkles } from "lucide-react";
import Supabase from "../lib/supabase.js";

export default function SubjectPage() {
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ code: "", name: "", instructor: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // detected DB column keys (will try to infer)
  const [dbKeys, setDbKeys] = useState({
    codeKey: "subject_code",
    nameKey: "subject_name",
    instructorKey: "instructor",
  });

  const fallbackData = [
    { id: 1, subject_code: "CS101", subject_name: "Introduction to Programming", instructor: "Prof. John Smith" },
    { id: 2, subject_code: "CS102", subject_name: "Data Structures and Algorithms", instructor: "Prof. Maria Garcia" },
    { id: 3, subject_code: "IT201", subject_name: "Web Development Fundamentals", instructor: "Prof. Pedro Santos" },
    { id: 4, subject_code: "IT301", subject_name: "Database Management Systems", instructor: "Prof. Ana Cruz" },
  ];

  useEffect(() => {
    if (!Supabase) {
      console.warn("Supabase client not available. Using local fallback data.");
      setSubjects(fallbackData);
      return;
    }
    fetchSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper to pick DB column key for a guessed purpose
  function pickKey(keys, patterns) {
    for (const p of patterns) {
      const found = keys.find((k) => new RegExp(p, "i").test(k));
      if (found) return found;
    }
    return null;
  }

  async function fetchSubjects() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await Supabase.from("subjects").select("*").order("id", { ascending: true });
      if (fetchError) throw fetchError;

      if (!data || data.length === 0) {
        // no rows — keep fallback but still set reasonable defaults
        setSubjects([]);
        setDbKeys({
          codeKey: "subject_code",
          nameKey: "subject_name",
          instructorKey: "instructor",
        });
        return;
      }

      // infer column names from the first row keys
      const keys = Object.keys(data[0]);

      const codeKey = pickKey(keys, ["subject.?code", "\\bcode\\b", "subjects?_code"]);
      const nameKey = pickKey(keys, ["subject.?name", "\\bname\\b"]);
      const instructorKey = pickKey(keys, ["instructor", "teacher", "lecturer"]);

      setDbKeys({
        codeKey: codeKey || "subject_code",
        nameKey: nameKey || "subject_name",
        instructorKey: instructorKey || "instructor",
      });

      setSubjects(data);
    } catch (err) {
      console.error("Fetch subjects error:", err);
      setError("Failed to load subjects");
      setSubjects(fallbackData);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        code: subject[dbKeys.codeKey] ?? subject.subject_code ?? "",
        name: subject[dbKeys.nameKey] ?? subject.subject_name ?? "",
        instructor: subject[dbKeys.instructorKey] ?? subject.instructor ?? "",
      });
    } else {
      setEditingSubject(null);
      setFormData({ code: "", name: "", instructor: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
    setFormData({ code: "", name: "", instructor: "" });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) return alert("Please fill required fields.");

    if (!Supabase) {
      if (editingSubject) {
        setSubjects(subjects.map((s) => (s.id === editingSubject.id ? { ...s, subject_code: formData.code, subject_name: formData.name, instructor: formData.instructor } : s)));
      } else {
        const newSubject = { ...formData, id: Math.max(0, ...subjects.map((s) => s.id)) + 1, subject_code: formData.code, subject_name: formData.name };
        setSubjects([...subjects, newSubject]);
      }
      handleCloseModal();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const codeKey = dbKeys.codeKey || "subject_code";
      const nameKey = dbKeys.nameKey || "subject_name";
      const instructorKey = dbKeys.instructorKey || "instructor";

      if (editingSubject) {
        const updates = {
          [codeKey]: formData.code,
          [nameKey]: formData.name,
          [instructorKey]: formData.instructor,
        };
        const { data, error: updateError } = await Supabase.from("subjects")
          .update(updates)
          .eq("id", editingSubject.id)
          .select();
        if (updateError) throw updateError;
        const updated = (data && data[0]) || null;
        if (updated) {
          setSubjects((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        } else {
          await fetchSubjects();
        }
      } else {
        const insertRow = {
          [codeKey]: formData.code,
          [nameKey]: formData.name,
          [instructorKey]: formData.instructor,
        };
        const { data, error: insertError } = await Supabase.from("subjects")
          .insert([insertRow])
          .select();
        if (insertError) throw insertError;
        if (data && data.length) {
          setSubjects((prev) => [...prev, ...data]);
        } else {
          await fetchSubjects();
        }
      }
      handleCloseModal();
    } catch (err) {
      console.error("Save subject error:", err);
      // show clear guidance when column not found
      if (err?.code === "PGRST204") {
        setError("Database column not found. Check your 'subjects' table column names (e.g. subject_code / subject_name / instructor).");
        alert("Save failed: column not found. Inspect your Supabase table column names and update dbKeys in the page or rename columns to subject_code / subject_name / instructor.");
      } else {
        setError("Failed to save subject");
        alert("Error saving subject. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    if (!Supabase) {
      setSubjects(subjects.filter((s) => s.id !== id));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error: delError } = await Supabase.from("subjects").delete().eq("id", id);
      if (delError) throw delError;
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete subject error:", err);
      setError("Failed to delete subject");
      alert("Error deleting subject. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // renderer helpers to read fields safely
  const read = (item, keyFallback) => item?.[keyFallback] ?? item?.subject_code ?? item?.subject_code ?? item?.subject_name ?? "";

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-slate-900 to-black">
      <nav className="sticky top-0 z-50 bg-slate-950 bg-opacity-80 backdrop-blur-xl border-b border-cyan-500 border-opacity-20 shadow-lg shadow-cyan-500/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="text-cyan-400" size={24} />
              <h1 className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Portfolio
              </h1>
            </div>
            <a href="/" className="text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-2 group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/50">
              <BookOpen className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-linear-to-r from-blue-300 to-indigo-400 bg-clip-text text-transparent">
                Subject Management
              </h2>
              <p className="text-slate-400 mt-1">Manage and view all subjects and courses</p>
            </div>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="group relative px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 transition-all hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <Plus size={20} />
              Add Subject
            </span>
          </button>
        </div>

        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-xl rounded-2xl border border-blue-500 border-opacity-20 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-blue-500/10 to-indigo-500/10 border-b border-blue-500 border-opacity-20">
                  <th className="px-6 py-4 text-left text-blue-400 font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-blue-400 font-semibold">Subject Code</th>
                  <th className="px-6 py-4 text-left text-blue-400 font-semibold">Subject Name</th>
                  <th className="px-6 py-4 text-left text-blue-400 font-semibold">Instructor</th>
                  <th className="px-6 py-4 text-center text-blue-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-400">Loading…</td></tr>
                ) : (
                  (subjects.length ? subjects : fallbackData).map((subject) => (
                    <tr key={subject.id} className="border-b border-slate-700 hover:bg-blue-500/5 transition-colors">
                      <td className="px-6 py-4 text-slate-300">{subject.id}</td>
                      <td className="px-6 py-4 text-blue-300 font-mono font-semibold">{read(subject, dbKeys.codeKey)}</td>
                      <td className="px-6 py-4 text-white font-medium">{read(subject, dbKeys.nameKey)}</td>
                      <td className="px-6 py-4 text-slate-300">{read(subject, dbKeys.instructorKey)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleOpenModal(subject)} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all hover:scale-110">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(subject.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all hover:scale-110">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {error && <tr><td colSpan="5" className="px-6 py-4 text-red-500 text-center">{error}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Total Subjects: <span className="text-blue-400 font-semibold">{subjects.length || fallbackData.length}</span>
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm p-4">
          <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl border border-blue-500 border-opacity-30 shadow-2xl shadow-blue-500/50 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-blue-500 border-opacity-20">
              <h3 className="text-2xl font-bold text-white">
                {editingSubject ? "Edit Subject" : "Add New Subject"}
              </h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <X className="text-slate-400 hover:text-white" size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-blue-400 font-semibold mb-2">Subject Code</label>
                <input type="text" name="code" value={formData.code} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all font-mono"
                  placeholder="e.g., CS101" />
              </div>

              <div>
                <label className="block text-blue-400 font-semibold mb-2">Subject Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                  placeholder="Enter subject name" />
              </div>

              <div>
                <label className="block text-blue-400 font-semibold mb-2">Instructor</label>
                <input type="text" name="instructor" value={formData.instructor} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                  placeholder="Enter instructor name" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/50 transition-all hover:scale-105 flex items-center justify-center gap-2">
                  <Save size={20} />
                  {editingSubject ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}