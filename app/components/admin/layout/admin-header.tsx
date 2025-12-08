import { useLocation, Link } from 'react-router';
import { ChevronRight, User, LogOut } from 'lucide-react';
import { useAuthStore } from '~/store/auth-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';

export function AdminHeader() {
  const location = useLocation();
  const { user, signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
  };

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: { label: string; href: string }[] = [];

    // Skip 'admin' segment and build breadcrumbs
    for (let i = 1; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const href = '/' + pathSegments.slice(0, i + 1).join('/');

      // Format label
      let label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Handle special cases
      if (segment === 'new') {
        label = 'Create New';
      } else if (segment === 'edit') {
        label = 'Edit';
      } else if (!isNaN(Number(segment))) {
        // Skip numeric IDs in breadcrumbs
        continue;
      }

      breadcrumbs.push({ label, href });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'A';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center space-x-2 text-sm">
        <Link
          to="/admin/dashboard"
          className="text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <img src="/ekoe-asset/Ekoe_Logo-01.png" alt="Ekoe Logo" className='w-28' />
        </Link>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center space-x-2">
            <ChevronRight className="size-4 text-muted-foreground" />
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User profile dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 gap-2 px-2">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline-block text-sm font-medium">
              {user?.name || 'Admin'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} variant="destructive">
            <LogOut className="mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
