import { useState } from "react";
import { 
  FaMoneyCheckAlt, 
  FaChalkboardTeacher, 
  FaUserGraduate, 
  FaUsers, 
  FaChartBar 
} from "react-icons/fa";
import { Link } from "react-router-dom";
import AddClassModal from "./modal/add-class"; 

function MainArea() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const adminFeatures = [
    {
      label: "Approve Payment",
      icon: <FaMoneyCheckAlt className="w-8 h-8 text-blue-500" />,
      link: "/dashboard/approve-payment",
      description:
        "Approve student payments quickly and efficiently. Review pending transactions and ensure all fees are settled.",
    },
    {
      label: "Add Classes",
      icon: <FaChalkboardTeacher className="w-8 h-8 text-green-500" />,
      action: () => setIsModalOpen(true), // open modal here
      description:
        "Add new classes to the system. Manage class schedules, assign teachers, and organize students accordingly.",
    },
    {
      label: "Add Teachers",
      icon: <FaUserGraduate className="w-8 h-8 text-purple-500" />,
      link: "/dashboard/add-teachers",
      description:
        "Register new teachers and assign them to classes. Keep track of all staff members and their responsibilities.",
    },
    {
      label: "Manage Students",
      icon: <FaUsers className="w-8 h-8 text-yellow-500" />,
      link: "/dashboard/students",
      description:
        "Add, edit, or view student profiles. Track their enrollment status, performance, and attendance records.",
    },
    {
      label: "View Reports & Analytics",
      icon: <FaChartBar className="w-8 h-8 text-red-500" />,
      link: "/dashboard/reports",
      description:
        "Access key performance indicators, financial summaries, and academic reports for informed decision-making.",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-6 p-5 mt-14 sm:grid-cols-2 lg:grid-cols-3">
        
        {adminFeatures.map((feature) => {
          const content = (
            <div
              className="flex flex-col justify-between p-5 transition-shadow duration-300 bg-white border border-gray-100 rounded-lg shadow-lg cursor-pointer hover:shadow-blue-400 hover:border-blue-300"
            >
              <div className="flex items-center gap-3">
                {feature.icon}
                <h3 className="text-lg font-semibold text-gray-700">{feature.label}</h3>
              </div>
              <p className="mt-3 text-sm text-gray-500">{feature.description}</p>
            </div>
          );

          // If feature has a link, wrap it in <Link>
          if (feature.link) {
            return (
              <Link to={feature.link} key={feature.label}>
                {content}
              </Link>
            );
          }

          // Otherwise use action
          return (
            <div key={feature.label} onClick={feature.action}>
              {content}
            </div>
          );
        })}
      </div>

      {/* Add Class Modal */}
      <AddClassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => console.log("Class created, refresh list if needed")} 
      />
    </>
  );
}

export default MainArea;
