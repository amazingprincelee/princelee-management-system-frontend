import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  FaUsers, 
  FaBook, 
  FaPlus, 
  FaEye, 
  FaEdit,
  FaGraduationCap,
  FaCalendarAlt,
  FaClipboardList
} from "react-icons/fa";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("classes");
  
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch assigned classes
      const classesResponse = await axios.get(`${baseUrl}/teacher/classes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch assigned subjects
      const subjectsResponse = await axios.get(`${baseUrl}/teacher/subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setClasses(classesResponse.data.classes || []);
      setSubjects(subjectsResponse.data.subjects || []);
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      // Set demo data for development
      setClasses([
        {
          _id: "1",
          className: "JSS 1A",
          classLevel: "JSS 1",
          section: "A",
          studentCount: 35,
          subjects: ["Mathematics", "English", "Basic Science"],
          classTeacher: user?._id
        },
        {
          _id: "2", 
          className: "JSS 1B",
          classLevel: "JSS 1",
          section: "B",
          studentCount: 32,
          subjects: ["Mathematics", "English"],
          classTeacher: null
        }
      ]);
      
      setSubjects([
        {
          _id: "1",
          subjectName: "Mathematics",
          classes: ["JSS 1A", "JSS 1B", "JSS 2A"],
          totalStudents: 95
        },
        {
          _id: "2",
          subjectName: "English Language", 
          classes: ["JSS 1A", "JSS 1B"],
          totalStudents: 67
        },
        {
          _id: "3",
          subjectName: "Basic Science",
          classes: ["JSS 1A"],
          totalStudents: 35
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Add Exam Scores",
      description: "Record exam scores for your students",
      icon: FaGraduationCap,
      color: "bg-primary",
      link: "/teacher-dashboard/add-scores"
    },
    {
      title: "Add CA Scores",
      description: "Record Continuous Assessment scores",
      icon: FaClipboardList,
      color: "bg-green-600",
      link: "/teacher-dashboard/add-ca"
    },
    {
      title: "View Results",
      description: "View and manage student results",
      icon: FaEye,
      color: "bg-purple-600",
      link: "/teacher-dashboard/results"
    },
    {
      title: "Class Attendance",
      description: "Mark and view attendance records",
      icon: FaCalendarAlt,
      color: "bg-orange-600",
      link: "/teacher-dashboard/attendance"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Classes & Subjects</h1>
        <p className="text-gray-600">
          Manage your assigned classes and subjects for the current academic session.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-sm transition-all duration-200"
              >
                <div className={`${action.color} p-2 rounded-lg w-fit mb-3`}>
                  <Icon className="text-white" size={20} />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("classes")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "classes"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FaUsers className="inline mr-2" />
              My Classes ({classes.length})
            </button>
            <button
              onClick={() => setActiveTab("subjects")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "subjects"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FaBook className="inline mr-2" />
              My Subjects ({subjects.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "classes" && (
            <div className="space-y-4">
              {classes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classes.map((classItem) => (
                    <div key={classItem._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {classItem.className}
                        </h3>
                        {classItem.classTeacher === user?._id && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Class Teacher
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaUsers className="mr-2" />
                          <span>{classItem.studentCount} Students</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <FaBook className="mr-2" />
                          <span>{classItem.subjects?.length || 0} Subjects</span>
                        </div>
                      </div>

                      {classItem.subjects && classItem.subjects.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Subjects:</p>
                          <div className="flex flex-wrap gap-1">
                            {classItem.subjects.map((subject, index) => (
                              <span
                                key={index}
                                className="bg-primary text-primary-800 text-xs font-medium px-2 py-1 rounded"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Link
                          to={`/teacher-dashboard/class/${classItem._id}`}
                          className="flex-1 bg-green-600 text-white text-sm font-medium py-2 px-3 rounded hover:bg-green-700 transition-colors text-center"
                        >
                          <FaEye className="inline mr-1" />
                          View Class
                        </Link>
                        <Link
                          to={`/teacher-dashboard/class/${classItem._id}/scores`}
                          className="flex-1 bg-primary text-white text-sm font-medium py-2 px-3 rounded hover:bg-blue-600 transition-colors text-center"
                        >
                          <FaEdit className="inline mr-1" />
                          Add Scores
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaUsers className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Assigned</h3>
                  <p className="text-gray-600">
                    You haven't been assigned to any classes yet. Contact the administration for class assignments.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "subjects" && (
            <div className="space-y-4">
              {subjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects.map((subject) => (
                    <div key={subject._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {subject.subjectName}
                      </h3>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaUsers className="mr-2" />
                          <span>{subject.totalStudents} Total Students</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <FaBook className="mr-2" />
                          <span>{subject.classes?.length || 0} Classes</span>
                        </div>
                      </div>

                      {subject.classes && subject.classes.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Classes:</p>
                          <div className="flex flex-wrap gap-1">
                            {subject.classes.map((className, index) => (
                              <span
                                key={index}
                                className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded"
                              >
                                {className}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Link
                          to={`/teacher-dashboard/subject/${subject._id}`}
                          className="flex-1 bg-green-600 text-white text-sm font-medium py-2 px-3 rounded hover:bg-green-700 transition-colors text-center"
                        >
                          <FaEye className="inline mr-1" />
                          View Details
                        </Link>
                        <Link
                          to={`/teacher-dashboard/subject/${subject._id}/scores`}
                          className="flex-1 bg-primary text-white text-sm font-medium py-2 px-3 rounded hover:bg-blue-600 transition-colors text-center"
                        >
                          <FaPlus className="inline mr-1" />
                          Add Scores
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaBook className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Subjects Assigned</h3>
                  <p className="text-gray-600">
                    You haven't been assigned to teach any subjects yet. Contact the administration for subject assignments.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyClasses;