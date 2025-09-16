import React, { useEffect, useState } from "react";
import { baseUrl } from "../../utils/baseUrl";

function PaymentConfiguration() {
  // State management
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("flutterwave");

  const [flutterwaveData, setFlutterwaveData] = useState({
    flutterwaveSecret: "",
    flutterwavePublic: "",
    callbackUrl: ""
  });

  const [paystackData, setPaystackData] = useState({
    paystackSecret: "",
    paystackPublic: "",
    callbackUrl: ""
  });

  // Fetch payment configuration
  const fetchPaymentConfig = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${baseUrl}/config`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setConfig(data.configuration);
      } else {
        if (response.status === 404) {
          setConfig(null); // No configuration found yet
        } else {
          throw new Error(data.message || "Failed to fetch payment configuration");
        }
      }
    } catch (error) {
      setError(error.message);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update Flutterwave configuration
  const updateFlutterwaveConfig = async (configData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${baseUrl}/config/flutterwave/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(configData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setConfig(data.existingConfig || data.config);
        alert(data.message || "Flutterwave configuration updated successfully!");
        return true;
      } else {
        throw new Error(data.message || "Failed to update Flutterwave configuration");
      }
    } catch (error) {
      setError(error.message);
      alert(`Error: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update Paystack configuration
  const updatePaystackConfig = async (configData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${baseUrl}/config/paystack/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(configData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setConfig(data.config);
        alert(data.message || "Paystack configuration updated successfully!");
        return true;
      } else {
        throw new Error(data.message || "Failed to update Paystack configuration");
      }
    } catch (error) {
      setError(error.message);
      alert(`Error: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load payment config on component mount
  useEffect(() => {
    fetchPaymentConfig();
  }, []);

  // Update form data when config data changes
  useEffect(() => {
    if (config) {
      setFlutterwaveData({
        flutterwaveSecret: config.flutterwaveSecret || "",
        flutterwavePublic: config.flutterwavePublic || "",
        callbackUrl: config.callbackUrl || ""
      });

      setPaystackData({
        paystackSecret: config.paystackSecret || "",
        paystackPublic: config.paystackPublic || "",
        callbackUrl: config.callbackUrl || ""
      });
    }
  }, [config]);

  const handleFlutterwaveChange = (e) => {
    const { name, value } = e.target;
    setFlutterwaveData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaystackChange = (e) => {
    const { name, value } = e.target;
    setPaystackData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFlutterwaveSubmit = async (e) => {
    e.preventDefault();
    
    if (!flutterwaveData.flutterwaveSecret || !flutterwaveData.callbackUrl) {
      alert('Flutterwave secret key and callback URL are required');
      return;
    }

    const success = await updateFlutterwaveConfig(flutterwaveData);
    if (success) {
      fetchPaymentConfig(); // Refresh the data
    }
  };

  const handlePaystackSubmit = async (e) => {
    e.preventDefault();
    
    if (!paystackData.paystackSecret || !paystackData.callbackUrl) {
      alert('Paystack secret key and callback URL are required');
      return;
    }

    const success = await updatePaystackConfig(paystackData);
    if (success) {
      fetchPaymentConfig(); // Refresh the data
    }
  };

  const maskSecret = (secret) => {
    if (!secret) return '';
    if (secret.length <= 8) return secret;
    return secret.substring(0, 4) + '*'.repeat(secret.length - 8) + secret.substring(secret.length - 4);
  };

  if (loading && !config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl p-6 mx-auto bg-white">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Payment Configuration</h1>
        <p className="text-gray-600">Configure your payment gateways for school fees and other payments</p>
      </div>

      {error && (
        <div className="px-4 py-3 mb-6 text-red-700 bg-red-100 border border-red-400 rounded">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            Error: {error}
          </div>
        </div>
      )}

      {/* Current Configuration Status */}
      <div className="p-6 mb-6 rounded-lg bg-gray-50">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Configuration Status</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-3 text-2xl">💳</span>
                <div>
                  <h3 className="font-medium text-gray-900">Flutterwave</h3>
                  <p className="text-sm text-gray-600">
                    {config?.flutterwaveSecret ? 'Configured' : 'Not configured'}
                  </p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                config?.flutterwaveSecret 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {config?.flutterwaveSecret ? '✓ Active' : '✗ Inactive'}
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-3 text-2xl">🏦</span>
                <div>
                  <h3 className="font-medium text-gray-900">Paystack</h3>
                  <p className="text-sm text-gray-600">
                    {config?.paystackSecret ? 'Configured' : 'Not configured'}
                  </p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                config?.paystackSecret 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {config?.paystackSecret ? '✓ Active' : '✗ Inactive'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'flutterwave', label: 'Flutterwave Config', icon: '💳' },
            { id: 'paystack', label: 'Paystack Config', icon: '🏦' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Flutterwave Configuration Tab */}
      {activeTab === 'flutterwave' && (
        <div className="p-6 rounded-lg bg-gray-50">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Flutterwave Configuration</h2>
            <p className="text-gray-600">Configure your Flutterwave payment gateway settings</p>
          </div>
          
          <div className="space-y-6">
            {/* Current Configuration Display */}
            {config?.flutterwaveSecret && (
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <h3 className="mb-2 font-medium text-blue-900">Current Configuration</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  <p><strong>Secret Key:</strong> {maskSecret(config.flutterwaveSecret)}</p>
                  <p><strong>Public Key:</strong> {config.flutterwavePublic || 'Not set'}</p>
                  <p><strong>Callback URL:</strong> {config.callbackUrl || 'Not set'}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Secret Key *
                </label>
                <input
                  type="password"
                  name="flutterwaveSecret"
                  value={flutterwaveData.flutterwaveSecret}
                  onChange={handleFlutterwaveChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Flutterwave secret key"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Public Key
                </label>
                <input
                  type="text"
                  name="flutterwavePublic"
                  value={flutterwaveData.flutterwavePublic}
                  onChange={handleFlutterwaveChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Flutterwave public key"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Callback URL *
              </label>
              <input
                type="url"
                name="callbackUrl"
                value={flutterwaveData.callbackUrl}
                onChange={handleFlutterwaveChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://yourdomain.com/payment/callback"
              />
              <p className="mt-1 text-xs text-gray-500">
                URL where Flutterwave will send payment notifications
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleFlutterwaveSubmit}
                disabled={loading}
                className="px-6 py-2 text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Flutterwave Config'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paystack Configuration Tab */}
      {activeTab === 'paystack' && (
        <div className="p-6 rounded-lg bg-gray-50">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Paystack Configuration</h2>
            <p className="text-gray-600">Configure your Paystack payment gateway settings</p>
          </div>
          
          <div className="space-y-6">
            {/* Current Configuration Display */}
            {config?.paystackSecret && (
              <div className="p-4 border-l-4 border-green-500 bg-green-50">
                <h3 className="mb-2 font-medium text-green-900">Current Configuration</h3>
                <div className="space-y-1 text-sm text-green-800">
                  <p><strong>Secret Key:</strong> {maskSecret(config.paystackSecret)}</p>
                  <p><strong>Public Key:</strong> {config.paystackPublic || 'Not set'}</p>
                  <p><strong>Callback URL:</strong> {config.callbackUrl || 'Not set'}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Secret Key *
                </label>
                <input
                  type="password"
                  name="paystackSecret"
                  value={paystackData.paystackSecret}
                  onChange={handlePaystackChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Paystack secret key"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Public Key
                </label>
                <input
                  type="text"
                  name="paystackPublic"
                  value={paystackData.paystackPublic}
                  onChange={handlePaystackChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Paystack public key"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Callback URL *
              </label>
              <input
                type="url"
                name="callbackUrl"
                value={paystackData.callbackUrl}
                onChange={handlePaystackChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://yourdomain.com/payment/callback"
              />
              <p className="mt-1 text-xs text-gray-500">
                URL where Paystack will send payment notifications
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handlePaystackSubmit}
                disabled={loading}
                className="px-6 py-2 text-white transition duration-200 bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Paystack Config'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="p-4 mt-6 border-l-4 border-yellow-500 bg-yellow-50">
        <div className="flex items-start">
          <span className="mr-3 text-xl">🔒</span>
          <div>
            <h3 className="font-medium text-yellow-900">Security Notice</h3>
            <p className="text-sm text-yellow-800">
              Keep your API keys secure and never share them publicly. 
              Only authorized personnel should have access to this configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentConfiguration;