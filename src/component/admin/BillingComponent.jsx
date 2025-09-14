

  // Filters & UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [feeTypeFilter, setFeeTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [approving, setApproving] = useState({});
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);



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