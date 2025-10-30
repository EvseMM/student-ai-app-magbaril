import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { backgroundColor: "#fff", padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  header: { textAlign: "center", marginBottom: 20, color: "#0f172a" },
  title: { fontSize: 18, fontWeight: "bold", color: "#0e7490", marginBottom: 10 },
  section: { marginBottom: 15 },
  text: { lineHeight: 1.5, flexWrap: "wrap", wordWrap: "break-word" },
  table: { width: "100%", marginTop: 10, borderWidth: 1, borderColor: "#0e7490" },
  row: { flexDirection: "row", flexWrap: "nowrap" },
  cell: { 
    flex: 1, 
    padding: 4, 
    borderWidth: 1, 
    borderColor: "#0e7490", 
    flexShrink: 1, 
    flexGrow: 1, 
    wordWrap: "break-word",
    textAlign: "center",
  },
  cellHeader: { 
    flex: 1, 
    padding: 4, 
    borderWidth: 1, 
    borderColor: "#0e7490", 
    fontWeight: "bold", 
    backgroundColor: "#e0f2fe",
    textAlign: "center",
  },
});

export default function GradeReportPDF({ subjectName, aiOutput, grades, students }) {
  const { analysis, passedStudents, failedStudents } = aiOutput || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Grade Report</Text>
          <Text>{subjectName}</Text>
        </View>

        {/* Overall Analysis */}
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold" }}>Overall Analysis:</Text>
          <Text style={styles.text}>{analysis}</Text>
        </View>

        {/* Passed Students */}
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold" }}>Passed Students:</Text>
          <Text style={styles.text}>{passedStudents?.join(", ") || "None"}</Text>
        </View>

        {/* Failed Students */}
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold" }}>Failed Students:</Text>
          <Text style={styles.text}>{failedStudents?.join(", ") || "None"}</Text>
        </View>

        {/* Grades Table */}
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Grades Table:</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.row}>
              <Text style={styles.cellHeader}>Student Name</Text>
              <Text style={styles.cellHeader}>Student No.</Text>
              <Text style={styles.cellHeader}>Prelim</Text>
              <Text style={styles.cellHeader}>Midterm</Text>
              <Text style={styles.cellHeader}>Semifinal</Text>
              <Text style={styles.cellHeader}>Final</Text>
              <Text style={styles.cellHeader}>Average</Text>
            </View>

            {/* Table Body */}
            {students.map((s) => {
              const g = grades.find((gr) => gr.student_id === s.id) || {};
              return (
                <View style={styles.row} key={s.id}>
                  <Text style={styles.cell}>{s.first_name} {s.last_name}</Text>
                  <Text style={styles.cell}>{s.student_number || "N/A"}</Text>
                  <Text style={styles.cell}>{g.prelim ?? "-"}</Text>
                  <Text style={styles.cell}>{g.midterm ?? "-"}</Text>
                  <Text style={styles.cell}>{g.semifinal ?? "-"}</Text>
                  <Text style={styles.cell}>{g.final ?? "-"}</Text>
                  <Text style={styles.cell}>
                    {(() => {
                      const gradesList = [g.prelim, g.midterm, g.semifinal, g.final]
                        .map((n) => Number(n))
                        .filter((n) => !isNaN(n));
                      if (gradesList.length === 0) return "-";
                      const avg = (
                        gradesList.reduce((a, b) => a + b, 0) / gradesList.length
                      ).toFixed(2);
                      return avg;
                    })()}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}
