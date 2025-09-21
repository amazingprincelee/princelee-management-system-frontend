import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaGraduationCap, 
  FaClipboardList, 
  FaSave, 
  FaArrowLeft,
  FaUsers,
  FaBook,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle
} from "react-icons/fa";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";

const AddScores = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [scoreType, setScoreType] = useState("exam"); // exam or ca
  const [caType, setCaType] = useState(""); // test1, test2, assignment, project
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState({});
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Nigerian Education System grading
  const getGrade = (score) => {
    if (score >= 70) return { grade: "A", remark: "Excellent" };
    if (score >= 60) return { grade: "B", remark: "Very Good" };
    if (score >= 50) return { grade: "C", remark: "Good" };
    if (score >= 45) return { grade: "D", remark: "Pass" };
    if (score >= 40) return { grade: "E", remark: "Poor" };
    return { grade: "F", remark: "Fail" };
  };

  const terms = [
    { value: "first", label: "First Term" },
    { value: "second", label: "Second Term" },
    { value: "third", label: "Third Term" }
  ];

  const sessions = [
    { value: "2023/2024", label: "2023/2024" },
    { value: "2024/2025", label: "2024/2025" },
    { value: "2025/2026", label: "2025/2026" }
  ];

  const caTypes = [
    { value: "test1", label: "First Test", maxScore: 20 },
    { value: "test2", label: "Second Test", maxScore: 20 },
    { value: "assignment", label: "Assignment", maxScore: 10 },
    { value: "project", label: "Project", maxScore: 10 }
  ];

  useEffect(() => {
    fetchTeacherData();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      fetchStudents();
    }
  }, [selectedClass, selectedSubject]);

  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch teacher's classes and subjects
      const response = await axios.get(`${baseUrl}/teacher/classes-subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setClasses(response.data.classes || []);
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      // Demo data for development
      setClasses([
        { _id: "1", className: "JSS 1A", classLevel: "JSS 1" },
        { _id: "2", className: "JSS 1B", classLevel: "JSS 1" },
        { _id: "3", className: "JSS 2A", classLevel: "JSS 2" }
      ]);
      
      setSubjects([
        { _id: "1", subjectName: "Mathematics" },
        { _id: "2", subjectName: "English Language" },
        { _id: "3", subjectName: "Basic Science" }
      ]);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${baseUrl}/teacher/class/${selectedClass}/students?subject=${selectedSubject}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const studentsData = response.data.students || [];
      setStudents(studentsData);
      
      // Initialize scores object
      const initialScores = {};
      studentsData.forEach(student => {
        initialScores[student._id] = "";
      });
      setScores(initialScores);
      
    } catch (error) {
      console.error("Error fetching students:", error);
      // Demo data for development
      const demoStudents = [
        {
          _id: "1",
          firstName: "John",
          surName: "Doe",
          admissionNumber: "JSS/001/2024",
          currentScores: { exam: 0, ca: { test1: 0, test2: 0, assignment: 0, project: 0 } }
        },
        {
          _id: "2",
          firstName: "Jane",
          surName: "Smith",
          admissionNumber: "JSS/002/2024",
          currentScores: { exam: 0, ca: { test1: 0, test2: 0, assignment: 0, project: 0 } }
        },
        {
          _id: "3",
          firstName: "David",
          surName: "Johnson",
          admissionNumber: "JSS/003/2024",
          currentScores: { exam: 0, ca: { test1: 0, test2: 0, assignment: 0, project: 0 } }
        }
      ];
      
      setStudents(demoStudents);
      
      const initialScores = {};
      demoStudents.forEach(student => {
        initialScores[student._id] = "";
      });
      setScores(initialScores);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (studentId, score) => {
    const numericScore = parseFloat(score);
    const maxScore = scoreType === "exam" ? 100 : caTypes.find(ct => ct.value === caType)?.maxScore || 100;
    
    if (score === "" || (numericScore >= 0 && numericScore <= maxScore)) {
      setScores(prev => ({
        ...prev,
        [studentId]: score
      }));
    }
  };

  const handleSaveScores = async () => {
    // Validation
    if (!selectedClass || !selectedSubject || !selectedTerm || !selectedSession) {
      setMessage({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    if (scoreType === "ca" && !caType) {
      setMessage({ type: "error", text: "Please select CA type." });
      return;
    }

    // Check if all scores are entered
    const emptyScores = Object.values(scores).some(score => score === "");
    if (emptyScores) {
      setMessage({ type: "error", text: "Please enter scores for all students." });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      const scoresData = Object.entries(scores).map(([studentId, score]) => ({
        studentId,
        score: parseFloat(score),
        ...getGrade(parseFloat(score))
      }));

      const payload = {
        classId: selectedClass,
        subjectId: selectedSubject,
        term: selectedTerm,
        session: selectedSession,
        scoreType,
        caType: scoreType === "ca" ? caType : undefined,
        scores: scoresData
      };

      await axios.post(`${baseUrl}/teacher/scores`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: "success", text: "Scores saved successfully!" });
      
      // Reset form after successful save
      setTimeout(() => {
        setScores({});
        setMessage({ type: "", text: "" });
      }, 2000);

    } catch (error) {
      console.error("Error saving scores:", error);
      setMessage({ type: "error", text: "Failed to save scores. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const getMaxScore = () => {
    if (scoreType === "exam") return 100;
    return caTypes.find(ct => ct.value === caType)?.maxScore || 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {scoreType === "exam" ? "Add Exam Scores" : "Add CA Scores"}
            </h1>
            <p className="text-gray-600">
              Record {scoreType === "exam" ? "examination" : "continuous assessment"} scores for your students
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </div>
      </div>

      {/* Score Type Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Score Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setScoreType("exam")}
            className={`p-4 border-2 rounded-lg transition-all ${
              scoreType === "exam"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <FaGraduationCap className={`text-2xl mb-2 ${scoreType === "exam" ? "text-green-600" : "text-gray-400"}`} />
            <h3 className="font-medium text-gray-900">Examination</h3>
            <p className="text-sm text-gray-600">Main exam scores (Max: 100)</p>
          </button>
          
          <button
            onClick={() => setScoreType("ca")}
            className={`p-4 border-2 rounded-lg transition-all ${
              scoreType === "ca"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <FaClipboardList className={`text-2xl mb-2 ${scoreType === "ca" ? "text-green-600" : "text-gray-400"}`} />
            <h3 className="font-medium text-gray-900">Continuous Assessment</h3>
            <p className="text-sm text-gray-600">Tests, assignments, projects</p>
          </button>
        </div>
      </div>

      {/* Selection Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Score Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUsers className="inline mr-1" />
              Class *
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaBook className="inline mr-1" />
              Subject *
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-1" />
              Term *
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select Term</option>
              {terms.map((term) => (
                <option key={term.value} value={term.value}>
                  {term.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session *
            </label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select Session</option>
              {sessions.map((session) => (
                <option key={session.value} value={session.value}>
                  {session.label}
                </option>
              ))}
            </select>
          </div>

          {scoreType === "ca" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CA Type *
              </label>
              <select
                value={caType}
                onChange={(e) => setCaType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Select CA Type</option>
                {caTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} (Max: {type.maxScore})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === "success" 
            ? "bg-green-100 text-green-700 border border-green-200" 
            : "bg-red-100 text-red-700 border border-red-200"
        }`}>
          <div className="flex items-center">
            {message.type === "success" ? (
              <FaCheckCircle className="mr-2" />
            ) : (
              <FaExclamationTriangle className="mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Students Scores Table */}
      {students.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Enter Scores (Max: {getMaxScore()})
            </h2>
            <span className="text-sm text-gray-600">
              {students.length} students
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admission No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remark
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => {
                    const score = scores[student._id];
                    const gradeInfo = score ? getGrade(parseFloat(score)) : { grade: "-", remark: "-" };
                    
                    return (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.surName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {student.admissionNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max={getMaxScore()}
                            value={score}
                            onChange={(e) => handleScoreChange(student._id, e.target.value)}
                            className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            gradeInfo.grade === "A" ? "bg-green-100 text-green-800" :
                            gradeInfo.grade === "B" ? "bg-primary text-primary-800" :
                            gradeInfo.grade === "C" ? "bg-yellow-100 text-yellow-800" :
                            gradeInfo.grade === "D" ? "bg-orange-100 text-orange-800" :
                            gradeInfo.grade === "F" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {gradeInfo.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {gradeInfo.remark}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {students.length > 0 && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveScores}
                disabled={saving || Object.values(scores).some(score => score === "")}
                className="flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <FaSave className="mr-2" />
                )}
                {saving ? "Saving..." : "Save Scores"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddScores;