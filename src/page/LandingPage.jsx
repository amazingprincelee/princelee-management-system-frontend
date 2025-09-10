import { Link } from "react-router-dom";
import { FaUserGraduate, FaChalkboardTeacher, FaUsers, FaFileInvoiceDollar, FaClipboardCheck, FaSchool, FaChartLine, FaComments } from "react-icons/fa";

function LandingPage() {
  const primaryColor = "#284ea1";

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section - Full width with responsive adjustments */}
      <section className="relative" style={{ backgroundColor: primaryColor }}>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center">
          {/* Text */}
          <div className="flex-1 mb-10 lg:mb-0 lg:pr-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-white">
              Smart School Management <br /> For the Future of Education
            </h1>
            <p className="text-lg sm:text-xl mb-6 text-gray-100">
              Simplify school operations, empower teachers, and support
              students with a powerful and user-friendly platform.
            </p>
            <div className="space-x-4">
              <Link
                to="/contact"
                className="bg-white text-[#284ea1] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-[#1c3a7e] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#16306e] transition"
              >
                Admin Login
              </Link>
            </div>
          </div>

          {/* Image - Responsive and full width on mobile */}
          <div className="flex-1 w-full">
            <img
              src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Nigerian students in classroom"
              className="w-full h-auto rounded-2xl shadow-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features - Expanded with icons and marketable content based on backend schemas */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Key Features of Our School Management System
        </h2>
        <p className="text-center text-lg mb-10 text-gray-600 max-w-4xl mx-auto">
          Discover a comprehensive platform designed to streamline every aspect of school administration. From student enrollment to payment tracking and academic performance management, our system empowers educators, parents, and administrators with intuitive tools for success.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center">
            <FaUserGraduate className="text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-xl font-semibold mb-4">Student Management</h3>
            <p className="text-gray-600">
              Effortlessly handle admissions, student profiles, personal details, parent information, class assignments, and status tracking (active, graduated, transferred). Generate unique admission numbers and manage photos for a complete student database.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center">
            <FaChalkboardTeacher className="text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-xl font-semibold mb-4">Teacher Management</h3>
            <p className="text-gray-600">
              Manage teacher profiles linked to users, including employment status (full-time or part-time) and secure bank details for payroll. Streamline staff operations with easy access to communication and result entry tools.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center">
            <FaFileInvoiceDollar className="text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-xl font-semibold mb-4">Payment & Fees Management</h3>
            <p className="text-gray-600">
              Track various fee types (tuition, admission, exams, etc.) with support for installments, multiple payment methods (bank transfer, POS, online, cash), and automatic status updates (pending, part payment, paid). Integrate with Flutterwave and Paystack for seamless online transactions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center">
            <FaClipboardCheck className="text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-xl font-semibold mb-4">Exam & Result Management</h3>
            <p className="text-gray-600">
              Create exams by subject, class, term, and session. Enter student scores with automatic grading (A-F) and remarks. Generate detailed results linked to students and teachers for accurate academic tracking. Download result pdf
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center">
            <FaSchool className="text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-xl font-semibold mb-4">School Customization</h3>
            <p className="text-gray-600">
              Customize your school's identity with name, logo, description, motto, address, photo gallery, and location details. Configure payment settings, currency (e.g., NGN), and callback URLs for a tailored experience.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center">
            <FaUsers className="text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-xl font-semibold mb-4">Parent Portal</h3>
            <p className="text-gray-600">
              Provide parents with real-time access to their child's academic progress, fee balances, exam results, and school updates. Enhance communication and engagement for better student outcomes.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center">
            <FaChartLine className="text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-xl font-semibold mb-4">Reports & Analytics</h3>
            <p className="text-gray-600">
              Generate comprehensive reports on payments, student performance, attendance (integrated tools), and school operations. Make data-driven decisions to improve efficiency and educational quality.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center">
            <FaComments className="text-4xl mb-4" style={{ color: primaryColor }} />
            <h3 className="text-xl font-semibold mb-4">Communication Tools</h3>
            <p className="text-gray-600">
              Facilitate seamless interactions between admins, teachers, and parents with built-in messaging, notifications, and updates on fees, results, and school events.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900">What People Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="mb-4 text-gray-600">
                “This system has transformed how we run our school. Teachers
                save hours each week.”
              </p>
              <h4 className="font-semibold text-gray-800">— Principal, Lagos</h4>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="mb-4 text-gray-600">
                “I love being able to track my child’s progress from my phone
                at any time.”
              </p>
              <h4 className="font-semibold text-gray-800">— Parent, Abuja</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-white py-16 text-center" style={{ backgroundColor: primaryColor }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your School?
        </h2>
        <Link
          to="/contact"
          className="bg-white text-[#284ea1] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Get Started Today
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
        © {new Date().getFullYear()} School Management System. All rights
        reserved.
      </footer>
    </div>
  );
}

export default LandingPage;