import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

function Contact() {
  return (
    <section className="py-16 text-gray-800 bg-gray-100">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Contact Us
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
            We’d love to hear from you! Whether you’re a parent seeking
            admission information, a guardian with questions, or a visitor,
            feel free to reach out.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-3">
          {/* Address */}
          <div className="p-6 text-center bg-white shadow-md rounded-xl">
            <FaMapMarkerAlt className="text-[#284ea1] text-3xl mx-auto mb-4" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Our Location</h3>
            <p className="text-gray-600">
              Bedetels Triumphant International Academy <br />
              No. 1 Kogam Street, Bori Ogoni, Rivers State, Nigeria
            </p>
          </div>

          {/* Phone */}
          <div className="p-6 text-center bg-white shadow-md rounded-xl">
            <FaPhone className="text-[#284ea1] text-3xl mx-auto mb-4" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Call Us</h3>
            <p className="text-gray-600">+234 803 542 1019</p>
            <p className="text-gray-600">+234 816 234 5678</p>
          </div>

          {/* Email */}
          <div className="p-6 text-center bg-white shadow-md rounded-xl">
            <FaEnvelope className="text-[#284ea1] text-3xl mx-auto mb-4" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Email Us</h3>
            <p className="text-gray-600">info@bedetelsacademy.com</p>
            <p className="text-gray-600">admissions@bedetelsacademy.com</p>
          </div>
        </div>

        {/* Office Hours */}
        <div className="max-w-2xl p-6 mx-auto text-center bg-white shadow-md rounded-xl">
          <FaClock className="text-[#284ea1] text-3xl mx-auto mb-4" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Office Hours</h3>
          <p className="text-gray-600">Monday – Friday: 8:00 AM – 4:00 PM</p>
          <p className="text-gray-600">Saturday: 9:00 AM – 1:00 PM</p>
          <p className="text-gray-600">Sunday: Closed</p>
        </div>
      </div>
    </section>
  );
}

export default Contact;
