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
  FaRobot,
  FaPaintBrush,
  FaCalculator,
  FaLaptopCode,
  FaFlask,
  FaBookOpen,
} from "react-icons/fa";


function LandingPage() {
  const primaryColor = "#284ea1";

  const { token } = useSelector((state)=> state.auth)

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
        Celebrating 20+ Years of Excellence
      </div>
      <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
        Welcome to
        <span className="block text-yellow-300">Bedetels Triumphant International Academy</span>
      </h1>
      <p className="max-w-2xl mb-8 text-lg text-gray-100 sm:text-xl lg:text-2xl">
        Building a legacy of academic success, strong values, and future leaders — 
        in a safe and nurturing environment.
      </p>

      {/* Key Highlights */}
      <div className="grid grid-cols-1 gap-4 mb-8 text-white sm:grid-cols-2">
        <div className="flex items-center">
          <FaCheckCircle className="mr-3 text-green-400" />
          <span>20+ years of proven excellence</span>
        </div>
        <div className="flex items-center">
          <FaCheckCircle className="mr-3 text-green-400" />
          <span>Dedicated and qualified teachers</span>
        </div>
        <div className="flex items-center">
          <FaCheckCircle className="mr-3 text-green-400" />
          <span>Strong moral and spiritual foundation</span>
        </div>
        <div className="flex items-center">
          <FaCheckCircle className="mr-3 text-green-400" />
          <span>Safe & conducive learning environment</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          to="/contact"
          className="inline-flex items-center justify-center bg-yellow-400 text-[#284ea1] px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition transform hover:scale-105 shadow-lg"
        >
          Enroll Now
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

    {/* Image - hidden on small screens */}
    <div className="flex-1 hidden w-full lg:block">
      <img
        src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        alt="Students learning"
        className="object-cover w-full h-auto shadow-lg rounded-2xl"
      />
    </div>
  </div>
</section>


     {/* Features Section */}
{/* Features Section */}
<section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
  <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
    <div className="mb-12 text-center">
      <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
        🌟 Our Core Academic Features
      </h2>
      <p className="max-w-3xl mx-auto text-lg text-gray-600">
        At Bedetels Triumphant International Academy, we combine innovative teaching 
        with practical learning experiences to prepare students for the future.
      </p>
    </div>

    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {/* STEM Programs */}
      <div className="p-8 transition bg-white border-2 border-blue-100 shadow-lg rounded-2xl hover:border-blue-300">
        <h3 className="mb-3 text-xl font-bold text-gray-900">STEM Programs</h3>
        <p className="text-sm text-gray-600">
          Students engage in hands-on projects like robotics, coding, and science 
          experiments to develop problem-solving skills and innovate solutions for 
          real-world challenges.
        </p>
      </div>

      {/* Creative Arts Integration */}
      <div className="p-8 transition bg-white border-2 border-pink-100 shadow-lg rounded-2xl hover:border-pink-300">
        <h3 className="mb-3 text-xl font-bold text-gray-900">Creative Arts Integration</h3>
        <p className="text-sm text-gray-600">
          Art and design projects tied directly to subjects like Science and Geography, 
          enhancing creativity while reinforcing academic concepts.
        </p>
      </div>

      {/* Mathematics Problem-Solving */}
      <div className="p-8 transition bg-white border-2 border-green-100 shadow-lg rounded-2xl hover:border-green-300">
        <h3 className="mb-3 text-xl font-bold text-gray-900">Mathematics Problem-Solving Sessions</h3>
        <p className="text-sm text-gray-600">
          Enhances logical thinking and analytical skills through interactive lessons 
          and problem-solving activities with real-life applications.
        </p>
      </div>

      {/* ICT Training */}
      <div className="p-8 transition bg-white border-2 border-purple-100 shadow-lg rounded-2xl hover:border-purple-300">
        <h3 className="mb-3 text-xl font-bold text-gray-900">ICT Training</h3>
        <p className="text-sm text-gray-600">
          Instruction on coding, computer applications, and internet research skills 
          to equip students with essential digital competencies for the modern world.
        </p>
      </div>

      {/* Science Practical Experiments */}
      <div className="p-8 transition bg-white border-2 border-yellow-100 shadow-lg rounded-2xl hover:border-yellow-300">
        <h3 className="mb-3 text-xl font-bold text-gray-900">Science Practical Experiments</h3>
        <p className="text-sm text-gray-600">
          Hands-on lab sessions in Physics, Chemistry, and Biology to deepen 
          theoretical concepts while fostering inquiry and critical thinking.
        </p>
      </div>

      {/* Language and Literacy Development */}
      <div className="p-8 transition bg-white border-2 border-red-100 shadow-lg rounded-2xl hover:border-red-300">
        <h3 className="mb-3 text-xl font-bold text-gray-900">Language and Literacy Development</h3>
        <p className="text-sm text-gray-600">
          Includes grammar lessons, reading comprehension, and essay writing activities. 
          Strengthens communication skills in English or other languages offered at the school.
        </p>
      </div>
    </div>
  </div>
</section>



      {/* Why Choose Us Section */}
<section className="py-20 bg-white">
  <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div className="mb-16 text-center">
      <h2 className="mb-4 text-4xl font-bold text-gray-900">
        Why Parents & Students Choose Our School
      </h2>
      <p className="max-w-3xl mx-auto text-xl text-gray-600">
        At Bedetels Triumphant International Academy, we combine academic excellence 
        with strong moral values to nurture well-rounded students prepared for success.
      </p>
    </div>
    
    <div className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2 lg:grid-cols-4">
      {/* Academic Excellence */}
      <div className="text-center">
        <div className="mb-2 text-4xl font-bold text-blue-600">100%</div>
        <div className="text-gray-600">Excellence in WAEC & NECO Results</div>
      </div>

      {/* Experienced Teachers */}
      <div className="text-center">
        <div className="mb-2 text-4xl font-bold text-green-600">40+</div>
        <div className="text-gray-600">Dedicated & Experienced Teachers</div>
      </div>

      {/* Holistic Education */}
      <div className="text-center">
        <div className="mb-2 text-4xl font-bold text-purple-600">15+</div>
        <div className="text-gray-600">Years of Holistic Education</div>
      </div>

      {/* Parent Trust */}
      <div className="text-center">
        <div className="mb-2 text-4xl font-bold text-yellow-600">1,200+</div>
        <div className="text-gray-600">Parents Who Trust Us</div>
      </div>
    </div>
  </div>
</section>


        {/* School Programs & Features */}
<section className="w-full px-4 py-20 sm:px-6 lg:px-8 bg-gray-50">
  <div className="mx-auto max-w-7xl">
    <div className="mb-16 text-center">
      <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
        A Complete Education for Every Child
      </h2>
      <p className="max-w-4xl mx-auto text-xl text-gray-600">
        At Bedetels Triumphant International Academy, we combine academics, creativity, 
        technology, and moral values to provide students with the knowledge and skills 
        needed to thrive in today’s world.
      </p>
    </div>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {/* STEM Programs */}
      <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
        <FaRobot className="mb-4 text-4xl text-blue-600" />
        <h3 className="mb-4 text-xl font-semibold">STEM Programs</h3>
        <p className="text-gray-600">
          Robotics, coding, and science experiments that foster curiosity, innovation, 
          and problem-solving skills for real-world challenges.
        </p>
      </div>

      {/* Creative Arts */}
      <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
        <FaPaintBrush className="mb-4 text-4xl text-pink-600" />
        <h3 className="mb-4 text-xl font-semibold">Creative Arts Integration</h3>
        <p className="text-gray-600">
          Hands-on art, music, and design projects tied to core subjects, building 
          creativity while reinforcing academic concepts.
        </p>
      </div>

      {/* Mathematics Problem-Solving */}
      <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
        <FaCalculator className="mb-4 text-4xl text-green-600" />
        <h3 className="mb-4 text-xl font-semibold">Mathematics Problem-Solving</h3>
        <p className="text-gray-600">
          Interactive math lessons and activities that sharpen logic, analytical 
          thinking, and real-world application of concepts.
        </p>
      </div>

      {/* ICT Training */}
      <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
        <FaLaptopCode className="mb-4 text-4xl text-indigo-600" />
        <h3 className="mb-4 text-xl font-semibold">ICT & Digital Skills</h3>
        <p className="text-gray-600">
          Coding, internet research, and digital tools training that prepare students 
          for success in the modern technological world.
        </p>
      </div>

      {/* Science Experiments */}
      <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
        <FaFlask className="mb-4 text-4xl text-yellow-600" />
        <h3 className="mb-4 text-xl font-semibold">Science Practical Experiments</h3>
        <p className="text-gray-600">
          Physics, Chemistry, and Biology labs that bring theories to life through 
          hands-on experimentation and critical inquiry.
        </p>
      </div>

      {/* Language Development */}
      <div className="flex flex-col items-center p-6 text-center transition bg-white shadow-md rounded-xl hover:shadow-lg">
        <FaBookOpen className="mb-4 text-4xl text-purple-600" />
        <h3 className="mb-4 text-xl font-semibold">Language & Literacy</h3>
        <p className="text-gray-600">
          Grammar lessons, reading comprehension, and essay writing to strengthen 
          communication skills in English and other languages.
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

      {/* Parent Testimonials Section */}
<section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
  <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div className="mb-16 text-center">
      <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
        What Parents Are Saying
      </h2>
      <p className="max-w-3xl mx-auto text-xl text-gray-600">
        Hear from parents across Nigeria whose children are thriving with our
        platform’s support.
      </p>
    </div>

    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {/* Testimonial 1 */}
      <div className="p-8 transition bg-white shadow-lg rounded-2xl hover:shadow-xl">
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="text-sm text-yellow-400" />
          ))}
        </div>
        <p className="mb-6 text-lg leading-relaxed text-gray-700">
          "I love how I can check my son’s results and school updates instantly. 
          It makes me feel more connected to his education and gives me peace of mind."
        </p>
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 mr-4 bg-blue-100 rounded-full">
            <FaUsers className="text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Mrs. Adebayo Funmi</h4>
            <p className="text-sm text-gray-600">Parent, Lagos</p>
          </div>
        </div>
      </div>

      {/* Testimonial 2 */}
      <div className="p-8 transition bg-white shadow-lg rounded-2xl hover:shadow-xl">
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="text-sm text-yellow-400" />
          ))}
        </div>
        <p className="mb-6 text-lg leading-relaxed text-gray-700">
          "The payment system is so convenient. No more queuing at the bank —
          I can settle fees from my phone in minutes."
        </p>
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 mr-4 bg-green-100 rounded-full">
            <FaUsers className="text-green-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Mr. Emeka Okafor</h4>
            <p className="text-sm text-gray-600">Parent, Abuja</p>
          </div>
        </div>
      </div>

      {/* Testimonial 3 */}
      <div className="p-8 transition bg-white shadow-lg rounded-2xl hover:shadow-xl md:col-span-2 lg:col-span-1">
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="text-sm text-yellow-400" />
          ))}
        </div>
        <p className="mb-6 text-lg leading-relaxed text-gray-700">
          "My daughter feels motivated knowing I can track her progress.
          The platform has truly improved communication between home and school."
        </p>
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 mr-4 bg-purple-100 rounded-full">
            <FaUsers className="text-purple-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Dr. Kemi Oluwaseun</h4>
            <p className="text-sm text-gray-600">Parent, Port Harcourt</p>
          </div>
        </div>
      </div>
    </div>

    {/* Trust Indicators */}
    <div className="mt-16 text-center">
      <p className="mb-8 text-gray-600">
        Loved by parents and trusted by schools nationwide
      </p>
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


      {/* Final Call to Action for School Website */}
