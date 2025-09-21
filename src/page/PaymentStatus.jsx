import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentStatus = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get reference from URL parameters
        const urlParams = new URLSearchParams(location.search);
        const reference = urlParams.get('reference');

        if (!reference) {
          setError('Payment reference not found');
          setLoading(false);
          return;
        }

        // Check payment status
        const response = await axios.get(`/api/payment/status/${reference}`);
        
        if (response.data.success) {
          setPaymentData(response.data.payment);
        } else {
          setError(response.data.message || 'Payment not found');
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
        setError('Failed to check payment status. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [location.search]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return '✓';
      case 'pending':
        return '⏳';
      case 'failed':
        return '✗';
      default:
        return '?';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking payment status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">✗</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/parent/payments')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Payments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white text-center">
            <div className="text-6xl mb-4">
              {getStatusIcon(paymentData?.status)}
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Status</h1>
            <p className="text-blue-100">Transaction Details</p>
          </div>

          {/* Payment Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div className="col-span-full">
                <div className="flex items-center justify-center mb-6">
                  <span className={`px-4 py-2 rounded-full text-lg font-semibold ${getStatusColor(paymentData?.status)}`}>
                    {paymentData?.status?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Student Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Student Information</h3>
                <div>
                  <label className="text-sm font-medium text-gray-600">Student Name</label>
                  <p className="text-gray-800">{paymentData?.student?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-800">{paymentData?.student?.email}</p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Payment Information</h3>
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                  <p className="text-gray-800 text-xl font-bold">₦{paymentData?.amount?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Method</label>
                  <p className="text-gray-800 capitalize">{paymentData?.method}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Reference</label>
                  <p className="text-gray-800 font-mono text-sm">{paymentData?.reference}</p>
                </div>
              </div>

              {/* Fee Details */}
              <div className="col-span-full space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Fee Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fee Type</label>
                    <p className="text-gray-800">{paymentData?.feeType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Session</label>
                    <p className="text-gray-800">{paymentData?.session}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Term</label>
                    <p className="text-gray-800">{paymentData?.term}</p>
                  </div>
                </div>
                {paymentData?.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <p className="text-gray-800">{paymentData?.description}</p>
                  </div>
                )}
              </div>

              {/* Payment Date */}
              {paymentData?.paidAt && (
                <div className="col-span-full">
                  <label className="text-sm font-medium text-gray-600">Payment Date</label>
                  <p className="text-gray-800">{new Date(paymentData.paidAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/parent/payments')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Payments
              </button>
              {paymentData?.status?.toLowerCase() === 'paid' && (
                <button
                  onClick={() => window.print()}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Print Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;