import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCustomerAuthStore } from "~/store/customer-auth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { checkAuth, isAuthenticated } = useCustomerAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check auth status which will verify the session cookies set by backend
        await checkAuth();

        // Get return URL from storage or default to home
        const returnUrl = localStorage.getItem("auth_return_url") || "/";
        localStorage.removeItem("auth_return_url");

        navigate(returnUrl);
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/auth/login?error=callback_failed");
      }
    };

    handleCallback();
  }, [checkAuth, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Verifying authentication...</p>
      </div>
    </div>
  );
}
