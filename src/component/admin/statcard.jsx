import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchadminDashboard } from "../../redux/features/adminSlice";

function StatCard() {
  const { dashboard, loading, error } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchadminDashboard());
  }, [dispatch]);

  const stats = [
    { label: "Total Students", value: dashboard?.totalStudents },
    { label: "Active Students", value: dashboard?.activeStudents },
    { label: "Graduated Students", value: dashboard?.graduatedStudents },
    { 
      label: "Outstanding Fees", 
      value: dashboard?.outstanding !== undefined
        ? new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(dashboard.outstanding)
        : null,
    },
  ];

  if (error) {
    return <div className="mt-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col justify-between p-5 bg-white rounded-lg shadow-lg"
        >
          <p className="text-sm text-gray-500 uppercase">{stat.label}</p>

          {/* Skeleton if loading */}
          {loading ? (
            <div className="w-20 h-6 mt-2 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="mt-2 text-2xl font-bold">{stat.value ?? 0}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default StatCard;
