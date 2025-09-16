import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addPayment } from "../../../redux/features/paymentSlice";
import { fetchStudents } from "../../../redux/features/studentSlice";

function AddPayment() {
  const dispatch = useDispatch();
  const { addPaymentLoading, addPaymentError } = useSelector(
    (state) => state.payment
  );
  const { students, loading: studentsLoading } = useSelector(
    (state) => state.students
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // generate academic session dynamically (e.g. "2024/2025")
  const getCurrentSession = () => {
    const now = new Date();
    const year = now.getFullYear();
    return `${year}/${year + 1}`;
  };

  const [formData, setFormData] = useState({
    studentId: "",
    feeType: "",
    description: "",
    session: getCurrentSession(),
    term: "",
    totalAmount: "",
    amount: "",
    method: "",
    image: null,
  });

  useEffect(() => {
    if (modalOpen) {
      dispatch(fetchStudents());
    }
  }, [modalOpen, dispatch]);

  const handleChange = (e) => {
    const { value, name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.studentId) {
      alert("Please select a student before saving.");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    dispatch(addPayment({ formData: data }))
      .unwrap()
      .then(() => {
        alert("Payment added successfully!");
        setModalOpen(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 🔍 filter students
  const filteredStudents = students?.filter((s) =>
    `${s.firstName} ${s.surName} ${s.admissionNumber} ${s.parentInfo?.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-start mt-6">
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 text-white bg-[#284ea1] rounded-md hover:bg-blue-700"
        >
          + Add Payment
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="p-6 bg-white rounded-lg w-96">
            <h2 className="mb-4 text-lg font-bold">Add Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* 🔍 Student search + dropdown */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search student by name, admission no, or email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  className="w-full p-2 border rounded"
                />

                {showDropdown && search.length > 1 && (
                  <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border rounded shadow max-h-48">
                    {studentsLoading ? (
                      <li className="p-2 text-gray-500">Loading students...</li>
                    ) : filteredStudents?.length > 0 ? (
                      filteredStudents.map((student) => (
                        <li
                          key={student._id}
                          onClick={() => {
                            setFormData({
                              ...formData,
                              studentId: student._id,
                            });
                            setSearch(
                              `${student.firstName} ${student.surName} (${student.admissionNumber})`
                            );
                            setShowDropdown(false);
                          }}
                          className={`p-2 cursor-pointer hover:bg-gray-100 ${
                            formData.studentId === student._id
                              ? "bg-blue-100"
                              : ""
                          }`}
                        >
                          <div className="font-semibold">
                            {student.firstName} {student.surName} (
                            {student.admissionNumber})
                          </div>
                          <div className="text-sm text-gray-600">
                            Parent: {student.parentInfo?.email}
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500">No results found</li>
                    )}
                  </ul>
                )}
                {formData.studentId && (
                  <p className="mt-1 text-sm text-green-600">
                    ✅ Student selected
                  </p>
                )}
              </div>

              {/* Fee Type */}
              <select
                name="feeType"
                value={formData.feeType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Fee Type</option>
                <option value="tuition">Tuition</option>
                <option value="admission">Admission</option>
                <option value="exam">Exam</option>
                <option value="party">Party</option>
                <option value="others">Others</option>
              </select>

              {/* Description */}
              <input
                name="description"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              {/* Session (auto-filled, still editable) */}
              <input
                name="session"
                placeholder="Session"
                value={formData.session}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              {/* Term */}
              <select
                name="term"
                value={formData.term}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Term</option>
                <option value="first">First</option>
                <option value="second">Second</option>
                <option value="third">Third</option>
              </select>

              {/* Amounts */}
              <input
                name="totalAmount"
                type="number"
                placeholder="Total Amount"
                value={formData.totalAmount}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                name="amount"
                type="number"
                placeholder="Installment Amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              {/* Payment Method */}
              <select
                name="method"
                value={formData.method}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Payment Method</option>
                <option value="bank transfer">Bank Transfer</option>
                <option value="pos">POS</option>
                <option value="cash">Cash</option>
              </select>

              {/* Upload slip */}
              <label className="flex justify-start" htmlFor="slip">Upload Payment Slip</label>
              <input
                id="slip"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 text-white bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addPaymentLoading}
                  className="px-3 py-2 text-white bg-blue-600 rounded"
                >
                  {addPaymentLoading ? "Saving..." : "Save"}
                </button>
              </div>
              {addPaymentError && (
                <p className="text-red-500">{addPaymentError}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddPayment;
