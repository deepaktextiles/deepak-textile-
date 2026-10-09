"use client";

import React, { useState } from "react";
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, ShieldCheck, CheckCircle } from "lucide-react";
import { enquiriesApi } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    companyName: "",
    city: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.phone.trim()) {
      setError("Please provide your Name and Phone / WhatsApp number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await enquiriesApi.submit({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        companyName: formData.companyName,
        city: formData.city,
        message: formData.message || "General wholesale contact inquiry from website",
      });

      if (res.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          phone: "",
          email: "",
          companyName: "",
          city: "",
          message: "",
        });
      } else {
        setError(res.message || "Could not submit inquiry.");
      }
    } catch (err) {
      setError(err.message || "Failed to submit. Please try contacting via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-gold-700 uppercase tracking-widest">
          Surat Wholesale Hub
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-navy-500">
          Contact Deepak Textiles
        </h1>
        <p className="text-xs sm:text-sm text-txt-secondary">
          Get in touch with our wholesale dispatch team directly. Visit our Surat showroom or chat instantly on WhatsApp for real-time rates and catalog PDFs.
        </p>
      </div>

      {/* 3 Quick Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* WhatsApp Card */}
        <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-navy-500">WhatsApp Sales Desk</h3>
          <p className="text-xs text-txt-secondary">
            Instant reply for video calls, photo catalogs & stock inquiries.
          </p>
          <a
            href="https://wa.me/919825144520?text=Hello%20Deepak%20Textiles,%20I%20want%20to%20connect%20with%20your%20wholesale%20team."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block pt-1"
          >
            <span className="text-sm font-bold text-emerald-700 hover:underline">
              +91 98251 44520 (Chat Now)
            </span>
          </a>
        </div>

        {/* Call Desk Card */}
        <div className="p-6 rounded-xl bg-blue-50 border border-blue-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-navy-500 text-white flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6 text-gold-400" />
          </div>
          <h3 className="font-heading font-bold text-base text-navy-500">Call Dispatch Office</h3>
          <p className="text-xs text-txt-secondary">
            Direct mill lines for bulk parcel booking & transport tracking.
          </p>
          <a href="tel:+919825144520" className="inline-block pt-1">
            <span className="text-sm font-bold text-navy-600 hover:underline">
              +91 98251 44520 / +91 94268 11200
            </span>
          </a>
        </div>

        {/* Email Card */}
        <div className="p-6 rounded-xl bg-gold-50 border border-gold-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-gold-500 text-navy-500 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-navy-500">Official Wholesale Email</h3>
          <p className="text-xs text-txt-secondary">
            For dealership, agency tie-ups, export orders & institutional supply.
          </p>
          <a href="mailto:info@deepaktextiles.com" className="inline-block pt-1">
            <span className="text-sm font-bold text-gold-800 hover:underline">
              info@deepaktextiles.com
            </span>
          </a>
        </div>
      </div>

      {/* Main Grid: Form (left) + Address / Location (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-border p-6 sm:p-8 shadow-card space-y-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-navy-500">Send Wholesale Enquiry</h2>
            <p className="text-xs text-txt-secondary mt-1">
              Fill in your shop details below and our sales manager will call you back with catalogs and rates.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-heading font-bold text-base text-emerald-900">Enquiry Received Successfully!</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Thank you! Our Surat wholesale desk has received your request and will contact you via WhatsApp/Phone shortly.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Submit Another Inquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded bg-red-50 text-red-700 text-xs border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Person Name *"
                  name="name"
                  placeholder="e.g. Ramesh Patel"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Phone / WhatsApp Number *"
                  name="phone"
                  placeholder="e.g. 98250 12345"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Shop / Business Name"
                  name="companyName"
                  placeholder="e.g. Patel Saree Showroom"
                  value={formData.companyName}
                  onChange={handleChange}
                />
                <Input
                  label="City & State"
                  name="city"
                  placeholder="e.g. Ahmedabad, Gujarat"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <Input
                label="Email Address (Optional)"
                type="email"
                name="email"
                placeholder="yourname@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />

              <Textarea
                label="Required Items & Quantity Details"
                name="message"
                rows={4}
                placeholder="Specify fabrics, sarees, suits, approximate lots required..."
                value={formData.message}
                onChange={handleChange}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-bold bg-gold-500 hover:bg-gold-400 text-navy-500"
                isLoading={submitting}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Send Wholesale Enquiry
              </Button>
            </form>
          )}
        </div>

        {/* Surat Mill Location & Details */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-border p-6 sm:p-8 shadow-card space-y-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-navy-500">Visit Surat Showroom</h2>
            <p className="text-xs text-txt-secondary mt-1">
              Buyers and retailers are welcome to visit our wholesale showroom directly.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-navy-500 block mb-0.5">Showroom & Mill Office Address:</span>
                <span className="text-txt-secondary leading-relaxed block">
                  Shop 204-206, 2nd Floor, Radharaman Textile Market, Ring Road, Surat, Gujarat - 395002, India
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-navy-500 block mb-0.5">Business & Showroom Hours:</span>
                <span className="text-txt-secondary block">Monday - Saturday: 10:00 AM – 8:30 PM</span>
                <span className="text-txt-secondary block">Sunday: Closed (Wholesale Market Holiday)</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-navy-500 block mb-0.5">Tax & GST Information:</span>
                <span className="text-txt-secondary block">GSTIN: 24AAACD1234F1Z5</span>
                <span className="text-txt-secondary block">HSN Codes: 5407, 5208, 6204</span>
              </div>
            </div>
          </div>

          {/* Direct Transport note */}
          <div className="p-4 rounded-lg bg-sitebg border border-border space-y-2">
            <span className="text-xs font-bold text-navy-500 block">Transport & Logistics Hubs:</span>
            <p className="text-xs text-txt-secondary leading-relaxed">
              We dispatch daily through leading transport carriers located within 1 km: V-Trans, TCI Freight, Safexpress, Om Logistics, ARC, and local state parcel services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
