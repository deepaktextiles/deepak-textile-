"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Award, Factory, Users, Truck, MessageCircle, Phone } from "lucide-react";
import { Button } from "../../components/ui/Button";

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold uppercase tracking-wider">
            Established In Surat, Gujarat
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
            About Deepak Textiles
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 font-light">
            Surat&apos;s premier textile manufacturer and wholesale powerhouse supplying retail stores, boutiques, and bulk buyers across India with authentic mill-rate apparel.
          </p>
        </div>
      </section>

      {/* Story & Legacy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold text-gold-700 uppercase tracking-widest">
              Our Heritage & Quality
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-navy-500">
              Transforming B2B Textile Sourcing from Surat
            </h2>
            <p className="text-sm text-txt-secondary leading-relaxed">
              Deepak Textiles was founded with one clear mission: to connect retailers and boutique owners directly to Surat&apos;s textile manufacturing heart without layers of middle brokers inflating prices.
            </p>
            <p className="text-sm text-txt-secondary leading-relaxed">
              Operating out of Surat&apos;s textile epicentre near Ring Road, we produce and source premium silk sarees, cotton salwar suits, designer kurti sets, and high-demand running fabrics. Every roll and lot is checked for colorfastness, thread density, and finish before dispatch.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-border">
                <span className="text-2xl font-bold font-heading text-navy-500 block">5,000+</span>
                <span className="text-xs text-txt-secondary">Retail Partners Pan-India</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-border">
                <span className="text-2xl font-bold font-heading text-navy-500 block">50,000+</span>
                <span className="text-xs text-txt-secondary">Monthly Meters Dispatched</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-border shadow-elevated">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
              alt="Surat Textile Mill"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4 Pillars of Excellence */}
      <section className="bg-white border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-gold-700 uppercase tracking-widest">Our Guarantees</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-navy-500 mt-1">
              Why Retailers Trust Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-sitebg border border-border space-y-3">
              <Factory className="w-8 h-8 text-gold-600" />
              <h3 className="font-heading font-bold text-base text-navy-500">Mill Direct Pricing</h3>
              <p className="text-xs text-txt-secondary leading-relaxed">
                We manufacture and source directly in bulk so our buyers enjoy 20-30% better margins than local state wholesalers.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-sitebg border border-border space-y-3">
              <Award className="w-8 h-8 text-gold-600" />
              <h3 className="font-heading font-bold text-base text-navy-500">Quality Assured</h3>
              <p className="text-xs text-txt-secondary leading-relaxed">
                Zero damage guarantee. Strict inspection protocols for zari embroidery, weaving uniformity, and color dyes.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-sitebg border border-border space-y-3">
              <Truck className="w-8 h-8 text-gold-600" />
              <h3 className="font-heading font-bold text-base text-navy-500">Safe Transport</h3>
              <p className="text-xs text-txt-secondary leading-relaxed">
                Double-wrapped moisture-resistant packaging. Full tracking through premier road transport carriers.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-sitebg border border-border space-y-3">
              <ShieldCheck className="w-8 h-8 text-gold-600" />
              <h3 className="font-heading font-bold text-base text-navy-500">GST Invoices</h3>
              <p className="text-xs text-txt-secondary leading-relaxed">
                Every consignment is dispatched with legitimate GST invoices and E-way bills for effortless business accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-900 rounded-2xl p-8 sm:p-12 text-center text-white space-y-6">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold">
            Ready to stock your shop with high-profit Surat wholesale lots?
          </h2>
          <p className="text-sm text-gray-300 max-w-xl mx-auto">
            Contact our wholesale sales executive on WhatsApp or visit our Surat showroom.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/919825144520?text=Hello%20Deepak%20Textiles,%20I%20want%20to%20know%20more%20about%20your%20wholesale%20supply."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="whatsapp" size="lg" leftIcon={<MessageCircle className="w-5 h-5" />}>
                WhatsApp Sales Desk
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-navy-900">
                View Surat Mill Location
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
