import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchPayment } from "../../redux/features/paymentSlice";
import { baseUrl } from "../../utils/baseUrl";
import {
  FiUser,
  FiCheckCircle,
  FiEye,
  FiClock,
  FiSearch,
  FiFilter,
} from "react-icons/fi";

const BillingComponent2 = () => {
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector((state) => state.payment || {});

  // Filters & UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [feeTypeFilter, setFeeTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [approving, setApproving] = useState({});
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Fetch initial payments (Redux action)
  useEffect(() => {
    dispatch(fetchPayment());
  }, [dispatch]);

  // Ensure we always work with an array (fixes "map is not a function")
  const safePaymentsArray = useMemo(() => {
    if (Array.isArray(payments)) return payments;
    // If backend returned { payments: [...] } or similar
    if (payments && Array.isArray(payments.payments)) return payments.payments;
    return [];
  }, [payments]);

  // Compute filtered payments stable & efficiently
  const filteredPayments = useMemo(() => {
    return safePaymentsArray.filter((payment) => {
      // Safe guards
      const student = payment.studentId || {};
      const studentName = `${student.firstName || ""} ${student.surName || ""}`.trim().toLowerCase();

      const searchMatch =
        searchTerm === "" ||
        studentName.includes(searchTerm.toLowerCase()) ||
        (payment.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment._id || "").toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter === "all" || payment.status === statusFilter;
      const feeTypeMatch = feeTypeFilter === "all" || payment.feeType === feeTypeFilter;

      // Method filter - check installments safely
     // const installmentsArr = Array.isArray(payment.installments) ? payment.installments : [];
      const methodMatch =
        feeTypeFilter === "all" || // keep previous logic intact: methodFilter not used here
        true;

      // combine
      return searchMatch && statusMatch && feeTypeMatch && methodMatch;
    });
  }, [safePaymentsArray, searchTerm, feeTypeFilter, statusFilter]);

  // Approve installment handler (keeps user's original API shape)
  const handleApproval = async (paymentId, installmentId) => {
    setApproving((p) => ({ ...p, [`${paymentId}-${installmentId}`]: true }));

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");

      const response = await axios.put(
        `${baseUrl}/payment/approve-payment`,
        { paymentId, installmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.success) {
        // refresh store
        dispatch(fetchPayment());
        alert("Payment approved successfully");
      } else {
        const msg = response?.data?.message || "Failed to approve payment";
        throw new Error(msg);
      }
    } catch (err) {
      console.error("Approval error:", err);
      if (err.response) {
        if (err.response.status === 401) alert("Unauthorized. Please login again.");
        else alert(err.response.data?.message || "Failed to approve payment");
      } else {
        alert(err.message || "Failed to approve payment");
      }
    } finally {
      setApproving((p) => ({ ...p, [`${paymentId}-${installmentId}`]: false }));
    }
  };

  // Helpers
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount || 0);

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" }) : "";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-700">Error loading payments: {String(error)}</p>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-gray-600">Manage and approve student payments</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Total Payments: {filteredPayments.length}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            <div className="lg:col-span-2">
              <div className="relative">
                <FiSearch className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search by student name, description, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="part payment">Part Payment</option>
              <option value="paid">Paid</option>
            </select>

            <select
              value={feeTypeFilter}
              onChange={(e) => setFeeTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Fee Types</option>
              <option value="tuition">Tuition</option>
              <option value="admission">Admission</option>
              <option value="exam">Exam</option>
              <option value="party">Party</option>
              <option value="others">Others</option>
            </select>

            <select
              value={"all"} // kept for parity if you want to re-add other filters later
              onChange={() => {}}
              className="hidden px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>placeholder</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="text-white bg-blue-600">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-left uppercase">Student</th>
                <th className="px-6 py-3 text-xs font-semibold text-left uppercase">Fee Details</th>
                <th className="px-6 py-3 text-xs font-semibold text-left uppercase">Amount</th>
                <th className="px-6 py-3 text-xs font-semibold text-left uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-left uppercase">Installments</th>
                <th className="px-6 py-3 text-xs font-semibold text-left uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(filteredPayments) && filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="transition hover:bg-gray-50">
                    {/* Student */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full">
                          <FiUser className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.studentId
                              ? `${payment.studentId.firstName} ${payment.studentId.surName}`
                              : "Unknown Student"}
                          </div>
                          <div className="text-sm text-gray-500">{payment.studentId?.classLevel || "N/A"}</div>
                        </div>
                      </div>
                    </td>

                    {/* Fee Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize mb-1">
                          {payment.feeType}
                        </span>
                        <div className="text-xs text-gray-500">{payment.description}</div>
                        <div className="text-xs text-gray-500">{payment.session} - {payment.term} term</div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{formatCurrency(payment.totalAmount)}</div>
                        <div className="text-xs text-red-600">Balance: {formatCurrency(payment.balance)}</div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'part payment' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>

                    {/* Installments */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {(Array.isArray(payment.installments) ? payment.installments : []).map((inst, idx) => (
                          <div key={inst._id || idx} className="p-2 text-xs rounded bg-gray-50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{formatCurrency(inst.amount)}</span>
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${inst.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {inst.approved ? 'Approved' : 'Pending'}
                              </span>
                            </div>
                            <div className="text-gray-500">{inst.method} • {formatDate(inst.date)}</div>

                            <div className="flex gap-2 mt-2">
                              {inst.receiptUrl && (
                                <button
                                  onClick={() => { setSelectedReceipt(inst.receiptUrl); setShowReceiptModal(true); }}
                                  className="inline-flex items-center px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                                >
                                  <FiEye className="w-3 h-3 mr-1" />
                                  View Receipt
                                </button>
                              )}

                              {!inst.approved && (
                                <button
                                  onClick={() => handleApproval(payment._id, inst._id)}
                                  disabled={approving[`${payment._id}-${inst._id}`]}
                                  className="inline-flex items-center px-2 py-1 text-xs text-green-700 bg-green-100 rounded hover:bg-green-200 disabled:opacity-50"
                                >
                                  {approving[`${payment._id}-${inst._id}`] ? (
                                    <>
                                      <FiClock className="w-3 h-3 mr-1 animate-spin" />
                                      Approving...
                                    </>
                                  ) : (
                                    <>
                                      <FiCheckCircle className="w-3 h-3 mr-1" />
                                      Approve
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <button className="mr-2 text-indigo-600 hover:text-indigo-900">View Details</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No payments found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Payment Receipt</h3>
              <button onClick={() => setShowReceiptModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-4">
              <img src={selectedReceipt} alt="Payment Receipt" className="h-auto max-w-full" onError={(e) => { e.target.src = ""; }} />
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <a href={selectedReceipt} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Download Receipt
              </a>
              <button onClick={() => setShowReceiptModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingComponent2;
