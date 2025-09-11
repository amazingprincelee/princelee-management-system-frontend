import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchadminDashboard } from "../../redux/features/adminSlice";

function StatCard() {
  const { dashboard, loading, error } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchadminDashboard());
  }, [dispatch]);

  console.log(dashboard);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-10 h-10 ease-linear border-4 border-t-4 border-gray-200 rounded-full loader"></div>
      </div>
    );
  }

  if (error) {
    return <div className="mt-4 text-center text-red-500">{error}</div>;
  }

  const stats = [
    { label: "Total Students", value: dashboard?.totalStudents || 0 },
    { label: "Active Students", value: dashboard?.activeStudents || 0 },
    { label: "Graduated Students", value: dashboard?.graduatedStudents || 0 },
    { 
    label: "Outstanding Fees", 
    value: new Intl.NumberFormat("en-NG", { 
      style: "currency", 
      currency: "NGN" 
    }).format(dashboard?.outstanding || 0),
  },
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col justify-between p-5 bg-white rounded-lg shadow-lg "
          >
            <p className="text-sm text-gray-500 uppercase">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default StatCard;
