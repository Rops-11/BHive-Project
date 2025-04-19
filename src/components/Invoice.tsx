"use client";

import React from "react";

type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};  

type InvoiceProps = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: "Paid" | "Unpaid" | "Overdue";
  customer: {
    name: string;
    email: string;
    address: string;
  };
  items: InvoiceItem[];
  notes?: string;
};

const InvoiceCard: React.FC<InvoiceProps> = ({
  invoiceNumber,
  issueDate,
  dueDate,
  status,
  customer,
  items,
  notes,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  // const tax = subtotal * 0.12; // 12% VAT
  const total = subtotal;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice</h1>
          <p className="text-sm text-gray-500">#{invoiceNumber}</p>
        </div>
        <div className={`text-sm px-3 py-1 rounded-full font-semibold ${
          status === "Paid"
            ? "bg-green-100 text-green-700"
            : status === "Unpaid"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}>
          {status}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-700"><span className="font-medium">Issue Date:</span> {issueDate}</p>
        <p className="text-sm text-gray-700"><span className="font-medium">Due Date:</span> {dueDate}</p>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold text-gray-800">Bill To:</h2>
        <p className="text-sm">{customer.name}</p>
        <p className="text-sm">{customer.email}</p>
        <p className="text-sm">{customer.address}</p>
      </div>

      <div className="mb-6">
        <table className="w-full text-sm text-left text-gray-700 border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>₱{item.unitPrice.toFixed(2)}</td>
                <td className="text-right">₱{(item.quantity * item.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right text-sm mb-4">
        <p>Subtotal: ₱{subtotal.toFixed(2)}</p>
        <p className="font-bold text-gray-900">Total: ₱{total.toFixed(2)}</p>
      </div>

      {notes && (
        <div className="text-sm text-gray-600 italic border-t pt-4">
          <p>Note: {notes}</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceCard;
