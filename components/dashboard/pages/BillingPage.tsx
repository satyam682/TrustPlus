import React from 'react';
import { Check, CreditCard, Download, Clock } from 'lucide-react';
import { Button } from '../../ui/Button';

export const BillingPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-900">Billing & Plans</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Current Plan Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex justify-between items-start">
                 <div>
                    <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-3xl font-bold text-gray-900">Free Tier</span>
                       <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Active</span>
                    </div>
                 </div>
                 <Button>Upgrade Plan</Button>
              </div>
           </div>
           <div className="p-8">
              <div className="mb-6">
                 <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-gray-700">Monthly Feedback Usage</span>
                    <span className="text-blue-600">43 / 100</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: '43%' }}></div>
                 </div>
                 <p className="text-xs text-gray-500 mt-2">Resets on June 1st</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                 {[
                    "Up to 100 feedbacks/mo",
                    "1 Active App",
                    "Basic AI Filtering",
                    "Email Support"
                 ].map((f, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-600">
                       <Check className="w-4 h-4 text-green-500 mr-2" />
                       {f}
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
           <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h2>
           <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-6">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-gray-200">
                 <CreditCard className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                 <p className="font-medium text-sm text-gray-900">No card on file</p>
                 <p className="text-xs text-gray-500">Add a card to upgrade</p>
              </div>
           </div>
           <Button variant="outline" className="w-full">Add Payment Method</Button>
        </div>
      </div>

      {/* Available Plans */}
      <div>
         <h2 className="text-xl font-bold text-gray-900 mb-6">Available Plans</h2>
         <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-blue-600 bg-blue-50/50 rounded-xl p-6 relative">
               <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">CURRENT</div>
               <h3 className="font-bold text-gray-900 text-lg">Free</h3>
               <p className="text-2xl font-bold mt-2">$0 <span className="text-sm font-normal text-gray-500">/mo</span></p>
               <Button variant="outline" className="w-full mt-6" disabled>Current Plan</Button>
            </div>
            <div className="border border-gray-200 bg-white rounded-xl p-6 hover:border-blue-300 transition-colors shadow-sm">
               <h3 className="font-bold text-gray-900 text-lg">Pro</h3>
               <p className="text-2xl font-bold mt-2">$19 <span className="text-sm font-normal text-gray-500">/mo</span></p>
               <Button variant="primary" className="w-full mt-6">Upgrade to Pro</Button>
            </div>
            <div className="border border-gray-200 bg-white rounded-xl p-6 hover:border-blue-300 transition-colors shadow-sm">
               <h3 className="font-bold text-gray-900 text-lg">Business</h3>
               <p className="text-2xl font-bold mt-2">$49 <span className="text-sm font-normal text-gray-500">/mo</span></p>
               <Button variant="outline" className="w-full mt-6">Contact Sales</Button>
            </div>
         </div>
      </div>

      {/* Billing History */}
      <div>
         <h2 className="text-xl font-bold text-gray-900 mb-6">Billing History</h2>
         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                     <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                     <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                     <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                     <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                     <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Invoice</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  <tr>
                     <td className="px-6 py-8 text-sm text-gray-500 text-center" colSpan={5}>
                        No billing history available
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};