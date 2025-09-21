import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PhotoGallery from "../component/photo-gallery";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUsers,
  FaFileInvoiceDollar,
  FaClipboardCheck,
  FaSchool,
  FaChartLine,
  FaComments,
} from "react-icons/fa";


function LandingPage() {
  const primaryColor = "#284ea1";

  const { token } = useSelector((state)=> state.auth)

  return (
    <div className="text-gray-800 bg-gray-50">
      {/* Hero Section - Full width with responsive adjustments */}
      <section className="relative" style={{ backgroundColor: primaryColor }}>
        <div className="flex flex-col items-center w-full px-4 py-20 sm:px-6 lg:px-8 lg:flex-row">
          {/* Text */}
          <div className="flex-1 mb-10 lg:mb-0 lg:pr-8">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Smart School Management <br /> For the Future of Education
            </h1>
            <p className="mb-6 text-lg text-gray-100 sm:text-xl">
              Simplify school operations, empower teachers, and support students
              with a powerful and user-friendly platform.
            </p>
            <div className="space-x-4">
              <Link
                to="/contact"
                className="bg-white text-[#284ea1] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
              {token? (<><Link
                to="/dashboard"
                className="bg-[#1c3a7e] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#16306e] transition"
              >
                Go to dashboard
              </Link></>) : (<><Link
                to="/login"
                className="bg-[#1c3a7e] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#16306e] transition"
              >
                Admin login
              </Link></>)}
              
            </div>
          </div>

          {/* Image - Responsive and full width on mobile */}
          <div className="flex-1 w-full">
            <img
              src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Nigerian students in classroom"
              className="object-cover w-full h-auto shadow-lg rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features - Expanded with icons and marketable content based on backend schemas */}
      <section className="w-full px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-900 md:text-4xl">
          Key Features of Our School Management System
        </h2>
        <p className="max-w-4xl mx-auto mb-10 text-lg text-center text-gray-600">
          Discover a comprehensive platform designed to streamline every aspect
          of school administration. From student enrollment to payment tracking
          and academic performance management, our system empowers educators,
          parents, and administrators with intuitive tools for success.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <FaUserGraduate
              className="mb-4 text-4xl"
              style={{ color: primaryColor }}
            />
            <h3 className="mb-4 text-xl font-semibold">Student Management</h3>
            <p className="text-gray-600">
              Effortlessly handle admissions, student profiles, personal
              details, parent information, class assignments, and status
              tracking (active, graduated, transferred). Generate unique
              admission numbers and manage photos for a complete student
              database.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <FaChalkboardTeacher
              className="mb-4 text-4xl"
              style={{ color: primaryColor }}
            />
            <h3 className="mb-4 text-xl font-semibold">Teacher Management</h3>
            <p className="text-gray-600">
              Manage teacher profiles linked to users, including employment
              status (full-time or part-time) and secure bank details for
              payroll. Streamline staff operations with easy access to
              communication and result entry tools.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <FaFileInvoiceDollar
              className="mb-4 text-4xl"
              style={{ color: primaryColor }}
            />
            <h3 className="mb-4 text-xl font-semibold">
              Payment & Fees Management
            </h3>
            <p className="text-gray-600">
              Track various fee types (tuition, admission, exams, etc.) with
              support for installments, multiple payment methods (bank transfer,
              POS, online, cash), and automatic status updates (pending, part
              payment, paid). Integrate with Flutterwave and Paystack for
              seamless online transactions.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <FaClipboardCheck
              className="mb-4 text-4xl"
              style={{ color: primaryColor }}
            />
            <h3 className="mb-4 text-xl font-semibold">
              Exam & Result Management
            </h3>
            <p className="text-gray-600">
              Create exams by subject, class, term, and session. Enter student
              scores with automatic grading (A-F) and remarks. Generate detailed
              results linked to students and teachers for accurate academic
              tracking. Download result pdf
            </p>
          </div>
          <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <FaSchool
              className="mb-4 text-4xl"
              style={{ color: primaryColor }}
            />
            <h3 className="mb-4 text-xl font-semibold">School Customization</h3>
            <p className="text-gray-600">
              Customize your school's identity with name, logo, description,
              motto, address, photo gallery, and location details. Configure
              payment settings, currency (e.g., NGN), and callback URLs for a
              tailored experience.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <FaUsers
              className="mb-4 text-4xl"
              style={{ color: primaryColor }}
            />
            <h3 className="mb-4 text-xl font-semibold">Parent Portal</h3>
            <p className="text-gray-600">
              Provide parents with real-time access to their child's academic
              progress, fee balances, exam results, and school updates. Enhance
              communication and engagement for better student outcomes.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <FaChartLine
              className="mb-4 text-4xl"
              style={{ color: primaryColor }}
            />
            <h3 className="mb-4 text-xl font-semibold">Reports & Analytics</h3>
            <p className="text-gray-600">
              Generate comprehensive reports on payments, student performance,
              attendance (integrated tools), and school operations. Make
              data-driven decisions to improve efficiency and educational
              quality.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <FaComments
              className="mb-4 text-4xl"
              style={{ color: primaryColor }}
            />
            <h3 className="mb-4 text-xl font-semibold">Communication Tools</h3>
            <p className="text-gray-600">
              Facilitate seamless interactions between admins, teachers, and
              parents with built-in messaging, notifications, and updates on
              fees, results, and school events.
            </p>
          </div>
        </div>
      </section>
      
      {/* Photo Gallery */}

      <section>
        <div className="max-w-5xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          
        <PhotoGallery />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-5xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="mb-10 text-3xl font-bold text-gray-900 md:text-4xl">
            What People Say
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-6 bg-white shadow-md rounded-xl">
              <p className="mb-4 text-gray-600">
                “This system has transformed how we run our school. Teachers
                save hours each week.”
              </p>
              <h4 className="font-semibold text-gray-800">
                — Principal, Lagos
              </h4>
            </div>
            <div className="p-6 bg-white shadow-md rounded-xl">
              <p className="mb-4 text-gray-600">
                “I love being able to track my child’s progress from my phone at
                any time.”
              </p>
              <h4 className="font-semibold text-gray-800">— Parent, Abuja</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="py-16 text-center text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <h2 className="mb-6 text-3xl font-bold md:text-4xl">
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
      <footer className="py-6 text-sm text-center text-gray-400 bg-gray-900">
        © {new Date().getFullYear()} School Management System. All rights
        reserved.
        <p>Designed By  <a href="https://prince-lee-portfolio.vercel.app/">Amazing Prince Lee</a></p>
      </footer>
    </div>
  );
}

export default LandingPage;
