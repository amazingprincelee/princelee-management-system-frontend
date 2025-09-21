import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaDownload, FaEye, FaCalculator, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

const GenerateResults = () => {
  const { user } = useSelector((state) => state.auth);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  // Nigerian Education Scheme Grading System
  const getGrade = (score) => {
    if (score >= 70) return { grade: 'A', remark: 'Excellent', points: 5 };
    if (score >= 60) return { grade: 'B', remark: 'Very Good', points: 4 };
    if (score >= 50) return { grade: 'C', remark: 'Good', points: 3 };
    if (score >= 45) return { grade: 'D', remark: 'Pass', points: 2 };
    if (score >= 40) return { grade: 'E', remark: 'Poor', points: 1 };
    return { grade: 'F', remark: 'Fail', points: 0 };
  };

  // Calculate total score (CA: 40%, Exam: 60%)
  const calculateTotalScore = (caScore, examScore) => {
    const caWeight = 0.4;
    const examWeight = 0.6;
    return Math.round((caScore * caWeight) + (examScore * examWeight));
  };

  // Get class position
  const getClassPosition = (studentScore, allScores) => {
    const sortedScores = allScores.sort((a, b) => b.totalScore - a.totalScore);
    return sortedScores.findIndex(score => score.studentId === studentScore.studentId) + 1;
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedTerm && selectedSession) {
      fetchStudentsAndScores();
    }
  }, [selectedClass, selectedSubject, selectedTerm, selectedSession]);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      const mockClasses = [
        { id: '1', name: 'JSS 1A', level: 'Junior Secondary' },
        { id: '2', name: 'JSS 2B', level: 'Junior Secondary' },
        { id: '3', name: 'SS 1A', level: 'Senior Secondary' }
      ];
      setClasses(mockClasses);
    } catch (error) {
      setMessage('Error fetching teacher data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsAndScores = async () => {
    try {
      setLoading(true);
      // Simulate API call to fetch students and their scores
      const mockStudents = [
        {
          id: '1',
          name: 'Adebayo Johnson',
          admissionNumber: 'SCH001',
          caScore: 35,
          examScore: 65,
          attendance: 85
        },
        {
          id: '2',
          name: 'Fatima Ibrahim',
          admissionNumber: 'SCH002',
          caScore: 38,
          examScore: 72,
          attendance: 92
        },
        {
          id: '3',
          name: 'Chinedu Okafor',
          admissionNumber: 'SCH003',
          caScore: 32,
          examScore: 58,
          attendance: 78
        },
        {
          id: '4',
          name: 'Aisha Mohammed',
          admissionNumber: 'SCH004',
          caScore: 40,
          examScore: 78,
          attendance: 95
        }
      ];
      setStudents(mockStudents);
    } catch (error) {
      setMessage('Error fetching students data');
    } finally {
      setLoading(false);
    }
  };

  const generateResults = async () => {
    try {
      setGenerating(true);
      setMessage('');

      // Calculate results for all students
      const calculatedResults = students.map(student => {
        const totalScore = calculateTotalScore(student.caScore, student.examScore);
        const gradeInfo = getGrade(totalScore);
        
        return {
          studentId: student.id,
          studentName: student.name,
          admissionNumber: student.admissionNumber,
          caScore: student.caScore,
          examScore: student.examScore,
          totalScore,
          grade: gradeInfo.grade,
          remark: gradeInfo.remark,
          points: gradeInfo.points,
          attendance: student.attendance,
          subject: selectedSubject,
          class: selectedClass,
          term: selectedTerm,
          session: selectedSession
        };
      });

      // Add class positions
      const resultsWithPositions = calculatedResults.map(result => ({
        ...result,
        position: getClassPosition(result, calculatedResults)
      }));

      setResults(resultsWithPositions);
      setMessage('Results generated successfully!');

      // Simulate API call to save results
      setTimeout(() => {
        setMessage('Results saved to database successfully!');
      }, 1000);

    } catch (error) {
      setMessage('Error generating results');
    } finally {
      setGenerating(false);
    }
  };

  const downloadResults = () => {
    // Create CSV content
    const headers = ['S/N', 'Admission No', 'Student Name', 'CA Score (40%)', 'Exam Score (60%)', 'Total Score', 'Grade', 'Remark', 'Position', 'Attendance (%)'];
    const csvContent = [
      headers.join(','),
      ...results.map((result, index) => [
        index + 1,
        result.admissionNumber,
        result.studentName,
        result.caScore,
        result.examScore,
        result.totalScore,
        result.grade,
        result.remark,
        result.position,
        result.attendance
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedClass}_${selectedSubject}_${selectedTerm}_${selectedSession}_Results.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-500" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Generate Results</h1>
        <p className="text-gray-600">Generate and manage student results based on Nigerian Education Scheme</p>
      </div>

      {/* Selection Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaCalculator className="mr-2 text-primary-500" />
          Result Parameters
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.name}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
            >
              <option value="">Select Subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English Language">English Language</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Economics">Economics</option>
              <option value="Government">Government</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
            >
              <option value="">Select Term</option>
              <option value="First Term">First Term</option>
              <option value="Second Term">Second Term</option>
              <option value="Third Term">Third Term</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
            >
              <option value="">Select Session</option>
              <option value="2023/2024">2023/2024</option>
              <option value="2024/2025">2024/2025</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={generateResults}
            disabled={!selectedClass || !selectedSubject || !selectedTerm || !selectedSession || generating}
            className="bg-primary hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            {generating ? <FaSpinner className="animate-spin" /> : <FaCalculator />}
            {generating ? 'Generating...' : 'Generate Results'}
          </button>

          {results.length > 0 && (
            <button
              onClick={downloadResults}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaDownload />
              Download Results
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold flex items-center">
              <FaEye className="mr-2 text-green-500" />
              Generated Results - {selectedClass} {selectedSubject} ({selectedTerm}, {selectedSession})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CA (40%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam (60%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result, index) => (
                  <tr key={result.studentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.admissionNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.caScore}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.examScore}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{result.totalScore}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        result.grade === 'A' ? 'bg-green-100 text-green-800' :
                        result.grade === 'B' ? 'bg-primary text-primary-800' :
                        result.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        result.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                        result.grade === 'E' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {result.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.remark}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {result.position === 1 ? '🥇' : result.position === 2 ? '🥈' : result.position === 3 ? '🥉' : ''} {result.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.attendance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateResults;