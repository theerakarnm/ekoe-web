import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

interface AuthFormWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showLogo?: boolean;
}

export function AuthFormWrapper({ 
  children, 
  title, 
  description,
  showLogo = true 
}: AuthFormWrapperProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {showLogo && (
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary">Your Brand</h1>
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
