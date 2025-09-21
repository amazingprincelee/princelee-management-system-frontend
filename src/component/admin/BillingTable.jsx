import { FaEye, FaCheckCircle, FaReceipt, FaDownload, FaWhatsapp } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPayment, approvePayment, getReceiptData } from "../../redux/features/paymentSlice";
import { fetchUserProfile } from "../../redux/features/userSlice";
import { FiSearch } from "react-icons/fi";
import Receipt from "./modal/Receipt";

const BillingTable = () => {
  const dispatch = useDispatch();
  const { payments, loading, error, approving, approveError, receiptData, receiptLoading } = useSelector(
    (state) => state.payment || {}
  );
  const { user, loading: userLoading, error: userError } = useSelector(
    (state) => state.user || {}
  );
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
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchPayment(filters));
  }, [dispatch, filters]);

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

  const handleViewProof = (proofUrl) => {
    setSelectedProofUrl(proofUrl);
    setModalOpen(true);
  };

  const handleViewReceipt = (paymentId, installmentId) => {
    dispatch(getReceiptData({ paymentId, installmentId }));
    setReceiptModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProofUrl(null);
  };

  const closeReceiptModal = () => {
    setReceiptModalOpen(false);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "part payment":
        return "bg-primary text-primary-800";
      case "paid":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const formatCurrency = (amount) =>
    `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

  const isAdmin =
    user && (user.role === "admin" || user.role === "superadmin");

  return (
    <div className="min-h-screen p-4 bg-gray-100 sm:p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 sm:text-2xl">
        All Bills
      </h2>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:flex-wrap">
        <div className="flex items-center w-full gap-2 sm:w-auto">
          <FiSearch className="text-gray-600" />
          <input
            type="text"
            name="studentName"
            value={filters.studentName}
            onChange={handleFilterChange}
            placeholder="Search by student name"
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light sm:w-64"
          />
        </div>
        {["session", "term", "status", "feeType", "classLevel"].map((key) => (
          <select
            key={key}
            name={key}
            value={filters[key]}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light sm:w-auto"
          >
            <option value="">
              All {key.charAt(0).toUpperCase() + key.slice(1)}
            </option>
            {key === "session" && (
              <>
                <option value="2024/2025">2024/2025</option>
                <option value="2025/2026">2025/2026</option>
              </>
            )}
            {key === "term" && (
              <>
                <option value="first">First</option>
                <option value="second">Second</option>
                <option value="third">Third</option>
              </>
            )}
            {key === "status" && (
              <>
                <option value="pending">Pending</option>
                <option value="part payment">Part Payment</option>
                <option value="paid">Paid</option>
              </>
            )}
            {key === "feeType" && (
              <>
                <option value="tuition">Tuition</option>
                <option value="admission">Admission</option>
                <option value="exam">Exam</option>
                <option value="party">Party</option>
                <option value="others">Others</option>
              </>
            )}
            {key === "classLevel" && (
              <>
                <option value="basic 1">Basic 1</option>
                <option value="jss 2">JSS 2</option>
                <option value="sss 2">SSS 2</option>
              </>
            )}
          </select>
        ))}
      </div>

      {/* States */}
      {loading && <p className="text-primary-600">Loading payments...</p>}
      {error && <p className="text-red-600">Error: {error.message || error}</p>}
      {userLoading && <p className="text-primary-600">Loading user profile...</p>}
      {userError && (
        <p className="text-red-600">User Error: {userError.message || userError}</p>
      )}
      {approveError && (
        <p className="text-red-600">
          Approve Error: {approveError.message || approveError}
        </p>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg">
            <h3 className="mb-4 text-lg font-semibold">Proof of Payment</h3>
            {selectedProofUrl ? (
              <div className="mb-4">
                <img
                  src={selectedProofUrl}
                  alt="Proof of Payment"
                  className="object-contain w-full h-auto max-h-96"
                />
                <a
                  href={selectedProofUrl}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-white bg-primary rounded-md hover:bg-blue-600"
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

      {/* Payments */}
      {!loading && payments && payments.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto shadow-lg rounded-xl md:block">
            <table className="min-w-full text-sm bg-white rounded-lg">
              <thead>
                <tr className="text-xs text-white uppercase bg-primary sm:text-sm">
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
                    <tr
                      key={`${payment._id}-${installment._id}`}
                      className={
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }
                    >
                      <td className="px-4 py-3">{`${payment.studentId.firstName} ${payment.studentId.surName}`}</td>
                      <td className="px-4 py-3">{payment.studentId.classLevel}</td>
                      <td className="px-4 py-3">
                        {payment.term.charAt(0).toUpperCase() +
                          payment.term.slice(1)}
                      </td>
                      <td className="px-4 py-3">
                        {payment.feeType.charAt(0).toUpperCase() +
                          payment.feeType.slice(1)}
                      </td>
                      <td className="px-4 py-3">
                        {formatCurrency(payment.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        {formatCurrency(installment.amount)}
                      </td>
                      <td className="px-4 py-3">
                        {formatCurrency(payment.balance)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClasses(
                            payment.status
                          )}`}
                        >
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col flex-wrap gap-1 sm:flex-row">
                          {installment.proofOfPaymentUrl && (
                            <button
                              className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white rounded-md bg-cyan-600 hover:bg-cyan-700"
                              onClick={() =>
                                handleViewProof(installment.proofOfPaymentUrl)
                              }
                            >
                              <FaEye /> View Proof
                            </button>
                          )}
                          {isAdmin &&
                            !installment.approved &&
                            installment.proofOfPaymentUrl && (
                              <button
                                className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                                onClick={() =>
                                  handleApprove(payment._id, installment._id)
                                }
                                disabled={approving}
                              >
                                <FaCheckCircle />{" "}
                                {approving ? "Approving..." : "Approve"}
                              </button>
                            )}
                          {installment.approved && (
                            <button
                              onClick={() => handleViewReceipt(payment._id, installment._id)}
                              className="flex items-center justify-center gap-1 px-2 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700"
                            >
                              <FaReceipt /> Receipt
                            </button>
                          )}
                          <span
                            className={`px-2 py-1 text-xs text-center rounded ${
                              installment.approved
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {installment.approved
                              ? "Approved"
                              : "Needs Approval"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {payments.map((payment) =>
              payment.installments.map((installment) => (
                <div
                  key={`${payment._id}-${installment._id}`}
                  className="p-4 bg-white rounded-lg shadow-md"
                >
                  <div className="mb-2 text-sm font-semibold text-gray-700">
                    {payment.studentId.firstName} {payment.studentId.surName}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <span>Class: {payment.studentId.classLevel}</span>
                    <span>
                      Term:{" "}
                      {payment.term.charAt(0).toUpperCase() +
                        payment.term.slice(1)}
                    </span>
                    <span>
                      Fee:{" "}
                      {payment.feeType.charAt(0).toUpperCase() +
                        payment.feeType.slice(1)}
                    </span>
                    <span>Total: {formatCurrency(payment.totalAmount)}</span>
                    <span>Paid: {formatCurrency(installment.amount)}</span>
                    <span>Balance: {formatCurrency(payment.balance)}</span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusClasses(
                        payment.status
                      )}`}
                    >
                      {payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {installment.proofOfPaymentUrl && (
                      <button
                        className="flex items-center gap-1 px-2 py-1 text-xs text-white rounded-md bg-cyan-600 hover:bg-cyan-700"
                        onClick={() =>
                          handleViewProof(installment.proofOfPaymentUrl)
                        }
                      >
                        <FaEye /> View
                      </button>
                    )}
                    {isAdmin &&
                      !installment.approved &&
                      installment.proofOfPaymentUrl && (
                        <button
                          className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                          onClick={() =>
                            handleApprove(payment._id, installment._id)
                          }
                          disabled={approving}
                        >
                          <FaCheckCircle />{" "}
                          {approving ? "Approving..." : "Approve"}
                        </button>
                      )}
                    {installment.approved && (
                      <button
                        onClick={() => handleViewReceipt(payment._id, installment._id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700"
                      >
                        <FaReceipt /> Receipt
                      </button>
                    )}
                  </div>
                  <div className="mt-2 text-xs">
                    {installment.approved ? (
                      <span className="text-green-600">Approved</span>
                    ) : (
                      <span className="text-red-600">Needs Approval</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        !loading && <p className="text-gray-600">No payments found.</p>
      )}

      {/* Receipt Modal */}
      <Receipt
        isOpen={receiptModalOpen}
        onClose={closeReceiptModal}
        receiptData={receiptData}
      />
    </div>
  );
};

export default BillingTable;
