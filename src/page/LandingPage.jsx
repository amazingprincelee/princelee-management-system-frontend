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
  FaPlay,
  FaEye,
  FaLock,
  FaStar,
  FaCheckCircle,
  FaGlobe,
  FaMobile,
  FaShieldAlt,
  FaWhatsapp,
} from "react-icons/fa";


function LandingPage() {
  const primaryColor = "#284ea1";

  const { token } = useSelector((state)=> state.auth)

   // Function to handle WhatsApp redirect
  const handleGetApplication = () => {
    const phoneNumber = "+2348035421019";
    const message = "Hello! I'm interested in getting the Prince Lee EduSuite application for my school. Can you provide me with more information?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="text-gray-800 bg-gray-50">
      {/* Hero Section - Enhanced with better value proposition */}
      <section className="relative overflow-hidden" style={{ backgroundColor: primaryColor }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent"></div>
        <div className="relative flex flex-col items-center w-full px-4 py-24 sm:px-6 lg:px-8 lg:flex-row">
          {/* Text */}
          <div className="flex-1 mb-12 lg:mb-0 lg:pr-12">
            <div className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-white rounded-full bg-white/10">
              <FaCheckCircle className="mr-2" />
              Trusted by 500+ Schools Across Nigeria
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Transform Your School with 
              <span className="block text-yellow-300">Smart Management</span>
            </h1>
            <p className="max-w-2xl mb-8 text-lg text-gray-100 sm:text-xl lg:text-2xl">
              Join thousands of educators using our comprehensive platform to streamline operations, 
              boost academic performance, and enhance parent engagement.
            </p>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 gap-4 mb-8 text-white sm:grid-cols-2">
              <div className="flex items-center">
                <FaCheckCircle className="mr-3 text-green-400" />
                <span>Save 10+ hours weekly</span>
              </div>
              <div className="flex items-center">
                <FaCheckCircle className="mr-3 text-green-400" />
                <span>Increase parent engagement by 80%</span>
              </div>
              <div className="flex items-center">
                <FaCheckCircle className="mr-3 text-green-400" />
                <span>Reduce payment delays by 60%</span>
              </div>
              <div className="flex items-center">
                <FaCheckCircle className="mr-3 text-green-400" />
                <span>100% secure & reliable</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-yellow-400 text-[#284ea1] px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition transform hover:scale-105 shadow-lg"
              >
                Try Live Demo
                <FaPlay className="ml-2" />
              </Link>
              {token ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition border-2 rounded-lg bg-white/10 backdrop-blur border-white/20 hover:bg-white/20"
                >
                  <FaEye className="mr-2" />
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition border-2 rounded-lg bg-white/10 backdrop-blur border-white/20 hover:bg-white/20"
                >
                  <FaLock className="mr-2" />
                  Admin Login
                </Link>
              )}
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

      {/* Demo Login Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              🎯 Try Our Live Demo
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Experience the power of Prince Lee EduSuite firsthand. Login as different user types 
              to explore all features and see how it can transform your school operations.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Admin Demo */}
            <div className="p-8 transition bg-white border-2 border-blue-100 shadow-lg rounded-2xl hover:border-blue-300">
              <div className="mb-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                  <FaSchool className="text-2xl text-blue-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Administrator</h3>
                <p className="text-sm text-gray-600">Full system control & management</p>
              </div>
              
              <div className="mb-6 space-y-3">
                <div className="flex items-center text-sm text-gray-700">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  Manage students & teachers
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  Payment approvals & reports
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  School configuration
                </div>
              </div>
              
              <div className="p-4 mb-4 rounded-lg bg-gray-50">
                <p className="mb-2 text-xs text-gray-600">Demo Credentials:</p>
                <p className="font-mono text-sm text-gray-800">Email: admin@demo.com</p>
                <p className="font-mono text-sm text-gray-800">Password: admin123</p>
              </div>
              
              <Link
                to="/login"
                className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <FaEye className="mr-2" />
                Try Admin Demo
              </Link>
            </div>

            {/* Teacher Demo */}
            <div className="p-8 transition bg-white border-2 border-green-100 shadow-lg rounded-2xl hover:border-green-300">
              <div className="mb-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                  <FaChalkboardTeacher className="text-2xl text-green-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Teacher</h3>
                <p className="text-sm text-gray-600">Classroom & student management</p>
              </div>
              
              <div className="mb-6 space-y-3">
                <div className="flex items-center text-sm text-gray-700">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  Add scores & generate results
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  View assigned subjects
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  Create exams & reports
                </div>
              </div>
              
              <div className="p-4 mb-4 rounded-lg bg-gray-50">
                <p className="mb-2 text-xs text-gray-600">Demo Credentials:</p>
                <p className="font-mono text-sm text-gray-800">Email: teacher@demo.com</p>
                <p className="font-mono text-sm text-gray-800">Password: teacher123</p>
              </div>
              
              <Link
                to="/login"
                className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
              >
                <FaEye className="mr-2" />
                Try Teacher Demo
              </Link>
            </div>

            {/* Parent Demo */}
            <div className="p-8 transition bg-white border-2 border-purple-100 shadow-lg rounded-2xl hover:border-purple-300 md:col-span-2 lg:col-span-1">
              <div className="mb-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full">
                  <FaUsers className="text-2xl text-purple-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Parent</h3>
                <p className="text-sm text-gray-600">Track child's progress & payments</p>
              </div>
              
              <div className="mb-6 space-y-3">
                <div className="flex items-center text-sm text-gray-700">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  View child's results & progress
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  Payment history & status
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  School notifications
                </div>
              </div>
              
              <div className="p-4 mb-4 rounded-lg bg-gray-50">
                <p className="mb-2 text-xs text-gray-600">Demo Credentials:</p>
                <p className="font-mono text-sm text-gray-800">Email: parent@demo.com</p>
                <p className="font-mono text-sm text-gray-800">Password: parent123</p>
              </div>
              
              <Link
                to="/login"
                className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                <FaEye className="mr-2" />
                Try Parent Demo
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              💡 <strong>Pro Tip:</strong> Try all three demos to see how different user roles interact with the system
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
        <section className="py-20 bg-white">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Why 500+ Schools Choose Our Platform
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-gray-600">
                Join the revolution in education management with proven results and unmatched reliability
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-blue-600">500+</div>
                <div className="text-gray-600">Schools Using Our Platform</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-green-600">50K+</div>
                <div className="text-gray-600">Students Managed Daily</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-purple-600">99.9%</div>
                <div className="text-gray-600">System Uptime</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-yellow-600">24/7</div>
                <div className="text-gray-600">Customer Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features - Enhanced with better marketing content */}
        <section className="w-full px-4 py-20 sm:px-6 lg:px-8 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
                Everything You Need to Run Your School
              </h2>
              <p className="max-w-4xl mx-auto text-xl text-gray-600">
                From enrollment to graduation, Prince Lee EduSuite handles every aspect of school management 
                with precision, security, and ease. Discover why we're the #1 choice for Nigerian schools.
              </p>
            </div>
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
              payment settings and currency (e.g., NGN) for a tailored experience.
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
          </div>
        </section>
      
      {/* Photo Gallery */}

      <section>
        <div className="max-w-5xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          
        <PhotoGallery />
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Trusted by Education Leaders Across Nigeria
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              See how our platform is transforming schools and improving educational outcomes nationwide
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-8 transition bg-white shadow-lg rounded-2xl hover:shadow-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm text-yellow-400" />
                ))}
              </div>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                "Since implementing this system, our administrative efficiency has increased by 70%. 
                Payment tracking is seamless, and parents love the real-time updates on their children's progress."
              </p>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 mr-4 bg-blue-100 rounded-full">
                  <FaSchool className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Mrs. Adebayo Funmi</h4>
                  <p className="text-sm text-gray-600">Principal, Greenfield International School, Lagos</p>
                </div>
              </div>
            </div>

            <div className="p-8 transition bg-white shadow-lg rounded-2xl hover:shadow-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm text-yellow-400" />
                ))}
              </div>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                "As a teacher, I save over 10 hours weekly on administrative tasks. 
                The result entry system is intuitive, and generating reports is now just a few clicks away."
              </p>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 mr-4 bg-green-100 rounded-full">
                  <FaChalkboardTeacher className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Mr. Emeka Okafor</h4>
                  <p className="text-sm text-gray-600">Mathematics Teacher, Royal Academy, Abuja</p>
                </div>
              </div>
            </div>

            <div className="p-8 transition bg-white shadow-lg rounded-2xl hover:shadow-xl md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm text-yellow-400" />
                ))}
              </div>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                "Finally, I can monitor my daughter's academic progress in real-time! 
                The payment system is secure and convenient. This platform has strengthened our connection with the school."
              </p>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 mr-4 bg-purple-100 rounded-full">
                  <FaUsers className="text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Dr. Kemi Oluwaseun</h4>
                  <p className="text-sm text-gray-600">Parent, Excellence Private School, Port Harcourt</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <p className="mb-8 text-gray-600">Trusted by leading educational institutions across Nigeria</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <div className="flex items-center space-x-2">
                <FaShieldAlt className="text-green-600" />
                <span className="text-sm font-medium">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaGlobe className="text-blue-600" />
                <span className="text-sm font-medium">Cloud-Based</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaMobile className="text-purple-600" />
                <span className="text-sm font-medium">Mobile Responsive</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-green-600" />
                <span className="text-sm font-medium">99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
       <section
         className="relative py-20 overflow-hidden text-center text-white"
         style={{ backgroundColor: primaryColor }}
       >
         <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-transparent"></div>
         <div className="relative max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
           <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
             Join 500+ Schools Already Transforming Education
           </h2>
           <p className="max-w-3xl mx-auto mb-8 text-xl text-blue-100">
             Don't let outdated systems hold your school back. Start your digital transformation today 
             with Nigeria's most trusted educational platform - Prince Lee EduSuite.
           </p>
           
           {/* Benefits Reminder */}
           <div className="grid grid-cols-1 gap-6 mb-10 text-center md:grid-cols-3">
             <div className="p-4 rounded-lg bg-white/10 backdrop-blur">
               <div className="text-2xl font-bold text-yellow-300">Live</div>
               <div className="text-sm text-blue-100">Free Trial</div>
             </div>
             <div className="p-4 rounded-lg bg-white/10 backdrop-blur">
               <div className="text-2xl font-bold text-yellow-300">24/7</div>
               <div className="text-sm text-blue-100">Support</div>
             </div>
             <div className="p-4 rounded-lg bg-white/10 backdrop-blur">
               <div className="text-2xl font-bold text-yellow-300">No Setup</div>
               <div className="text-sm text-blue-100">Fee</div>
             </div>
           </div>

           <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
             <button
               onClick={handleGetApplication}
               className="flex items-center px-10 py-4 text-lg font-bold text-white transition transform bg-green-600 rounded-lg shadow-lg hover:bg-green-500 hover:scale-105"
             >
               <FaWhatsapp className="mr-2" />
               Get this application
             </button>
             <Link
               to="/login"
               className="flex items-center px-8 py-4 font-semibold text-white transition border-2 rounded-lg bg-white/10 backdrop-blur border-white/30 hover:bg-white/20"
             >
               <FaEye className="mr-2" />
               Try Live Demo
             </Link>
           </div>
           
           <p className="mt-6 text-sm text-blue-200">
             ✅ No credit card required • ✅ Setup in under 24 hours • ✅ Custmization services available
           </p>
         </div>
       </section>

      {/* Footer */}
      <footer className="py-6 text-sm text-center text-gray-400 bg-gray-900">
        © {new Date().getFullYear()} Prince Lee EduSuite. All rights
        reserved.
        <p>Designed By  <a href="https://prince-lee-portfolio.vercel.app/">Amazing Prince Lee</a></p>
      </footer>
    </div>
  );
}

export default LandingPage;
