import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { Users, CheckCircle2, ShoppingBag, Store, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gray-50/50">
      <div className="w-full max-w-6xl">
        
        {/* Back to Home / Login Navigation */}
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
            
            {/* --- LEFT SIDE: FORM --- */}
            <div className="lg:col-span-7 p-8 md:p-12 lg:p-16">
              <div className="max-w-xl">
                <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl mb-6">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                  Join Our Community
                </h1>
                <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                  Start your journey with E-Shop today. It only takes a minute to create your account.
                </p>

                <RegisterForm />
              </div>
            </div>

            {/* --- RIGHT SIDE: BENEFITS INFO --- */}
            <div className="lg:col-span-5 bg-gray-50 p-8 md:p-12 lg:p-16 border-l border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Why create an account?
              </h3>
              
              <div className="space-y-10">
                {/* Buyers Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <ShoppingBag className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg">For Buyers</h4>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Exclusive deals and discounts",
                      "Real-time order tracking",
                      "Personalized recommendations"
                    ].map((text, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-medium">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sellers Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-600 rounded-lg">
                      <Store className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg">For Sellers</h4>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Powerful vendor dashboard",
                      "Secure payment processing",
                      "Global customer reach"
                    ].map((text, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-medium">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Trust Badge / Note */}
              <div className="mt-12 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  <p className="text-sm font-bold text-gray-800 uppercase tracking-wider">Verification</p>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Your security is our priority. All sellers undergo a background verification to ensure a safe shopping environment.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;