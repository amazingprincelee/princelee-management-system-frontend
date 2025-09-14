import { FaEye, FaCheckCircle, FaReceipt, FaDownload, FaWhatsapp } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPayment, approvePayment, getReceipt } from "../../redux/features/paymentSlice";
import { fetchUserProfile } from "../../redux/features/userSlice";
import { FiSearch } from "react-icons/fi";

const BillingTable = () => {
  const dispatch = useDispatch();
  const { payments, loading, error, approving, approveError, receipt, receiptLoading, receiptError } = useSelector(
    (state) => state.payment || {}
  );
  const { profile, loading: userLoading, error: userError } = useSelector((state) => state.user || {});
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

  const handleShareOnWhatsApp = (receiptUrl, studentName, amount) => {
    const message = `Payment Receipt for ${studentName}\nAmount: ${formatCurrency(amount)}\nReceipt: ${receiptUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
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

  const formatCurrency = (amount) => `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

  // Check if user is admin
  const isAdmin = profile && (profile.role === "admin" || profile.role === "superadmin");

  return (
    <div className="min-h-screen p-4 bg-gray-100 sm:p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 sm:text-2xl">All Bills</h2>

      {/* Filter and Search Controls */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:flex-wrap">
        <div className="flex items-center w-full gap-2 sm:w-auto">
          <FiSearch className="text-gray-600" />
          <input
            type="text"
            name="studentName"
            value={filters.studentName}
            onChange={handleFilterChange}
            placeholder="Search by student name"
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
          />
        </div>
        <select
          name="session"
          value={filters.session}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
        >
          <option value="">All Sessions</option>
          <option value="2024/2025">2024/2025</option>
          <option value="2025/2026">2025/2026</option>
        </select>
        <select
          name="term"
          value={filters.term}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
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
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
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
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
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
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
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
      {userLoading && <p className="text-blue-600">Loading user profile...</p>}
      {userError && <p className="text-red-600">User Error: {userError.message || userError}</p>}
      {approveError && <p className="text-red-600">Approve Error: {approveError.message || approveError}</p>}
      {receiptError && <p className="text-red-600">Receipt Error: {receiptError.message || receiptError}</p>}

      {/* Receipt Notification */}
      {receipt && receipt.receiptUrl && (
        <div className="p-4 mb-4 border border-green-200 rounded-md bg-green-50">
          <p className="font-medium text-green-600">Receipt available!</p>
          <div className="flex flex-col gap-2 mt-2 sm:flex-row">
            <a
              href={receipt.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <FaDownload /> Download Receipt
            </a>
            <button
              onClick={() => handleShareOnWhatsApp(receipt.receiptUrl, "Student", 0)}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              <FaWhatsapp /> Share on WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* Modal for Proof of Payment */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-50">
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
          <table className="min-w-full text-xs bg-white rounded-lg sm:text-sm">
            <thead>
              <tr className="text-xs text-white uppercase bg-blue-600 sm:text-sm">
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
                    <td className="px-4 py-3">
                      <div className="flex flex-col flex-wrap gap-1 sm:flex-row">
                        {installment.proofOfPaymentUrl && (
                          <button
                            className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white rounded-md bg-cyan-600 hover:bg-cyan-700"
                            onClick={() => handleViewProof(installment.proofOfPaymentUrl)}
                            title="View proof of payment"
                          >
                            <FaEye /> View Proof
                          </button>
                        )}

                        {isAdmin && !installment.approved && installment.proofOfPaymentUrl && (
                          <button
                            className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                            onClick={() => handleApprove(payment._id, installment._id)}
                            disabled={approving}
                            title="Approve this payment"
                          >
                            <FaCheckCircle /> {approving ? "Approving..." : "Approve"}
                          </button>
                        )}

                        {installment.approved && installment.receiptUrl && (
                          <button
                            className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-400"
                            onClick={() => handleViewReceipt(payment._id, installment._id)}
                            disabled={receiptLoading}
                            title="View/Download receipt"
                          >
                            <FaReceipt /> {receiptLoading ? "Loading..." : "Receipt"}
                          </button>
                        )}

                        {installment.receiptUrl && (
                          <button
                            className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white bg-green-500 rounded-md hover:bg-green-600"
                            onClick={() =>
                              handleShareOnWhatsApp(
                                installment.receiptUrl,
                                `${payment.studentId.firstName} ${payment.studentId.surName}`,
                                installment.amount
                              )
                            }
                            title="Share receipt on WhatsApp"
                          >
                            <FaWhatsapp /> Share
                          </button>
                        )}

                        <span
                          className={`px-2 py-1 text-xs text-center rounded ${
                            installment.approved ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {installment.approved ? "Approved" : "Needs Approval"}
                        </span>
                      </div>
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
