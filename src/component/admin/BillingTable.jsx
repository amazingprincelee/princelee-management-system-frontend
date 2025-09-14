import { FaEye, FaCheckCircle, FaReceipt, FaDownload } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPayment, approvePayment, getReceipt } from "../../redux/features/paymentSlice";
import { fetchUserProfile } from "../../redux/features/userSlice";
import { FiSearch, FiFilter } from "react-icons/fi";

const BillingTable = () => {
  const dispatch = useDispatch();
  const { payments, loading, error, approving, approveError, receipt, receiptLoading, receiptError } = useSelector((state) => state.payment || {});
  const { profile} = useSelector((state) => state.user || {});
  const [filters, setFilters] = useState({
    session: "",
    term: "",
    status: "",
    studentName: "",
    classLevel: "",
    feeType: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProofUrl, setSelectedProofUrl] = useState(null);

  // Fetch user profile and initial payments
  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchPayment(filters));
  }, [dispatch]);

  // Update payments when filters change
  useEffect(() => {
    dispatch(fetchPayment(filters));
  }, [filters, dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApprove = (paymentId, installmentId) => {
    dispatch(approvePayment({ paymentId, installmentId }));
  };

  const handleViewReceipt = (paymentId, installmentId) => {
    dispatch(getReceipt({ paymentId, installmentId }));
  };

  const handleViewProof = (proofUrl) => {
    setSelectedProofUrl(proofUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProofUrl(null);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "part payment":
        return "bg-blue-200 text-blue-800";
      case "paid":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const formatCurrency = (amount) => `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">All Bills</h2>

      {/* Filter and Search Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FiSearch className="text-gray-600" />
          <input
            type="text"
            name="studentName"
            value={filters.studentName}
            onChange={handleFilterChange}
            placeholder="Search by student name"
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          name="session"
          value={filters.session}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Sessions</option>
          <option value="2024/2025">2024/2025</option>
          <option value="2025/2026">2025/2026</option>
        </select>
        <select
          name="term"
          value={filters.term}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Terms</option>
          <option value="first">First</option>
          <option value="second">Second</option>
          <option value="third">Third</option>
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="part payment">Part Payment</option>
          <option value="paid">Paid</option>
        </select>
        <select
          name="feeType"
          value={filters.feeType}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Fee Types</option>
          <option value="tuition">Tuition</option>
          <option value="admission">Admission</option>
          <option value="exam">Exam</option>
          <option value="party">Party</option>
          <option value="others">Others</option>
        </select>
        <select
          name="classLevel"
          value={filters.classLevel}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Classes</option>
          <option value="basic 1">Basic 1</option>
          <option value="jss 2">JSS 2</option>
          <option value="sss 2">SSS 2</option>
        </select>
      </div>

      {/* Error and Loading States */}
      {loading && <p className="text-blue-600">Loading payments...</p>}
      {error && <p className="text-red-600">Error: {error.message || error}</p>}
      {approveError && <p className="text-red-600">Approve Error: {approveError.message || approveError}</p>}
      {receiptError && <p className="text-red-600">Receipt Error: {receiptError.message || receiptError}</p>}
      {receipt && receipt.receiptUrl && (
        <p className="mb-4 text-green-600">
          Receipt available: <a href={receipt.receiptUrl} target="_blank" rel="noopener noreferrer" className="underline">Download Receipt</a>
        </p>
      )}

      {/* Modal for Proof of Payment */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg">
            <h3 className="mb-4 text-lg font-semibold">Proof of Payment</h3>
            {selectedProofUrl ? (
              <div className="mb-4">
                <img src={selectedProofUrl} alt="Proof of Payment" className="object-contain w-full h-auto max-h-96" />
                <a
                  href={selectedProofUrl}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <FaDownload /> Download Proof
                </a>
              </div>
            ) : (
              <p className="text-gray-600">No proof of payment available.</p>
            )}
            <button
              onClick={closeModal}
              className="px-4 py-2 mt-4 text-white bg-gray-600 rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Payments Table */}
      {!loading && payments && payments.length > 0 ? (
        <div className="overflow-x-auto shadow-lg rounded-xl">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="text-sm text-white uppercase bg-blue-600">
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Class</th>
                <th className="px-4 py-3 text-left">Term</th>
                <th className="px-4 py-3 text-left">Fee Type</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Paid</th>
                <th className="px-4 py-3 text-left">Balance</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) =>
                payment.installments.map((installment, index) => (
                  <tr key={`${payment._id}-${installment._id}`} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-4 py-3">{`${payment.studentId.firstName} ${payment.studentId.surName}`}</td>
                    <td className="px-4 py-3">{payment.studentId.classLevel}</td>
                    <td className="px-4 py-3">{payment.term.charAt(0).toUpperCase() + payment.term.slice(1)}</td>
                    <td className="px-4 py-3">{payment.feeType.charAt(0).toUpperCase() + payment.feeType.slice(1)}</td>
                    <td className="px-4 py-3">{formatCurrency(payment.totalAmount)}</td>
                    <td className="px-4 py-3">{formatCurrency(installment.amount)}</td>
                    <td className="px-4 py-3">{formatCurrency(payment.balance)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClasses(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="flex px-4 py-3 space-x-2">
                      {installment.proofOfPaymentUrl && (
                        <button
                          className="flex items-center gap-1 px-3 py-1 text-xs text-white rounded-md bg-cyan-600 hover:bg-cyan-700"
                          onClick={() => handleViewProof(installment.proofOfPaymentUrl)}
                        >
                          <FaEye /> View Proof
                        </button>
                      )}
                      {profile && (profile.role === "admin" || profile.role === "superadmin") && !installment.approved && (
                        <button
                          className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                          onClick={() => handleApprove(payment._id, installment._id)}
                          disabled={approving}
                        >
                          <FaCheckCircle /> Approve
                        </button>
                      )}
                      {installment.receiptUrl && (
                        <button
                          className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-gray-600 rounded-md hover:bg-gray-700 disabled:bg-gray-400"
                          onClick={() => handleViewReceipt(payment._id, installment._id)}
                          disabled={receiptLoading}
                        >
                          <FaReceipt /> Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-gray-600">No payments found.</p>
      )}
    </div>
  );
};

export default BillingTable;