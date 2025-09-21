import React from 'react';
import { FaTimes, FaDownload, FaWhatsapp, FaPrint } from 'react-icons/fa';

const Receipt = ({ isOpen, onClose, receiptData }) => {
  if (!isOpen || !receiptData) return null;

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  };

  const handleDownload = () => {
    // Create a printable version of the receipt
    const printWindow = window.open('', '_blank');
    const receiptHTML = generateReceiptHTML();
    
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const handleWhatsAppShare = () => {
    const message = `Payment Receipt for ${receiptData.student.name}
Receipt ID: ${receiptData.receiptId}
Amount Paid: ${formatCurrency(receiptData.payment.amountPaid)}
Date: ${receiptData.date}
Fee Type: ${receiptData.payment.feeType}
Session/Term: ${receiptData.payment.session} - ${receiptData.payment.term}
Balance: ${formatCurrency(receiptData.payment.balance)}

Thank you for your payment!`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const generateReceiptHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .receipt-container { max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; }
          .school-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .school-address { font-size: 14px; color: #666; }
          .school-motto { font-size: 12px; color: #888; font-style: italic; }
          .receipt-title { font-size: 20px; font-weight: bold; text-align: center; margin: 30px 0; text-decoration: underline; }
          .receipt-details { margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
          .label { font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="school-name">${receiptData.school.name}</div>
            <div class="school-address">${receiptData.school.address}</div>
            ${receiptData.school.motto ? `<div class="school-motto">Motto: ${receiptData.school.motto}</div>` : ''}
          </div>
          
          <div class="receipt-title">PAYMENT RECEIPT</div>
          
          <div class="receipt-details">
            <div class="detail-row">
              <span class="label">Receipt ID:</span>
              <span>${receiptData.receiptId}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date:</span>
              <span>${receiptData.date}</span>
            </div>
            <div class="detail-row">
              <span class="label">Student:</span>
              <span>${receiptData.student.name}</span>
            </div>
            <div class="detail-row">
              <span class="label">Admission No:</span>
              <span>${receiptData.student.admissionNumber}</span>
            </div>
            <div class="detail-row">
              <span class="label">Class:</span>
              <span>${receiptData.student.class}</span>
            </div>
            <div class="detail-row">
              <span class="label">Fee Type:</span>
              <span>${receiptData.payment.feeType}</span>
            </div>
            <div class="detail-row">
              <span class="label">Description:</span>
              <span>${receiptData.payment.description}</span>
            </div>
            <div class="detail-row">
              <span class="label">Session/Term:</span>
              <span>${receiptData.payment.session} - ${receiptData.payment.term}</span>
            </div>
            <div class="detail-row">
              <span class="label">Payment Method:</span>
              <span>${receiptData.payment.method}</span>
            </div>
            ${receiptData.payment.reference ? `
            <div class="detail-row">
              <span class="label">Reference:</span>
              <span>${receiptData.payment.reference}</span>
            </div>
            ` : ''}
            <div class="detail-row">
              <span class="label">Amount Paid:</span>
              <span>${formatCurrency(receiptData.payment.amountPaid)}</span>
            </div>
            <div class="detail-row">
              <span class="label">Total Amount:</span>
              <span>${formatCurrency(receiptData.payment.totalAmount)}</span>
            </div>
            <div class="detail-row">
              <span class="label">Balance:</span>
              <span>${formatCurrency(receiptData.payment.balance)}</span>
            </div>
            <div class="detail-row">
              <span class="label">Approved By:</span>
              <span>${receiptData.approver}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your payment.</p>
            <p>Generated on: ${receiptData.generatedAt}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Payment Receipt</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6">
          {/* School Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {receiptData.school.name}
            </h1>
            <p className="text-gray-600 mb-1">{receiptData.school.address}</p>
            {receiptData.school.motto && (
              <p className="text-sm text-gray-500 italic">
                Motto: {receiptData.school.motto}
              </p>
            )}
          </div>

          {/* Receipt Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 underline">
              PAYMENT RECEIPT
            </h2>
          </div>

          {/* Receipt Details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Receipt ID:</span>
              <span className="text-gray-600">{receiptData.receiptId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Date:</span>
              <span className="text-gray-600">{receiptData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Student:</span>
              <span className="text-gray-600">{receiptData.student.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Admission No:</span>
              <span className="text-gray-600">{receiptData.student.admissionNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Class:</span>
              <span className="text-gray-600">{receiptData.student.class}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Fee Type:</span>
              <span className="text-gray-600">{receiptData.payment.feeType}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Description:</span>
              <span className="text-gray-600">{receiptData.payment.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Session/Term:</span>
              <span className="text-gray-600">
                {receiptData.payment.session} - {receiptData.payment.term}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Payment Method:</span>
              <span className="text-gray-600">{receiptData.payment.method}</span>
            </div>
            {receiptData.payment.reference && (
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Reference:</span>
                <span className="text-gray-600">{receiptData.payment.reference}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold text-gray-700">Amount Paid:</span>
              <span className="text-gray-600 font-semibold">
                {formatCurrency(receiptData.payment.amountPaid)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Total Amount:</span>
              <span className="text-gray-600">
                {formatCurrency(receiptData.payment.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Balance:</span>
              <span className="text-gray-600">
                {formatCurrency(receiptData.payment.balance)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold text-gray-700">Approved By:</span>
              <span className="text-gray-600">{receiptData.approver}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            <p className="mb-1">Thank you for your payment.</p>
            <p>Generated on: {receiptData.generatedAt}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 p-6 border-t bg-gray-50">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaDownload size={16} />
            Download/Print
          </button>
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaWhatsapp size={16} />
            Share on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;