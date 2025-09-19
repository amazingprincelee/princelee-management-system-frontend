import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initiatePayment } from '../../redux/features/paymentSlice';
import { FaMoneyBillWave, FaCreditCard, FaHistory, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import { baseUrl } from '../../utils/baseUrl';

const ParentPayments = () => {
  const dispatch = useDispatch();
  const { initiatePaymentLoading, initiatePaymentError, initiatePayment: paymentResponse } = useSelector(state => state.payment);
  
  const [children, setChildren] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('make-payment');
  
  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    studentId: '',
    feeType: '',
    description: '',
    session: '',
    term: '',
    totalAmount: '',
    amount: '',
    method: 'flutterwave', // default to flutterwave
    email: '',
    name: ''
  });

  // Fetch children and payment data
  useEffect(() => {
    fetchChildrenAndPayments();
  }, []);

  const fetchChildrenAndPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch children
      const childrenResponse = await axios.get(`${baseUrl}/parent/children`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch payment summary/history
      const paymentsResponse = await axios.get(`${baseUrl}/parent/payment-summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setChildren(childrenResponse.data.children || []);
      setPaymentHistory(paymentsResponse.data.payments || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStudentSelect = (studentId) => {
    const selectedStudent = children.find(child => child._id === studentId);
    if (selectedStudent) {
      setPaymentForm(prev => ({
        ...prev,
        studentId,
        email: selectedStudent.parentInfo?.email || '',
        name: `${selectedStudent.firstName} ${selectedStudent.surName}`
      }));
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentForm.studentId || !paymentForm.amount || !paymentForm.feeType) {
      alert('Please fill in all required fields');
      return;
    }

    // Generate unique reference
    const reference = `SCH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const paymentData = {
      ...paymentForm,
      reference,
      amount: parseFloat(paymentForm.amount),
      totalAmount: parseFloat(paymentForm.totalAmount || paymentForm.amount)
    };

    try {
      const result = await dispatch(initiatePayment(paymentData)).unwrap();
      
      if (result.success && result.paymentLink) {
        // Redirect to payment gateway
        window.open(result.paymentLink, '_blank');
        
        // Refresh payment history after a delay
        setTimeout(() => {
          fetchChildrenAndPayments();
        }, 2000);
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="text-4xl text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Center</h1>
          <p className="text-gray-600">Make payments and view payment history for your children</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('make-payment')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'make-payment'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaCreditCard className="inline mr-2" />
                Make Payment
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaHistory className="inline mr-2" />
                Payment History
              </button>
            </nav>
          </div>
        </div>

        {/* Make Payment Tab */}
        {activeTab === 'make-payment' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FaMoneyBillWave className="mr-2 text-green-600" />
              Make Online Payment
            </h2>

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Student *
                  </label>
                  <select
                    name="studentId"
                    value={paymentForm.studentId}
                    onChange={(e) => handleStudentSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Choose a student</option>
                    {children.map(child => (
                      <option key={child._id} value={child._id}>
                        {child.firstName} {child.surName} - {child.admissionNumber}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fee Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fee Type *
                  </label>
                  <select
                    name="feeType"
                    value={paymentForm.feeType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select fee type</option>
                    <option value="tuition">Tuition Fee</option>
                    <option value="development">Development Fee</option>
                    <option value="sports">Sports Fee</option>
                    <option value="library">Library Fee</option>
                    <option value="laboratory">Laboratory Fee</option>
                    <option value="examination">Examination Fee</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Session */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Session *
                  </label>
                  <select
                    name="session"
                    value={paymentForm.session}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select session</option>
                    <option value="2023/2024">2023/2024</option>
                    <option value="2024/2025">2024/2025</option>
                    <option value="2025/2026">2025/2026</option>
                  </select>
                </div>

                {/* Term */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Term *
                  </label>
                  <select
                    name="term"
                    value={paymentForm.term}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select term</option>
                    <option value="first">First Term</option>
                    <option value="second">Second Term</option>
                    <option value="third">Third Term</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₦) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={paymentForm.amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    min="1"
                    required
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    name="method"
                    value={paymentForm.method}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="flutterwave">Flutterwave (Card, Bank Transfer, USSD)</option>
                    <option value="paystack">Paystack (Card, Bank Transfer)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={paymentForm.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional payment details..."
                />
              </div>

              {/* Error Display */}
              {initiatePaymentError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center">
                    <FaExclamationTriangle className="text-red-500 mr-2" />
                    <span className="text-red-700">{initiatePaymentError}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={initiatePaymentLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  {initiatePaymentLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCreditCard className="mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FaHistory className="mr-2 text-blue-600" />
              Payment History
            </h2>

            {paymentHistory.length === 0 ? (
              <div className="text-center py-8">
                <FaMoneyBillWave className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No payment history found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fee Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.map((payment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.studentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.feeType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentPayments;