import "./globals.css";
import { Poppins } from "next/font/google";
import { AdminProvider } from "../lib/context/AdminContext";
import { StoreLayout } from "../components/layout/StoreLayout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Deepak Textiles | Clothing & Fabric Wholesaler | Darbhanga, Bihar",
  description:
    "Deepak Textiles (Estd. 2001) - Premier Clothing & Fabric Wholesaler in Darbhanga, Bihar. Bulk Designer Sarees, Suit Pieces, Shirting & Suiting, and Lehenga collections for retailers, resellers, and bulk buyers across India.",
  keywords: "deepak textiles darbhanga, bihar saree wholesale, fabric wholesaler darbhanga, wholesale suit pieces darbhanga, deepak textiles",
  icons: {
    icon: "/images/icons/logo.jpeg",
    shortcut: "/images/icons/logo.jpeg",
    apple: "/images/icons/logo.jpeg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${poppins.className} min-h-screen flex flex-col bg-sitebg text-txt-primary font-poppins`}>
        <AdminProvider>
          <StoreLayout>{children}</StoreLayout>
        </AdminProvider>
      </body>
    </html>
  );
}
