import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const ManualPaymentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    feeType: "",
    description: "",
    session: "",
    term: "",
    totalAmount: "",
    amount: "",
    method: "manual",
    status: "pending",
    image: null,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Manual Payment</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="Student ID"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <select
            name="feeType"
            value={formData.feeType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select Fee Type</option>
            <option value="tuition">Tuition</option>
            <option value="admission">Admission</option>
            <option value="exam">Exam</option>
            <option value="party">Party</option>
            <option value="others">Others</option>
          </select>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            name="session"
            value={formData.session}
            onChange={handleChange}
            placeholder="Session (e.g. 2024/2025)"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <select
            name="term"
            value={formData.term}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select Term</option>
            <option value="first">First</option>
            <option value="second">Second</option>
            <option value="third">Third</option>
          </select>
          <input
            type="number"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            placeholder="Total Amount"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Paid Amount"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white bg-gray-500 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualPaymentModal;
