import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/auth-store";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check auth status which will verify the session cookies set by backend
        await checkAuth();

        // Get the user to determine redirect based on role
        const user = useAuthStore.getState().user;

        // Get return URL from storage or default based on role
        const returnUrl = localStorage.getItem("auth_return_url") || "/";
        localStorage.removeItem("auth_return_url");

        // Redirect based on user role
        if (user?.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate(returnUrl, { replace: true });
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/auth/login?error=callback_failed", { replace: true });
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

