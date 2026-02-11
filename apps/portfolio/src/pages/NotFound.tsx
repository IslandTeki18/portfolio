import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="mx-auto max-w-md w-full">
        <div className="border-2 border-[#EF4444] bg-[#171717] p-6 md:p-8">
          <div className="text-center space-y-3 md:space-y-4">
            {/* 404 */}
            <h1 className="font-mono text-[56px] md:text-[72px] font-bold text-[#EF4444]">404</h1>

            {/* Error Messages */}
            <div className="space-y-1 md:space-y-2">
              <p className="font-mono text-xs md:text-sm text-[#A3A3A3]">{"// page_not_found"}</p>
              <p className="font-mono text-[11px] md:text-xs text-[#737373]">
                {"// the requested resource does not exist"}
              </p>
            </div>

            {/* Return Home Button */}
            <div className="pt-3 md:pt-4">
              <Link to="/">
                <button className="w-full sm:w-auto bg-[#EF4444] px-5 py-2.5 font-mono text-xs md:text-[13px] font-semibold text-[#0C0C0C] hover:bg-[#DC2626] transition-colors">
                  [return_home]
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
