import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaGlobe } from "react-icons/fa";

function Contact() {
//  const primaryColor = "#284ea1";

  return (
    <section className="bg-gray-100 py-12 sm:py-16 text-gray-800">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          Get Started with Prince Lee EduSuite
        </h2>
        <p className="text-sm sm:text-base md:text-lg mb-8 text-gray-600 max-w-3xl mx-auto">
          Ready to transform your school with our powerful management system? Explore your options below and take the first step toward streamlined operations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Test the System */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Test the System</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 text-center">
              Experience the platform firsthand with a free trial. Use the credentials below to log in and explore the features.
            </p>
            <p className="text-sm sm:text-base text-red-600"><strong>Login:</strong> demo@schoolmanager.com</p>
            <p className="text-sm sm:text-base text-red-600"><strong>Password:</strong> Demo123!</p>
            <Link
              to="/login"
              className="mt-4 w-full sm:w-auto inline-block bg-[#1c3a7e] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-[#16306e] transition text-center"
            >
              Test the system
            </Link>
          </div>

          {/* Free Installation */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Free Installation</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 text-center">
              After purchase, enjoy complimentary server installation to get your system up and running seamlessly. Contact us to proceed with your order.
            </p>
            <Link
              to="/register"
              className="mt-4 w-full sm:w-auto inline-block bg-white text-[#284ea1] px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-center"
            >
              Purchase Now
            </Link>
          </div>

          {/* Customization Services */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Customization Services</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 text-center">
              Tailor the system to your school’s unique needs. Customization starts at ₦300,000, with costs varying based on requirements. Contact us for a personalized quote.
            </p>
            <button
              className="mt-4 w-full sm:w-auto inline-block bg-[#1c3a7e] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-[#16306e] transition text-center"
              onClick={() => window.location.href = `mailto:princeleepraise@gmail.com?subject=Customization Inquiry`}
            >
              Request Quote
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md max-w-md sm:max-w-lg md:max-w-xl mx-auto">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Contact Us</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 text-center">
            Based in Port Harcourt, Nigeria, I offer worldwide services including maintenance and customization. Reach out for support or inquiries.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-gray-600">
            
            <a href="mailto:princeleepraise@gmail.com" className="flex items-center justify-center hover:text-[#284ea1]">
              <FaEnvelope className="mr-2" /> princeleepraise@gmail.com
            </a>
            <a href="https://worldwide-services.com" className="flex items-center justify-center hover:text-[#284ea1]">
              <FaGlobe className="mr-2" /> Worldwide Support
            </a>
          </div>
          <a href="tel:+2348035421019" className="flex items-center justify-center hover:text-[#284ea1]">
              <FaPhone className="mr-2" /> +234 803 542 1019
            </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;