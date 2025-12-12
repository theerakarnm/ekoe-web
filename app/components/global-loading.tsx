import { useEffect, useState } from "react";
import { useNavigation } from "react-router";

export function GlobalLoading() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const state = navigation.state;
    let timer: NodeJS.Timeout;
    let spinnerTimer: NodeJS.Timeout;

    if (state === "submitting" || state === "loading") {
      setProgress((p) => (p === 0 ? 10 : p)); // Start at 10% if at 0

      // Show spinner after 500ms if still loading
      spinnerTimer = setTimeout(() => {
        setShowSpinner(true);
      }, 500);

      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) return 100;

          // Trickle logic: fast at first, slows down
          const increment = Math.max(0.5, (90 - oldProgress) / 10);
          return Math.min(90, oldProgress + increment);
        });
      }, 100);
    } else if (state === "idle" && progress > 0) {
      setProgress(100);
      setShowSpinner(false);

      const timeout = setTimeout(() => {
        setProgress(0);
      }, 300); // Wait for transition to finish

      return () => clearTimeout(timeout);
    }

    return () => {
      clearInterval(timer);
      clearTimeout(spinnerTimer);
    };
  }, [navigation.state, progress]);

  if (progress === 0) return null;

  return (
    <>
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999]">
        <div className="h-1 w-full bg-black/5">
          <div
            className="h-full transition-all duration-200 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)",
              boxShadow: "0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)",
            }}
          />
        </div>
      </div>

      {/* Spinner Overlay - shows after 500ms */}
      {showSpinner && (
        <div className="fixed inset-0 z-[9998] pointer-events-none flex items-center justify-center">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3 animate-fade-in">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Loading...
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
}
