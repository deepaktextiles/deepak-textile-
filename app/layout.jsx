import "./globals.css";
import { Nunito_Sans } from "next/font/google";
import { AdminProvider } from "../lib/context/AdminContext";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const metadata = {
  title: "Deepak Textiles | Surat Wholesale Textile & Garment Supplier",
  description:
    "Direct mill wholesale supplier in Surat, Gujarat. Bulk Sarees, Salwar Suits, Kurtis, and Fabrics for retailers and boutique owners across India. Minimum order quantity applicable.",
  keywords: "wholesale textiles surat, surat saree wholesale, kurti wholesale manufacturer, deepak textiles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={nunitoSans.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${nunitoSans.className} min-h-screen flex flex-col bg-sitebg text-txt-primary`}>
        <AdminProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AdminProvider>
      </body>
    </html>
  );
}