<section
  className="relative py-20 overflow-hidden text-center text-white"
  style={{ backgroundColor: primaryColor }}
>
  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-transparent"></div>
  <div className="relative max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
    <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
      Give Your Child the Future They Deserve ✨
    </h2>
    <p className="max-w-3xl mx-auto mb-8 text-xl text-blue-100">
      At <span className="font-bold text-yellow-300">Bedetels Triumphant International Academy</span>, 
      we nurture young minds through academic excellence, moral discipline, and 
      skills for the future. Your child’s success story starts here.
    </p>

    {/* Highlights */}
    <div className="grid grid-cols-1 gap-6 mb-10 text-center md:grid-cols-3">
      <div className="p-4 rounded-lg bg-white/10 backdrop-blur">
        <div className="text-2xl font-bold text-yellow-300">20+</div>
        <div className="text-sm text-blue-100">Years of Excellence</div>
      </div>
      <div className="p-4 rounded-lg bg-white/10 backdrop-blur">
        <div className="text-2xl font-bold text-yellow-300">1000+</div>
        <div className="text-sm text-blue-100">Successful Alumni</div>
      </div>
      <div className="p-4 rounded-lg bg-white/10 backdrop-blur">
        <div className="text-2xl font-bold text-yellow-300">Holistic</div>
        <div className="text-sm text-blue-100">Education Approach</div>
      </div>
    </div>

    {/* CTA Buttons */}
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Link
        to="/admissions"
        className="bg-yellow-400 text-[#284ea1] px-10 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition transform hover:scale-105 shadow-lg flex items-center"
      >
        Apply for Admission
        <FaPlay className="ml-2" />
      </Link>
      <Link
        to="/contact"
        className="flex items-center px-8 py-4 font-semibold text-white transition border-2 rounded-lg bg-white/10 backdrop-blur border-white/30 hover:bg-white/20"
      >
        <FaEye className="mr-2" />
        Schedule a Visit
      </Link>
    </div>

    <p className="mt-6 text-sm text-blue-200">
      📚 Academic Excellence • 🎨 Creative Development • 🌍 Global Relevance
    </p>
  </div>
</section>


      {/* Footer */}
      <footer className="py-6 text-sm text-center text-gray-400 bg-gray-900">
        © {new Date().getFullYear()} BEDETELS TRIUMPHANT INT'L ACADEMY. All rights
        reserved.
        <p>Designed By  <a href="https://prince-lee-portfolio.vercel.app/">Amazing Prince Lee</a></p>
      </footer>
    </div>
  );
}

export default LandingPage;
