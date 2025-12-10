import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { toast } from '~/lib/admin/toast';
import { PromotionTable } from '~/components/admin/promotions';
import {
  getPromotions,
  getPromotionDashboard,
  type PromotionListItem,
  type PromotionDashboard
} from '~/lib/services/admin/promotion-admin.service';

export default function PromotionsIndex() {
  const [promotions, setPromotions] = useState<PromotionListItem[]>([]);
  const [dashboard, setDashboard] = useState<PromotionDashboard | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadPromotions();
    loadDashboard();
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  const loadPromotions = async () => {
    setIsLoading(true);
    try {
      const result = await getPromotions({
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      setPromotions(result.promotions);
      setPagination(result.pagination);
    } catch (error) {
      toast.error(`Failed to load promotions: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboard = async () => {
    try {
      const dashboardData = await getPromotionDashboard();
      setDashboard(dashboardData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value === 'all' ? '' : value);
    setCurrentPage(1);
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value === 'all' ? '' : value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    loadPromotions();
    loadDashboard();
  };

  const getStatusBadge = (status: string, count: number) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-green-200',
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      expired: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.expired}>
        {count} {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Promotions</h1>
          <p className="text-muted-foreground">
            Manage promotional campaigns and offers
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/admin/promotions/new">
              <Plus className="h-4 w-4 mr-2" />
              New Promotion
            </Link>
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.totalActive}</div>
              <p className="text-xs text-muted-foreground">
                Currently running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.totalScheduled}</div>
              <p className="text-xs text-muted-foreground">
                Waiting to start
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard.totalExpired}</div>
              <p className="text-xs text-muted-foreground">
                Completed campaigns
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent & Upcoming Promotions */}
      {dashboard && (dashboard.recentPromotions.length > 0 || dashboard.upcomingPromotions.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dashboard.recentPromotions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Active Promotions</CardTitle>
                <CardDescription>
                  Currently running promotions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.recentPromotions.slice(0, 5).map((promotion) => (
                    <div key={promotion.id} className="flex items-center justify-between">
                      <div>
                        <Link
                          to={`/admin/promotions/${promotion.id}`}
                          className="font-medium hover:underline"
                        >
                          {promotion.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {promotion.currentUsageCount} uses
                          {promotion.usageLimit && ` / ${promotion.usageLimit}`}
                        </p>
                      </div>
                      {getStatusBadge(promotion.status, promotion.currentUsageCount)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {dashboard.upcomingPromotions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Promotions</CardTitle>
                <CardDescription>
                  Scheduled to start soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.upcomingPromotions.slice(0, 5).map((promotion) => (
                    <div key={promotion.id} className="flex items-center justify-between">
                      <div>
                        <Link
                          to={`/admin/promotions/${promotion.id}`}
                          className="font-medium hover:underline"
                        >
                          {promotion.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Starts {new Date(promotion.startsAt).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(promotion.status, 0)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Promotions</CardTitle>
          <CardDescription>
            Search and filter promotional campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search promotions..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter || 'all'} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter || 'all'} onValueChange={handleTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="percentage_discount">Percentage Discount</SelectItem>
                <SelectItem value="fixed_discount">Fixed Discount</SelectItem>
                <SelectItem value="free_gift">Free Gift</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <PromotionTable 
                promotions={promotions} 
                onPromotionUpdate={loadPromotions}
              />
              
              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} promotions
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}