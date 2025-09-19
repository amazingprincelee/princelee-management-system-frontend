


import React, { useState, useEffect } from 'react';
import { 
  FaMoneyBillWave, 
  FaChartLine, 
  FaUsers, 
  FaExclamationTriangle,
  FaDownload,
  FaFilter,
  FaCalendarAlt,
  FaCreditCard,
  FaGraduationCap,
  FaFileInvoice,
  FaArrowUp,
  FaArrowDown,
  FaEye
} from 'react-icons/fa';
import axios from 'axios';
import { baseUrl } from '../../utils/baseUrl';

function FinancialReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    session: '',
    term: '',
    startDate: '',
    endDate: ''
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${baseUrl}/admin/financial-reports`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });

      setReports(response.data);
    } catch (error) {
      console.error('Error fetching financial reports:', error);
      console.error('Error details:', error.response?.data || error.message);
      console.error('Status:', error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const exportReport = () => {
    // This would implement CSV/PDF export functionality
    console.log('Exporting report...');
  };



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive financial insights and revenue analysis</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <FaFilter className="text-gray-500" />
          <select
            name="session"
            value={filters.session}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sessions</option>
            <option value="2024/2025">2024/2025</option>
            <option value="2023/2024">2023/2024</option>
          </select>
          <select
            name="term"
            value={filters.term}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Terms</option>
            <option value="first">First Term</option>
            <option value="second">Second Term</option>
            <option value="third">Third Term</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={exportReport}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <FaDownload />
            Export
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
               { id: 'overview', label: 'Overview', icon: FaChartLine },
               { id: 'revenue', label: 'Revenue Trends', icon: FaArrowUp },
               { id: 'fee-analysis', label: 'Fee Analysis', icon: FaFileInvoice },
               { id: 'class-analysis', label: 'Class Analysis', icon: FaGraduationCap },
               { id: 'debtors', label: 'Outstanding Debts', icon: FaExclamationTriangle }
             ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading financial reports...</span>
            </div>
          )}

          {/* No Data State */}
          {!loading && (!reports || !reports.summary) && (
            <div className="text-center py-12">
              <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Financial Data Available</h3>
              <p className="text-gray-500">There are no financial records to display at this time.</p>
            </div>
          )}

          {/* Overview Tab */}
          {!loading && activeTab === 'overview' && reports && reports.summary && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <FaMoneyBillWave className="text-blue-600 text-2xl mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Expected</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(reports.summary.totalFeesExpected)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                   <div className="flex items-center">
                     <FaArrowUp className="text-green-600 text-2xl mr-3" />
                     <div>
                       <p className="text-sm font-medium text-green-600">Total Collected</p>
                       <p className="text-2xl font-bold text-green-900">
                         {formatCurrency(reports.summary.totalPaid)}
                       </p>
                     </div>
                   </div>
                 </div>

                <div className="bg-red-50 p-6 rounded-lg">
                   <div className="flex items-center">
                     <FaArrowDown className="text-red-600 text-2xl mr-3" />
                     <div>
                       <p className="text-sm font-medium text-red-600">Outstanding</p>
                       <p className="text-2xl font-bold text-red-900">
                         {formatCurrency(reports.summary.totalBalance)}
                       </p>
                     </div>
                   </div>
                 </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <FaChartLine className="text-purple-600 text-2xl mr-3" />
                    <div>
                      <p className="text-sm font-medium text-purple-600">Collection Rate</p>
                      <p className="text-2xl font-bold text-purple-900">{reports.summary.collectionRate}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status Distribution */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status Distribution</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{reports.statusDistribution.completed}</div>
                    <div className="text-sm text-gray-500">Fully Paid</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">{reports.statusDistribution.partial}</div>
                    <div className="text-sm text-gray-500">Partial Payment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{reports.statusDistribution.pending}</div>
                    <div className="text-sm text-gray-500">Pending</div>
                  </div>
                </div>
              </div>

              {/* Recent Payments */}
              <div className="bg-white border rounded-lg">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reports.recentPayments.slice(0, 10).map((payment, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                              <div className="text-sm text-gray-500">{payment.admissionNumber}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.feeType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              payment.method === 'online' ? 'bg-blue-100 text-blue-800' :
                              payment.method === 'bank transfer' ? 'bg-green-100 text-green-800' :
                              payment.method === 'cash' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {payment.method}
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
              </div>
            </div>
          )}

          {/* Revenue Trends Tab */}
          {!loading && activeTab === 'revenue' && reports && reports.monthlyRevenue && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue Trends</h3>
              
              <div className="bg-white border rounded-lg p-6">
                <div className="grid gap-4">
                  {reports.monthlyRevenue.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-blue-500 mr-3" />
                        <span className="font-medium">{month.month}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(month.revenue)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fee Analysis Tab */}
          {!loading && activeTab === 'fee-analysis' && reports && reports.feeTypeAnalysis && reports.methodAnalysis && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Fee Type Analysis</h3>
              
              <div className="grid gap-4">
                {reports.feeTypeAnalysis.map((feeType, index) => (
                  <div key={index} className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 capitalize">{feeType.feeType}</h4>
                      <span className="text-2xl font-bold text-blue-600">{feeType.collectionRate}%</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Expected</p>
                        <p className="font-semibold">{formatCurrency(feeType.expected)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Collected</p>
                        <p className="font-semibold text-green-600">{formatCurrency(feeType.paid)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Outstanding</p>
                        <p className="font-semibold text-red-600">{formatCurrency(feeType.balance)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Count</p>
                        <p className="font-semibold">{feeType.count}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${feeType.collectionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods Distribution</h3>
                <div className="grid gap-4">
                  {reports.methodAnalysis.map((method, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <FaCreditCard className="text-blue-500 mr-3" />
                        <span className="font-medium capitalize">{method.method}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(method.amount)}</div>
                        <div className="text-sm text-gray-500">{method.percentage}% of total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Class Analysis Tab */}
          {!loading && activeTab === 'class-analysis' && reports && reports.classAnalysis && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Class Level Financial Analysis</h3>
              
              <div className="grid gap-4">
                {reports.classAnalysis.map((classData, index) => (
                  <div key={index} className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">{classData.classLevel}</h4>
                      <span className="text-2xl font-bold text-blue-600">{classData.collectionRate}%</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Expected</p>
                        <p className="font-semibold">{formatCurrency(classData.expected)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Collected</p>
                        <p className="font-semibold text-green-600">{formatCurrency(classData.paid)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Outstanding</p>
                        <p className="font-semibold text-red-600">{formatCurrency(classData.balance)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Students</p>
                        <p className="font-semibold">{classData.studentCount}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${classData.collectionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Debtors Tab */}
          {!loading && activeTab === 'debtors' && reports && reports.topDebtors && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Top Outstanding Debts</h3>
                <span className="text-sm text-gray-500">{reports.topDebtors.length} debtors</span>
              </div>
              
              <div className="grid gap-4">
                {reports.topDebtors.map((debtor, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{debtor.studentName}</h4>
                            <p className="text-sm text-gray-500">
                              {debtor.admissionNumber} • {debtor.classLevel} • {debtor.feeType}
                            </p>
                            <p className="text-xs text-gray-400">{debtor.session} - {debtor.term} term</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">{formatCurrency(debtor.balance)}</p>
                        <p className="text-sm text-gray-500">of {formatCurrency(debtor.totalAmount)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FinancialReports;