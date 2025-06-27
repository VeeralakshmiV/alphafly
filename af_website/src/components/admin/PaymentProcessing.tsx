import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, CreditCard, Calendar, DollarSign, FileText, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// TypeScript module augmentation for jsPDF to add autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

// Attach autoTable to jsPDF prototype for compatibility
(jsPDF as unknown as { API: { autoTable: typeof autoTable } }).API.autoTable = autoTable;

interface Student {
  id: string;
  name: string;
  course: string;
}

interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  courseName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  invoiceNumber: string;
}

const PaymentProcessing = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [newPayment, setNewPayment] = useState({
    studentId: "",
    amount: "",
    status: "pending" as Payment['status']
  });

  // Fetch students and payments on mount
  useEffect(() => {
    fetch("/api/students")
      .then(res => res.json())
      .then(data => setStudents(data));

    fetch("/api/payments")
      .then(res => res.json())
      .then(data => setPayments(data));
  }, []);

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const nextNumber = payments.length + 1;
    return `INV-2024-${String(nextNumber).padStart(3, '0')}`;
  };

  // Add payment
console.log("Student ID selected:", newPayment.studentId);
console.log("All student IDs:", students.map(s => s.id));
const handleAddPayment = async () => {
  if (!newPayment.studentId || !newPayment.amount) {
    toast({
      title: "Error",
      description: "Please select a student and enter amount",
      variant: "destructive"
    });
    return;
  }

  const student = students.find(s => String(s.id) === String(newPayment.studentId)); // Make sure IDs are compared as strings

  if (!student) {
    toast({
      title: "Error",
      description: "Student not found. Please try again.",
      variant: "destructive"
    });
    return;
  }

  const payment: Payment = {
    id: crypto.randomUUID(),
    studentId: student.id,
    studentName: student.name,
    courseName: student.course,
    amount: parseFloat(newPayment.amount),
    status: newPayment.status,
    date: new Date().toISOString().split("T")[0],
    invoiceNumber: generateInvoiceNumber()
  };

  const res = await fetch("/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment)
  });

  if (res.ok) {
    const updated = await fetch("/api/payments").then(r => r.json());
    setPayments(updated);
    setNewPayment({ studentId: "", amount: "", status: "pending" });
    toast({ title: "Success", description: "Payment added successfully" });
  } else {
    toast({ title: "Error", description: "Failed to save payment." });
  }
};



  // Download invoice as PDF
const downloadInvoice = (payment: Payment) => {
  try {
    const doc = new jsPDF();
    const formattedAmount = Number(payment.amount || 0).toFixed(2);
    const description = `Course Name - ${payment.courseName || "Course"}`;

    // Header
    doc.setFontSize(22);
    doc.text("INVOICE", 14, 18);
    doc.setFontSize(12);
    doc.text("AlphaFly Computer Education", 14, 28);
    doc.text("KS Complex, Subben Chetty Street, Near Old BusStand, Theni", 14, 34);
    doc.text("Phone: +91 8015 8016 89", 14, 40);
    doc.text("Date: " + new Date(payment.date).toLocaleDateString(), 150, 28);
    doc.text("Invoice #: " + (payment.invoiceNumber || "N/A"), 150, 34);
    doc.line(14, 44, 196, 44);

    // Bill To
    doc.setFontSize(14);
    doc.text("Bill To:", 14, 52);
    doc.setFontSize(12);
    doc.text(payment.studentName, 14, 58);
    doc.text("Course: " + (payment.courseName), 14, 64);

    // Table with course fee
    autoTable(doc, {
      startY: 74,
      head: [["Description", "Amount (INR)"]],
      body: [[payment.courseName, `₹${formattedAmount}`]],
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 12 },
    });

    // Footer
    const finalY = (doc as any).lastAutoTable?.finalY || 104;
    doc.setFontSize(12);
    doc.text("Status: " + (payment.status?.toUpperCase() || "N/A"), 14, finalY + 12);
    doc.text("Thank you for your business!", 14, finalY + 22);

    // Save PDF
    doc.save(`${payment.invoiceNumber || "invoice"}.pdf`);
  } catch (err: any) {
    toast({
      title: "Error",
      description: err.message || "Failed to generate invoice PDF",
    });
  }
};

  // Delete payment
  const handleDeletePayment = async (paymentId: string) => {
    // If you want to delete from backend, add fetch here
    setPayments(payments.filter(payment => payment.id !== paymentId));
    toast({ title: "Success", description: "Payment deleted successfully" });
  };

  const getStatusBadge = (status: Payment['status']) => {
    const variants = {
      completed: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      failed: "bg-red-100 text-red-800 border-red-200"
    };
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const failedPayments = payments.filter(p => p.status === 'failed').length;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{failedPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Payment Form */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plus className="h-6 w-6 text-blue-600" />
            Add New Payment
          </CardTitle>
          <CardDescription>
            Create a new payment record for a registered student
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student</Label>
              <select
                id="student"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                value={newPayment.studentId}
                onChange={e => setNewPayment({ ...newPayment, studentId: e.target.value })}
              >
                <option value="">Select student</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.course})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={newPayment.amount}
                onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                value={newPayment.status}
                onChange={e => setNewPayment({ ...newPayment, status: e.target.value as Payment['status'] })}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={handleAddPayment} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Payment Transactions
          </CardTitle>
          <CardDescription>
            View and manage all payment transactions with invoice download functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by student name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mb-4"
          />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments
                  .filter(p => p.studentName.toLowerCase().includes(search.toLowerCase()))
                  .map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.invoiceNumber}</TableCell>
                      <TableCell>{payment.studentName}</TableCell>
                      <TableCell>{payment.courseName}</TableCell>
                      <TableCell>₹{payment.amount}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadInvoice(payment)}
                            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Download className="h-4 w-4" />
                            Invoice
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePayment(payment.id)}
                            className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentProcessing;