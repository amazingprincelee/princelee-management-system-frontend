import { FaUserGraduate, FaChalkboardTeacher, FaUsers, FaFileInvoiceDollar, FaClipboardCheck, FaSchool, FaChartLine, FaComments } from "react-icons/fa";

function Features() {
  const primaryColor = "#284ea1";

  return (
    <section className="bg-gray-50 py-12 sm:py-16 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          Key Features of Prince Lee EduSuite
        </h2>
        <p className="text-sm sm:text-base md:text-lg mb-10 text-gray-600 max-w-3xl mx-auto">
          Discover a comprehensive platform designed to streamline every aspect of school administration. From student enrollment to payment tracking and academic performance management, our system empowers educators, parents, and administrators with intuitive tools for success.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Student Management */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center">
            <FaUserGraduate className="text-3xl sm:text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Student Management</h3>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Effortlessly handle admissions, student profiles, personal details, parent information, class assignments, and status tracking (active, graduated, transferred). Generate unique admission numbers and manage photos.
            </p>
          </div>

          {/* Teacher Management */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center">
            <FaChalkboardTeacher className="text-3xl sm:text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Teacher Management</h3>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Manage teacher profiles, employment status (full-time or part-time), and secure bank details for payroll. Streamline staff operations with communication and result entry tools.
            </p>
          </div>

          {/* Payment & Fees Management */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center">
            <FaFileInvoiceDollar className="text-3xl sm:text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Payment & Fees Management</h3>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Track various fee types (tuition, admission, exams, etc.) with support for installments, multiple payment methods, and automatic status updates. Integrate with Flutterwave and Paystack.
            </p>
          </div>

          {/* Exam & Result Management */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center">
            <FaClipboardCheck className="text-3xl sm:text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Exam & Result Management</h3>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Create exams by subject, class, term, and session. Enter student scores with automatic grading (A-F) and remarks. Generate detailed results linked to students and teachers.
            </p>
          </div>

          {/* School Customization */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center">
            <FaSchool className="text-3xl sm:text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">School Customization</h3>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Customize your school's identity with name, logo, description, motto, address, photo gallery, and location details. Configure payment settings and currency.
            </p>
          </div>

          {/* Parent Portal */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center">
            <FaUsers className="text-3xl sm:text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Parent Portal</h3>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Provide parents with real-time access to their child's academic progress, fee balances, exam results, and school updates. Enhance communication and engagement.
            </p>
          </div>

          {/* Reports & Analytics */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center">
            <FaChartLine className="text-3xl sm:text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Reports & Analytics</h3>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Generate comprehensive reports on payments, student performance, attendance, and school operations. Make data-driven decisions to improve efficiency.
            </p>
          </div>

          {/* Communication Tools */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center">
            <FaComments className="text-3xl sm:text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Communication Tools</h3>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Facilitate seamless interactions between admins, teachers, and parents with messaging, notifications, and updates on fees, results, and school events.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;