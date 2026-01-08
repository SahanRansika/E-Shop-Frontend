import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { CheckCircle2, ShoppingBag, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gray-50/50">
      <div className="w-full max-w-6xl">
        <div className="mb-8 flex justify-between items-center">
          <Link to="/" className="flex items-center text-gray-500 hover:text-blue-600 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <p className="text-gray-600 text-sm">
            Already have an account? {' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 overflow-hidden border border-white">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            <div className="lg:col-span-7 p-8 md:p-12 lg:p-16">
              <div className="max-w-xl">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                  Create User Account
                </h1>
                <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                  Join E-Shop today to start shopping and get the best deals.
                </p>
                <RegisterForm />
              </div>
            </div>

            <div className="lg:col-span-5 bg-gray-50 p-8 md:p-12 lg:p-16 border-l border-gray-100 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Why join E-Shop?
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Shopping Benefits</h4>
                    <p className="text-sm text-gray-500">Access thousands of products instantly.</p>
                  </div>
                </div>

                <ul className="space-y-4">
                  {[
                    "Exclusive user discounts",
                    "Fast & Secure checkout process",
                    "Track your orders in real-time",
                    "Save items to your wishlist"
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="font-medium">{text}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-bold text-gray-800 uppercase">Secure Platform</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Your data is encrypted and secure. We never share your personal information.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;