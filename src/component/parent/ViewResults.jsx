import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { 
  FaGraduationCap, 
  FaDownload, 
  FaEye,
  FaCalendarAlt,
  FaBook,
  FaUser,
  FaTrophy,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaMinus
} from "react-icons/fa";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";

const ViewResults = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { user } = useSelector((state) => state.auth);
  const { childId } = useParams();

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

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (childId) {
      setSelectedChild(childId);
    }
  }, [childId]);

  useEffect(() => {
    if (selectedChild && selectedTerm && selectedSession) {
      fetchResults();
    }
  }, [selectedChild, selectedTerm, selectedSession]);

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${baseUrl}/parent/children`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setChildren(response.data.children || []);
    } catch (error) {
      console.error("Error fetching children:", error);
      // Demo data for development
      setChildren([
        {
          _id: "1",
          firstName: "John",
          surName: "Doe",
          admissionNumber: "JSS/001/2024",
          classLevel: "JSS 1A",
          currentSession: "2024/2025",
          currentTerm: "first"
        },
        {
          _id: "2",
          firstName: "Jane",
          surName: "Doe",
          admissionNumber: "JSS/002/2024",
          classLevel: "JSS 2B",
          currentSession: "2024/2025",
          currentTerm: "first"
        }
      ]);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${baseUrl}/parent/results/${selectedChild}?term=${selectedTerm}&session=${selectedSession}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setResults(response.data.results || []);
      setSummary(response.data.summary || {});
    } catch (error) {
      console.error("Error fetching results:", error);
      // Demo data for development
      const demoResults = [
        {
          _id: "1",
          subject: "Mathematics",
          examScore: 85,
          caScores: { test1: 18, test2: 16, assignment: 8, project: 9 },
          totalCA: 51,
          totalScore: 136,
          percentage: 68,
          grade: "B",
          remark: "Very Good",
          position: 5,
          classAverage: 65
        },
        {
          _id: "2",
          subject: "English Language",
          examScore: 78,
          caScores: { test1: 16, test2: 17, assignment: 9, project: 8 },
          totalCA: 50,
          totalScore: 128,
          percentage: 64,
          grade: "B",
          remark: "Very Good",
          position: 8,
          classAverage: 62
        },
        {
          _id: "3",
          subject: "Basic Science",
          examScore: 92,
          caScores: { test1: 19, test2: 18, assignment: 10, project: 9 },
          totalCA: 56,
          totalScore: 148,
          percentage: 74,
          grade: "A",
          remark: "Excellent",
          position: 2,
          classAverage: 68
        },
        {
          _id: "4",
          subject: "Social Studies",
          examScore: 70,
          caScores: { test1: 15, test2: 14, assignment: 7, project: 8 },
          totalCA: 44,
          totalScore: 114,
          percentage: 57,
          grade: "C",
          remark: "Good",
          position: 12,
          classAverage: 59
        }
      ];
      
      setResults(demoResults);
      setSummary({
        totalSubjects: 4,
        totalScore: 526,
        averageScore: 65.75,
        overallGrade: "B",
        overallPosition: 6,
        classSize: 35,
        passedSubjects: 4,
        failedSubjects: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A": return "bg-green-100 text-green-800";
      case "B": return "bg-blue-100 text-blue-800";
      case "C": return "bg-yellow-100 text-yellow-800";
      case "D": return "bg-orange-100 text-orange-800";
      case "E": return "bg-red-100 text-red-800";
      case "F": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceIcon = (studentScore, classAverage) => {
    if (studentScore > classAverage) {
      return <FaArrowUp className="text-green-600" />;
    } else if (studentScore < classAverage) {
      return <FaArrowDown className="text-red-600" />;
    } else {
      return <FaMinus className="text-gray-600" />;
    }
  };

  const selectedChildData = children.find(child => child._id === selectedChild);

  const downloadResult = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `${baseUrl}/parent/results/${selectedChild}/download?term=${selectedTerm}&session=${selectedSession}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedChildData?.firstName}_${selectedChildData?.surName}_Result_${selectedTerm}_${selectedSession}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading result:", error);
      alert("Failed to download result. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Academic Results</h1>
        <p className="text-gray-600">
          View your children's academic performance and progress reports.
        </p>
      </div>

      {/* Selection Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Result Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline mr-1" />
              Child *
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select Child</option>
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.firstName} {child.surName} - {child.classLevel}
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
        </div>
      </div>

      {/* Results Summary */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Average</p>
                <p className="text-2xl font-bold text-blue-600">
                  {summary.averageScore?.toFixed(1)}%
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaChartLine className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Grade</p>
                <p className="text-2xl font-bold text-green-600">
                  {summary.overallGrade}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaGraduationCap className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Class Position</p>
                <p className="text-2xl font-bold text-purple-600">
                  {summary.overallPosition}/{summary.classSize}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaTrophy className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subjects Passed</p>
                <p className="text-2xl font-bold text-orange-600">
                  {summary.passedSubjects}/{summary.totalSubjects}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FaBook className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      {selectedChild && selectedTerm && selectedSession && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Subject Results
            </h2>
            {results.length > 0 && (
              <button
                onClick={downloadResult}
                className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaDownload className="mr-2" />
                Download Result
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CA (60)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam (100)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total (160)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {result.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {result.totalCA}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {result.examScore}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {result.totalScore}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {result.percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(result.grade)}`}>
                          {result.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {result.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getPerformanceIcon(result.percentage, result.classAverage)}
                          <span className="ml-2 text-sm text-gray-600">
                            vs {result.classAverage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FaGraduationCap className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600">
                No results available for the selected term and session.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewResults;