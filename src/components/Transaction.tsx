"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Building2,
  DollarSign,
  Hash,
  CreditCard
} from "lucide-react";

export default function Transaction() {

  const transaction = {
    name: "John Doe",
    bank: "Example Bank",
    amount: "$1,250.00",
    reference: "INV-987654",
    status: "completed"
  };

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-gray-200 bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-600" />
            Transaction
          </CardTitle>
          <Badge
            variant={transaction.status === 'completed' ? 'default' : 'secondary'}
            className="bg-green-100 text-green-800 hover:bg-green-100 text-xs px-2 py-1"
          >
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Amount Section - Prominent but Compact */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">Amount</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{transaction.amount}</div>
            </div>
          </div>
        </div>

        {/* Essential Transaction Info - Compact Grid */}
        <div className="space-y-2 border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Name</span>
            </div>
            <span className="text-sm text-gray-900 font-medium">{transaction.name}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Bank</span>
            </div>
            <span className="text-sm text-gray-900 font-medium">{transaction.bank}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Reference</span>
            </div>
            <span className="text-sm text-gray-900 font-mono font-medium">{transaction.reference}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}