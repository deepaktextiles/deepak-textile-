"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { enquiriesApi } from "../../services/api.js";
import { MessageCircle, CheckCircle2 } from "lucide-react";

export const EnquiryModal = ({ isOpen, onClose, product = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    companyName: "",
    quantity: product ? product.minimumOrderQuantity || 10 : 20,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please provide your name and phone number.");
      return;
    }

    try {
      setLoading(true);
      await enquiriesApi.submit({
        ...formData,
        product: product?._id,
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.message || "Failed to submit enquiry.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Request Wholesale Quotation"
      description="Connect directly with Deepak Textiles Surat sales desk for bulk lot pricing and dispatch."
      maxWidth="md"
    >
      {submitted ? (
        <div className="py-6 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
          <h4 className="font-heading font-bold text-lg text-navy-500">Enquiry Received!</h4>
          <p className="text-xs text-txt-secondary max-w-xs mx-auto">
            Our Surat sales representative will contact your phone or WhatsApp shortly with the best wholesale rate.
          </p>
          <Button variant="primary" size="sm" onClick={handleClose}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {product && (
            <div className="flex items-center gap-3 p-3 bg-sitebg rounded-md border border-border">
              {product.images?.[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-14 object-cover rounded border border-border"
                />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700 bg-gold-50 px-1.5 py-0.5 rounded border border-gold-200">
                  MOQ: {product.minimumOrderQuantity} {product.unit || "pcs"}
                </span>
                <p className="font-heading font-semibold text-xs text-navy-500 truncate mt-0.5">
                  {product.name}
                </p>
                <p className="text-[11px] text-txt-secondary">
                  Wholesale: ₹{product.wholesalePrice || product.price}/{product.unit || "pc"}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Shah"
            />
            <Input
              label="Mobile / WhatsApp"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="10-digit mobile number"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Shop / Boutique Name"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="e.g. Shah Silk Stores"
            />
            <Input
              label="Estimated Quantity"
              type="number"
              min={product ? product.minimumOrderQuantity : 1}
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            />
          </div>

          <Textarea
            label="Specific Requirements / City Destination"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Color preference, required delivery date, or city godown..."
            rows={2}
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={loading}>
              Submit Inquiry
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
