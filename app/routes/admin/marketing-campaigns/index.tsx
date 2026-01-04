import { useState } from 'react';
import { useLoaderData, useSearchParams, useNavigate, useRevalidator, useNavigation } from 'react-router';
import type { Route } from './+types/index';
import {
  getAllMarketingCampaigns,
  deleteMarketingCampaign,
  type MarketingCampaignListItem,
} from '~/lib/services/admin/marketing-campaigns-admin.service';
import { TableSkeleton } from '~/components/admin/layout/table-skeleton';
import { showSuccess, showError } from '~/lib/admin/toast';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { Switch } from '~/components/ui/switch';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, Search, ExternalLink } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const search = url.searchParams.get('search') || undefined;
  const status = url.searchParams.get('status') || undefined;

  const response = await getAllMarketingCampaigns(
    { page, limit, search, status },
    request.headers
  );

  return {
    campaigns: response.data,
    total: response.total,
    page,
    limit,
  };
}

export default function MarketingCampaignsIndexPage() {
  const { campaigns, total, page, limit } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const navigation = useNavigation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  const isLoading = navigation.state === 'loading' || revalidator.state === 'loading';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    navigate(`?${params.toString()}`);
  };

  const handleDelete = async () => {
    if (!deleteId || isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteMarketingCampaign(deleteId);
      showSuccess('Campaign deleted successfully');
      revalidator.revalidate();
    } catch (error: any) {
      showError(error.message || 'Failed to delete campaign');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getCampaignStatus = (campaign: MarketingCampaignListItem) => {
    if (!campaign.isActive) return { label: 'Inactive', variant: 'secondary' as const };

    const now = new Date();
    if (campaign.startsAt && new Date(campaign.startsAt) > now) {
      return { label: 'Scheduled', variant: 'outline' as const };
    }
    if (campaign.endsAt && new Date(campaign.endsAt) < now) {
      return { label: 'Ended', variant: 'secondary' as const };
    }
    return { label: 'Active', variant: 'default' as const };
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Campaigns</h1>
          <p className="text-muted-foreground mt-2">
            Manage promotional landing pages and marketing campaigns
          </p>
        </div>
        <Button onClick={() => navigate('/admin/marketing-campaigns/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Campaign
        </Button>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search campaigns..."
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton columns={5} rows={5} />
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">No marketing campaigns found</p>
            <Button onClick={() => navigate('/admin/marketing-campaigns/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => {
                const status = getCampaignStatus(campaign);
                return (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">{campaign.title}</p>
                        <p className="text-xs text-muted-foreground">/{campaign.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {campaign.startsAt ? (
                          <p>
                            Start: {format(new Date(campaign.startsAt), 'MMM d, yyyy')}
                          </p>
                        ) : (
                          <p className="text-muted-foreground">No start date</p>
                        )}
                        {campaign.endsAt && (
                          <p>End: {format(new Date(campaign.endsAt), 'MMM d, yyyy')}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(`/campaign/${campaign.slug}`, '_blank')}
                          title="Preview"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/marketing-campaigns/${campaign.id}`)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(campaign.id)}
                          className="text-destructive hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({total} campaigns)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('page', String(page - 1));
                navigate(`?${params.toString()}`);
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('page', String(page + 1));
                navigate(`?${params.toString()}`);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the marketing campaign.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
