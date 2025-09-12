import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchPayment } from "../../redux/features/paymentSlice";
import { useEffect, useState } from "react";
import { baseUrl } from "../../utils/baseUrl"
import { 
  FiSearch, 
  FiFilter, 
  FiCheckCircle, 
  FiClock, 
  FiEye, 
  FiX, 
  FiCalendar,
  FiCreditCard,
  FiUser,
  FiDownload
} from "react-icons/fi";

function ApprovePaymentComponent() {
  const { payments, loading, error } = useSelector((state) => state.payment);
  const dispatch = useDispatch();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feeTypeFilter, setFeeTypeFilter] = useState("all");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [termFilter, setTermFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  
  // Modal states
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [approving, setApproving] = useState({});

  useEffect(() => {
    dispatch(fetchPayment());
  }, [dispatch]);

  // Filter payments based on all criteria
  const filteredPayments = payments?.filter(payment => {
    const student = payment.studentId;
    const studentName = student ? `${student.firstName} ${student.surName}`.toLowerCase() : '';
    const searchMatch = searchTerm === '' || 
      studentName.includes(searchTerm.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment._id.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = statusFilter === 'all' || payment.status === statusFilter;
    const feeTypeMatch = feeTypeFilter === 'all' || payment.feeType === feeTypeFilter;
    const sessionMatch = sessionFilter === 'all' || payment.session === sessionFilter;
    const termMatch = termFilter === 'all' || payment.term === termFilter;
    
    // Method filter - check installments
    const methodMatch = methodFilter === 'all' || 
      payment.installments.some(inst => inst.method === methodFilter);
    
    // Approval filter - check installments
    const approvalMatch = approvalFilter === 'all' || 
      (approvalFilter === 'approved' && payment.installments.some(inst => inst.approved)) ||
      (approvalFilter === 'pending' && payment.installments.some(inst => !inst.approved));

    return searchMatch && statusMatch && feeTypeMatch && sessionMatch && 
           termMatch && methodMatch && approvalMatch;
  }) || [];

  // Get unique values for filters
  const uniqueSessions = [...new Set(payments?.map(p => p.session) || [])];
  const uniqueMethods = [...new Set(payments?.flatMap(p => p.installments.map(i => i.method)) || [])];

  // Handle payment approval
  const handleApproval = async (paymentId, installmentId) => {
  setApproving(prev => ({ ...prev, [`${paymentId}-${installmentId}`]: true }));

  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.put(
      `${baseUrl}/payment/approve-payment`,
      {
        paymentId,
        installmentId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Check if the response indicates success
    if (response.data.success) {
      // Refresh payments data
      dispatch(fetchPayment());
      alert('Payment approved successfully!');
    } else {
      throw new Error(response.data.message || 'Failed to approve payment');
    }
  } catch (error) {
    console.error('Approval error:', error);
    let errorMessage = 'Failed to approve payment. Please try again.';
    
    if (error.response) {
      // Handle specific backend errors
      if (error.response.status === 401) {
        errorMessage = 'Unauthorized: Invalid or expired token';
      } else if (error.response.status === 404) {
        errorMessage = error.response.data.message || 'Payment or installment not found';
      } else if (error.response.status === 400) {
        errorMessage = error.response.data.message || 'Installment already approved';
      }
    }
    
    alert(errorMessage);
  } finally {
    setApproving(prev => ({ ...prev, [`${paymentId}-${installmentId}`]: false }));
  }
};
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading payments: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-gray-600">Manage and approve student payments</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Total Payments: {filteredPayments.length}</span>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by student name, description, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
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

            {/* Fee Type Filter */}
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

            {/* Session Filter */}
            <select
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Sessions</option>
              {uniqueSessions.map(session => (
                <option key={session} value={session}>{session}</option>
              ))}
            </select>

            {/* Term Filter */}
            <select
              value={termFilter}
              onChange={(e) => setTermFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Terms</option>
              <option value="first">First Term</option>
              <option value="second">Second Term</option>
              <option value="third">Third Term</option>
            </select>

            {/* Approval Filter */}
            <select
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Approvals</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Installments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  {/* Student Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <FiUser className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.studentId ? 
                            `${payment.studentId.firstName} ${payment.studentId.surName}` : 
                            'Unknown Student'
                          }
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.studentId?.classLevel || 'N/A'}
                        </div>
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
                      {payment.installments.map((installment) => (
                        <div key={installment._id} className="text-xs bg-gray-50 p-2 rounded">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{formatCurrency(installment.amount)}</span>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                              installment.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {installment.approved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                          <div className="text-gray-500">
                            {installment.method} • {formatDate(installment.date)}
                          </div>
                          
                          <div className="flex gap-2 mt-2">
                            {installment.receiptUrl && (
                              <button
                                onClick={() => {
                                  setSelectedReceipt(installment.receiptUrl);
                                  setShowReceiptModal(true);
                                }}
                                className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              >
                                <FiEye className="h-3 w-3 mr-1" />
                                View Receipt
                              </button>
                            )}
                            
                            {!installment.approved && (
                              <button
                                onClick={() => handleApproval(payment._id, installment._id)}
                                disabled={approving[`${payment._id}-${installment._id}`]}
                                className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                              >
                                {approving[`${payment._id}-${installment._id}`] ? (
                                  <>
                                    <FiClock className="h-3 w-3 mr-1 animate-spin" />
                                    Approving...
                                  </>
                                ) : (
                                  <>
                                    <FiCheckCircle className="h-3 w-3 mr-1" />
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

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No payments found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Payment Receipt</h3>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedReceipt}
                alt="Payment Receipt"
                className="max-w-full h-auto"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBWMTMwTTcwIDEwMEgxMzAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                }}
              />
            </div>
            <div className="p-4 border-t">
              <a
                href={selectedReceipt}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiDownload className="h-4 w-4 mr-2" />
                Download Receipt
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApprovePaymentComponent;