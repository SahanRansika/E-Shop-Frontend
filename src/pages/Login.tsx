import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Login: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Form */}
          <div>
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
              </div>
              <p className="text-gray-600">
                Sign in to your account to continue shopping or manage your store.
              </p>
            </div>
            <LoginForm />
          </div>

          {/* Right Side - Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Why Join E-Shop?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <span className="text-gray-700">
                    <strong>Secure Shopping:</strong> Your data is protected with bank-level security
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <span className="text-gray-700">
                    <strong>Fast Delivery:</strong> Get your orders delivered quickly
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <span className="text-gray-700">
                    <strong>Easy Returns:</strong> 30-day hassle-free return policy
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <span className="text-gray-700">
                    <strong>24/7 Support:</strong> Our team is always here to help
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                New to E-Shop?
              </h3>
              <p className="text-gray-600 mb-6">
                Create an account to start shopping or selling on our platform.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
              >
                Create Your Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;