import React, { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex justify-center mb-4 gap-4">
          <button
            className={`px-4 py-2 rounded ${showLogin ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded ${!showLogin ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setShowLogin(false)}
          >
            Register
          </button>
        </div>
        {showLogin ? <LoginForm onToggleForm={() => setShowLogin(false)} /> : <RegisterForm onToggleForm={() => setShowLogin(true)} />}
      </div>
    </div>
  );
}
