import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useCustomerAuthStore } from '~/store/customer-auth';
import { handleApiError, showSuccess } from '~/lib/toast';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isEmailVerified, sendVerificationEmail, checkAuth } = useCustomerAuthStore();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!user) {
      navigate('/auth/login', { replace: true });
      return;
    }

    // If email is already verified, redirect to home
    if (isEmailVerified) {
      navigate('/', { replace: true });
      return;
    }

    // If there's a token in the URL, verify it
    if (token) {
      verifyEmailToken(token);
    }
  }, [user, isEmailVerified, token, navigate]);

  const verifyEmailToken = async (verificationToken: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      if (!response.ok) {
        throw new Error('Email verification failed');
      }

      // Refresh auth state to get updated emailVerified status
      await checkAuth();

      // Redirect to home after successful verification
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    setError(null);
    setResendSuccess(false);

    try {
      await sendVerificationEmail();
      setResendSuccess(true);
      showSuccess('Verification email sent', 'Please check your inbox');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification email';
      setError(errorMessage);
      handleApiError(err, 'Failed to send verification email');
    } finally {
      setIsResending(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              {isVerifying ? (
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : isEmailVerified ? (
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl text-center">
              {isVerifying ? 'Verifying Email...' : isEmailVerified ? 'Email Verified!' : 'Verify Your Email'}
            </CardTitle>
            <CardDescription className="text-center">
              {isVerifying
                ? 'Please wait while we verify your email address'
                : isEmailVerified
                ? 'Your email has been successfully verified'
                : `We've sent a verification email to ${user.email}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {resendSuccess && (
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Verification email sent successfully! Please check your inbox.
                </AlertDescription>
              </Alert>
            )}

            {!isVerifying && !isEmailVerified && (
              <>
                <div className="text-sm text-muted-foreground text-center">
                  <p>Please check your email and click the verification link to activate your account.</p>
                  <p className="mt-2">Didn't receive the email? Check your spam folder or request a new one.</p>
                </div>

                <Button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  variant="outline"
                  className="w-full"
                >
                  {isResending ? 'Sending...' : 'Resend Verification Email'}
                </Button>

                <div className="text-center text-sm">
                  <button
                    onClick={() => navigate('/')}
                    className="text-primary hover:underline"
                  >
                    Continue to home
                  </button>
                </div>
              </>
            )}

            {isEmailVerified && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Redirecting you to the home page...
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Go to Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
