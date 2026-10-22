import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#C00000] font-black text-2xl flex items-center justify-center mb-4 border border-red-200">
        404
      </div>
      <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-navy-950 mb-2 font-poppins">
        Page Not Found
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 max-w-md mb-6 font-poppins">
        The wholesale product or page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C00000] hover:bg-[#A80000] text-white font-bold text-xs uppercase tracking-wider transition-colors font-poppins"
      >
        Return to Home
      </Link>
    </div>
  );
}
