import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { Users } from 'lucide-react';

const Register: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Join Our Community
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your account and start your journey with E-Shop. 
            Whether you're here to shop or sell, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RegisterForm />
          </div>

          <div className="bg-gray-50 rounded-xl p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Benefits of Joining
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">For Buyers:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Exclusive deals and discounts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Order tracking and notifications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Wishlist and saved items</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Quick checkout with saved addresses</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">For Sellers:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Easy product listing dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Real-time sales analytics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Secure payment processing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Customer management tools</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> All sellers go through a verification process. 
                You'll receive an email with next steps after registration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;