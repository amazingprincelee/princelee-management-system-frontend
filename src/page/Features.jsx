import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaUsers, 
  FaClipboardCheck, 
  FaSchool, 
  FaChartLine, 
  FaComments 
} from "react-icons/fa";

function Features() {
  const primaryColor = "#284ea1";

  return (
    <section className="py-16 text-gray-800 bg-gray-50">
      <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
          What Makes Our School Unique
        </h2>
        <p className="max-w-3xl mx-auto mb-10 text-lg text-gray-600">
          At Bedetels Triumphant International Academy, we provide a holistic 
          education that goes beyond academics. Our goal is to nurture 
          well-rounded students prepared for excellence in all areas of life.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Academic Excellence */}
          <div className="flex flex-col items-center p-6 transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <FaClipboardCheck className="mb-4 text-4xl" style={{ color: primaryColor }} />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Academic Excellence</h3>
            <p className="text-center text-gray-600">
              A rich curriculum tailored to national standards with emphasis 
              on critical thinking, creativity, and global relevance.
            </p>
          </div>

          {/* Experienced Teachers */}
          <div className="flex flex-col items-center p-6 transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <FaChalkboardTeacher className="mb-4 text-4xl" style={{ color: primaryColor }} />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Dedicated Teachers</h3>
            <p className="text-center text-gray-600">
              Highly qualified and passionate teachers committed to nurturing 
              every child’s unique potential and talents.
            </p>
          </div>

          {/* Student Development */}
          <div className="flex flex-col items-center p-6 transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <FaUserGraduate className="mb-4 text-4xl" style={{ color: primaryColor }} />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Student Development</h3>
            <p className="text-center text-gray-600">
              Focus on character building, leadership, and moral values to 
              raise disciplined, responsible, and confident individuals.
            </p>
          </div>

          {/* Conducive Learning Environment */}
          <div className="flex flex-col items-center p-6 transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <FaSchool className="mb-4 text-4xl" style={{ color: primaryColor }} />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Modern Facilities</h3>
            <p className="text-center text-gray-600">
              Well-equipped classrooms, science labs, computer rooms, and a 
              serene environment that supports effective learning.
            </p>
          </div>

          {/* Parent Engagement */}
          <div className="flex flex-col items-center p-6 transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <FaUsers className="mb-4 text-4xl" style={{ color: primaryColor }} />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Strong Parent Partnership</h3>
            <p className="text-center text-gray-600">
              We foster close collaboration with parents to ensure every child’s 
              progress is monitored and supported effectively.
            </p>
          </div>

          {/* Co-Curricular Activities */}
          <div className="flex flex-col items-center p-6 transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <FaComments className="mb-4 text-4xl" style={{ color: primaryColor }} />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Beyond the Classroom</h3>
            <p className="text-center text-gray-600">
              Sports, cultural activities, debates, and excursions that help 
              students explore talents, teamwork, and leadership.
            </p>
          </div>

          {/* Academic Tracking */}
          <div className="flex flex-col items-center p-6 transition bg-white shadow-md rounded-xl hover:shadow-lg">
            <FaChartLine className="mb-4 text-4xl" style={{ color: primaryColor }} />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Performance Monitoring</h3>
            <p className="text-center text-gray-600">
              Regular assessments and reports ensure academic growth is 
              closely tracked, with timely feedback for parents.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
