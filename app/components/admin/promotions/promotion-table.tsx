import React, { useState } from 'react';
import { Link } from 'react-router';
import { 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Play, 
  Pause, 
  Square, 
  Trash2, 
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
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
import { toast } from '~/lib/admin/toast';
import type { PromotionListItem } from '~/lib/services/admin/promotion-admin.service';
import {
  activatePromotion,
  deactivatePromotion,
  pausePromotion,
  resumePromotion,
  duplicatePromotion,
  deletePromotion
} from '~/lib/services/admin/promotion-admin.service';

interface PromotionTableProps {
  promotions: PromotionListItem[];
  onPromotionUpdate: () => void;
}

export function PromotionTable({ promotions, onPromotionUpdate }: PromotionTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-green-200',
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      expired: 'bg-gray-100 text-gray-800 border-gray-200',
      draft: 'bg-gray-100 text-gray-600 border-gray-200'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.draft}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      percentage_discount: 'bg-purple-100 text-purple-800 border-purple-200',
      fixed_discount: 'bg-orange-100 text-orange-800 border-orange-200',
      free_gift: 'bg-pink-100 text-pink-800 border-pink-200'
    };

    const labels = {
      percentage_discount: 'Percentage',
      fixed_discount: 'Fixed Amount',
      free_gift: 'Free Gift'
    };

    return (
      <Badge className={variants[type as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (promotionId: string, action: string) => {
    setIsLoading(promotionId);
    try {
      switch (action) {
        case 'activate':
          await activatePromotion(promotionId);
          toast.success('Promotion activated successfully');
          break;
        case 'deactivate':
          await deactivatePromotion(promotionId);
          toast.success('Promotion deactivated successfully');
          break;
        case 'pause':
          await pausePromotion(promotionId);
          toast.success('Promotion paused successfully');
          break;
        case 'resume':
          await resumePromotion(promotionId);
          toast.success('Promotion resumed successfully');
          break;
      }
      onPromotionUpdate();
    } catch (error) {
      toast.error(`Failed to ${action} promotion: ${(error as Error).message}`);
    } finally {
      setIsLoading(null);
    }
  };

  const handleDuplicate = async (promotionId: string) => {
    setIsLoading(promotionId);
    try {
      await duplicatePromotion(promotionId);
      toast.success('Promotion duplicated successfully');
      onPromotionUpdate();
    } catch (error) {
      toast.error(`Failed to duplicate promotion: ${(error as Error).message}`);
    } finally {
      setIsLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!promotionToDelete) return;

    setIsLoading(promotionToDelete);
    try {
      await deletePromotion(promotionToDelete);
      toast.success('Promotion deleted successfully');
      onPromotionUpdate();
    } catch (error) {
      toast.error(`Failed to delete promotion: ${(error as Error).message}`);
    } finally {
      setIsLoading(null);
      setDeleteDialogOpen(false);
      setPromotionToDelete(null);
    }
  };

  const isPromotionExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const canActivate = (promotion: PromotionListItem) => {
    return ['draft', 'scheduled', 'paused'].includes(promotion.status) && !isPromotionExpired(promotion.endsAt);
  };

  const canPause = (promotion: PromotionListItem) => {
    return promotion.status === 'active';
  };

  const canResume = (promotion: PromotionListItem) => {
    return promotion.status === 'paused' && !isPromotionExpired(promotion.endsAt);
  };

  const canDeactivate = (promotion: PromotionListItem) => {
    return ['active', 'paused'].includes(promotion.status);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No promotions found
                </TableCell>
              </TableRow>
            ) : (
              promotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/promotions/${promotion.id}`}
                        className="font-medium hover:underline"
                      >
                        {promotion.name}
                      </Link>
                      {isPromotionExpired(promotion.endsAt) && promotion.status !== 'expired' && (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(promotion.type)}</TableCell>
                  <TableCell>{getStatusBadge(promotion.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(promotion.startsAt)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(promotion.endsAt)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{promotion.currentUsageCount}</div>
                      {promotion.usageLimit && (
                        <div className="text-muted-foreground">
                          / {promotion.usageLimit}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{promotion.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={isLoading === promotion.id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/promotions/${promotion.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/promotions/${promotion.id}/analytics`}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Analytics
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicate(promotion.id)}
                          disabled={isLoading === promotion.id}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {canActivate(promotion) && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(promotion.id, 'activate')}
                            disabled={isLoading === promotion.id}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        {canPause(promotion) && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(promotion.id, 'pause')}
                            disabled={isLoading === promotion.id}
                          >
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </DropdownMenuItem>
                        )}
                        {canResume(promotion) && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(promotion.id, 'resume')}
                            disabled={isLoading === promotion.id}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Resume
                          </DropdownMenuItem>
                        )}
                        {canDeactivate(promotion) && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(promotion.id, 'deactivate')}
                            disabled={isLoading === promotion.id}
                          >
                            <Square className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setPromotionToDelete(promotion.id);
                            setDeleteDialogOpen(true);
                          }}
                          disabled={isLoading === promotion.id}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promotion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this promotion? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}