// components/admin/UserManager.tsx
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";


interface Student {
  id: number;
  name: string;
  phone: string;
  parentsName: string;
  parentsOccupation: string;
  profession: string;
  course: string;
  courseDuration: string;
  fees: number;
  advance: number;
  balance: number;
}

const defaultStudent: Student = {
  id: 0,
  name: "",
  phone: "",
  parentsName: "",
  parentsOccupation: "",
  profession: "",
  course: "",
  courseDuration: "",
  fees: 0,
  advance: 0,
  balance: 0,
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Student name is required"),
  phone: Yup.string().required("Phone number is required"),
  parentsName: Yup.string().required("Parent's name is required"),
  parentsOccupation: Yup.string().required("Parent's occupation is required"),
  profession: Yup.string().required("Profession is required"),
  course: Yup.string().required("Course is required"),
  courseDuration: Yup.string().required("Course duration is required"),
  fees: Yup.number()
    .required("Fees amount is required")
    .typeError("Fees must be a number"),
  advance: Yup.number()
    .required("Advance amount is required")
    .typeError("Advance must be a number"),
  // 'balance' is computed dynamically from fees and advance
});

const AdminCreateUserForm = ({ onUserCreated }: { onUserCreated: () => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'staff' | 'student'>("staff");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setSuccess('User created successfully!');
      setName(""); setEmail(""); setPassword("");
      onUserCreated();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded shadow bg-white">
      <h3 className="text-lg font-semibold mb-4">Create Staff/Student User</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1">Role</label>
          <select value={role} onChange={e => setRole(e.target.value as 'staff' | 'student')} className="w-full p-2 border rounded">
            <option value="staff">Staff</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">{success}</div>}
      <div className="flex gap-4 mt-4">
        <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create User'}</Button>
      </div>
    </form>
  );
};

const UserManager: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  interface User {
    id: number;
    username: string;
    email: string;
    role: string; // Add the role property
    // Add other user fields as needed
  }
  
  const [users, setUsers] = useState<User[]>([]); // Add users state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch students from backend on mount
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/students', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch(() => setStudents([]));
  }, []);

  // Fetch users from backend
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setUsers([]));
  }, []);

  const handleSubmit = async (
    values: Student,
    { setSubmitting, resetForm }: FormikHelpers<Student>
  ) => {
    values.balance = values.fees - values.advance;
    try {
      if (editingStudent) {
        // Update student via PUT
        const response = await fetch(`/api/students/${editingStudent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (response.ok) {
          const studentsRes = await fetch("/api/students");
          const studentsData = await studentsRes.json();
          setStudents(studentsData);
        }
        setEditingStudent(null);
      } else {
        // Send POST to backend
        const response = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (response.ok) {
          // After successful POST, fetch the updated list from backend
          const studentsRes = await fetch("/api/students");
          const studentsData = await studentsRes.json();
          setStudents(studentsData);
        }
      }
    } catch (e) {
      // handle error
    }
    resetForm();
    setShowForm(false);
    setSubmitting(false);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((stu) => stu.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">User Management</h2>
        <Button
          onClick={() => {
            setEditingStudent(null);
            setShowForm(true);
          }}
        >
          Add Student
        </Button>
      </div>
      <input
        type="text"
        placeholder="Search students..."
        className="w-full mb-4 p-2 border rounded"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {showForm && (
        <Formik
          initialValues={editingStudent ? editingStudent : defaultStudent}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => {
            // When the fees or advance fields change, recalc the balance dynamically.
            const handleFeesChange = (
              e: React.ChangeEvent<HTMLInputElement>
            ) => {
              const newFees = Number(e.target.value);
              setFieldValue("fees", newFees);
              setFieldValue("balance", newFees - values.advance);
            };

            const handleAdvanceChange = (
              e: React.ChangeEvent<HTMLInputElement>
            ) => {
              const newAdvance = Number(e.target.value);
              setFieldValue("advance", newAdvance);
              setFieldValue("balance", values.fees - newAdvance);
            };

            return (
              <Form className="mb-6 p-4 border rounded shadow bg-white">
                <h3 className="text-lg font-semibold mb-4">
                  {editingStudent ? "Edit Student" : "Student Registration"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Student Name */}
                  <div>
                    <label className="block mb-1">Student Name</label>
                    <Field
                      type="text"
                      name="name"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Phone Number */}
                  <div>
                    <label className="block mb-1">Phone Number</label>
                    <Field
                      type="tel"
                      name="phone"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="phone"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Parent's Name */}
                  <div>
                    <label className="block mb-1">Parent's Name</label>
                    <Field
                      type="text"
                      name="parentsName"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="parentsName"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Parent's Occupation */}
                  <div>
                    <label className="block mb-1">Parent's Occupation</label>
                    <Field
                      type="text"
                      name="parentsOccupation"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="parentsOccupation"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Profession */}
                  <div>
                    <label className="block mb-1">Profession</label>
                    <Field
                      type="text"
                      name="profession"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="profession"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Course */}
                  <div>
                    <label className="block mb-1">Course</label>
                    <Field
                      type="text"
                      name="course"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="course"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Course Duration */}
                  <div>
                    <label className="block mb-1">Course Duration</label>
                    <Field
                      type="text"
                      name="courseDuration"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="courseDuration"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Fees */}
                  <div>
                    <label className="block mb-1">Fees</label>
                    <Field
                      type="number"
                      name="fees"
                      className="w-full p-2 border rounded"
                      onChange={handleFeesChange}
                    />
                    <ErrorMessage
                      name="fees"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Advance */}
                  <div>
                    <label className="block mb-1">Advance</label>
                    <Field
                      type="number"
                      name="advance"
                      className="w-full p-2 border rounded"
                      onChange={handleAdvanceChange}
                    />
                    <ErrorMessage
                      name="advance"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Balance (Read Only) */}
                  <div>
                    <label className="block mb-1">Balance</label>
                    <Field
                      type="number"
                      name="balance"
                      readOnly
                      className="w-full p-2 border rounded bg-gray-50"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <Button type="submit">
                    {editingStudent ? "Update Student" : "Register Student"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingStudent(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}

      {/* Admin Create User Form - Only for admin users */}
      {users.some(user => user.role === 'admin') && (
        <AdminCreateUserForm onUserCreated={() => {/* refresh user list if needed */}} />
      )}

      <div>
        {students.length === 0 ? (
          <p>No students registered yet.</p>
        ) : (
          <div className="space-y-4">
            {students
              .filter(student =>
                student.name.toLowerCase().includes(search.toLowerCase()) ||
                student.phone.toLowerCase().includes(search.toLowerCase()) ||
                student.course.toLowerCase().includes(search.toLowerCase())
              )
              .map((student) => (
                <div
                  key={student.id}
                  className="p-4 border rounded flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-gray-600">
                      Phone: {student.phone} | Parent: {student.parentsName} | Occupation: {student.parentsOccupation}
                    </p>
                    <p className="text-sm text-gray-600">
                      Profession: {student.profession} | Course: {student.course} ({student.courseDuration})
                    </p>
                    <p className="text-sm text-gray-600">
                      Fees: {student.fees} | Advance: {student.advance} | Balance: {student.balance}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button variant="outline" onClick={() => handleEditStudent(student)}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteStudent(student.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;