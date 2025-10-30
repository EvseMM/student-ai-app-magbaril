import { GoogleGenAI } from "@google/genai";
import Supabase from "./supabase.js";

// ✅ Load Gemini API key from .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// ✅ Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: API_KEY });

// ✅ Ask AI (uses your specified generateContent structure)
export async function askAi(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello GradeAI, " + prompt,
      config: {
        systemInstruction: `
          You are GradeAI, an intelligent and professional academic assistant.
          Your role is to analyze student grade data and provide short, meaningful summaries.

          Guidelines:
          - Write in 3–5 sentences only.
          - Be encouraging, professional, and data-driven.
          - Mention trends, class strengths, and improvement areas.
          - Avoid lists, bullet points, or JSON.
          - Respond in natural paragraph form only.
        `,
      },
    });

    return response.text || "No response from AI.";
  } catch (err) {
    console.error("AI generation error:", err);
    return "AI generation failed.";
  }
}

/**
 * 🔹 Analyze students' performance for a given subject.
 * Combines Supabase data → AI analysis paragraph.
 */
export async function studentsAnalyzer(subjectId) {
  if (!subjectId) throw new Error("subjectId is required");

  try {
    // ✅ Fetch subject info
    const { data: subjectData } = await Supabase.from("subjects")
      .select("id, subject_name, subject_code")
      .eq("id", subjectId)
      .maybeSingle();

    const subjectName =
      subjectData?.subject_name ||
      subjectData?.subject_code ||
      `Subject ${subjectId}`;

    // ✅ Fetch students
    const { data: studentsData = [] } = await Supabase.from("students").select(
      "id, first_name, last_name, student_number"
    );

    // ✅ Fetch grades for that subject
    const { data: gradesData = [] } = await Supabase.from("grades")
      .select("student_id, subject_id, prelim, midterm, semifinal, final")
      .eq("subject_id", subjectId);

    // ✅ Map students and their grades
    const studentsMap = studentsData.reduce((acc, s) => {
      acc[s.id] = {
        id: s.id,
        first_name: s.first_name,
        last_name: s.last_name,
        student_number: s.student_number,
        grades: { prelim: null, midterm: null, semifinal: null, final: null },
      };
      return acc;
    }, {});

    gradesData.forEach((g) => {
      if (!studentsMap[g.student_id]) return;
      studentsMap[g.student_id].grades = {
        prelim: g.prelim,
        midterm: g.midterm,
        semifinal: g.semifinal,
        final: g.final,
      };
    });

    const roster = Object.values(studentsMap);

    // ✅ Compute averages + pass/fail
    const passedStudents = [];
    const failedStudents = [];

    roster.forEach((s) => {
      const grades = Object.values(s.grades)
        .map((n) => Number(n))
        .filter((n) => !isNaN(n));
      const avg = grades.length
        ? Number((grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2))
        : null;
      s._average = avg;
      const name = `${s.first_name} ${s.last_name}`.trim() || `Student ${s.id}`;
      if (avg !== null && avg <= 3.0) passedStudents.push(name);
      else if (avg !== null && avg > 3.0) failedStudents.push(name);
    });

    // ✅ AI prompt for Grade Report PDF
    const prompt = `
Analyze the following student grade data for ${subjectName}.

Grading System:
1.00–1.25 = Excellent
1.50–1.75 = Very Good
2.00–2.75 = Good
3.00 = Passing
4.00–5.00 = Failing

Provide a brief academic summary (3–5 sentences) describing:
- Overall class performance
- Trends or grade distribution
- Strengths and weaknesses
- Recommendations for improvement

Data:
${JSON.stringify(roster, null, 2)}
`;

    const aiText = await askAi(prompt);

    return {
      analysis: aiText.trim(),
      passedStudents,
      failedStudents,
    };
  } catch (err) {
    console.error("studentsAnalyzer error:", err);
    throw err;
  }
}
