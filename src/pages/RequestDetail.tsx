import { FlaggedBadge, StatusBadge, TypeBadge } from "@/components/badges/Badges";
import { AppLayout } from "@/components/layout/AppLayout";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useDeleteRequest, useFlagRequest, useRequest, useRequestAction } from "@/hooks/useRequests";
import type { DiscountRequestDetails, ExpenseRequestDetails, LeaveRequestDetails } from "@/types";
import { format } from "date-fns";
import { AlertCircle, ArrowLeft, Calendar, CheckCircle, Flag, FlagOff, IndianRupee, Loader2, Percent, Trash2, User, XCircle } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RequestDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { toast } = useToast()
    const { data: request, isLoading } = useRequest(Number(id))
    const deleteRequest = useDeleteRequest()
    const requestAction = useRequestAction()
    const flagRequest = useFlagRequest()
    const [actionReason, setActionReason] = useState('')

    const isOwner = request?.user === user?.id
    const canDelete = isOwner && request?.status === 'PENDING'
    const isManagerOrAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER'

    const handleDelete = async () => {
        if (!request) return
        try {
            await deleteRequest.mutateAsync(request.id)
            toast({ title: 'Request deleted' })
            navigate('/requests')
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete request',
            })
        }
    }

    const handleAction = async (action: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW') => {
        if (!request) return
        try {
            await requestAction.mutateAsync({
                id: request.id,
                data: { action, reason: actionReason || undefined },
            })
            toast({
                title: `Request ${action.toLowerCase()}`,
                description: `The request has been ${action.toLowerCase()}`,
            })
            setActionReason('')
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to perform action',
            })
        }
    }

    const handleFlag = async () => {
        if (!request) return;
        try {
            await flagRequest.mutateAsync({
                id: request.id,
                data: { is_flagged: !request.is_flagged },
            });
            toast({
                title: request.is_flagged ? 'Request unflagged' : 'Request flagged',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to flag request',
            });
        }
    }

    const renderDetails = () => {
        if (!request) return null;

        switch (request.request_type) {
            case 'LEAVE': {
                const details = request.details as LeaveRequestDetails;
                return (
                    <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Leave Type</p>
                                <p className="font-medium">{details.leave_type}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Duration</p>
                                <p className="font-medium">
                                    {format(new Date(details.from_date), 'MMM d, yyyy')} —{' '}
                                    {format(new Date(details.to_date), 'MMM d, yyyy')}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Reason</p>
                            <p className="font-medium">{details.reason}</p>
                        </div>
                    </div>
                );
            }
            case 'EXPENSE': {
                const details = request.details as ExpenseRequestDetails;
                return (
                    <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Amount</p>
                                <p className="text-2xl font-bold">₹{details.amount.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Category</p>
                                <p className="font-medium">{details.category}</p>
                            </div>
                        </div>
                        {details.description && (
                            <div>
                                <p className="text-sm text-muted-foreground">Description</p>
                                <p className="font-medium">{details.description}</p>
                            </div>
                        )}
                    </div>
                );
            }
            case 'DISCOUNT': {
                const details = request.details as DiscountRequestDetails;
                return (
                    <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Discount</p>
                                <p className="text-2xl font-bold">{details.discount_percentage}%</p>
                            </div>
                            {details.discount_category && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Category</p>
                                    <p className="font-medium">{details.discount_category}</p>
                                </div>
                            )}
                        </div>
                        {details.description && (
                            <div>
                                <p className="text-sm text-muted-foreground">Description</p>
                                <p className="font-medium">{details.description}</p>
                            </div>
                        )}
                    </div>
                );
            }
        }
    };

    const getIcon = () => {
        switch (request?.request_type) {
            case 'LEAVE':
                return <Calendar className="h-6 w-6" />;
            case 'EXPENSE':
                return <IndianRupee className="h-6 w-6" />;
            case 'DISCOUNT':
                return <Percent className="h-6 w-6" />;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex min-h-[50vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AppLayout>
        );
    }

    if (!request) {
        return (
            <AppLayout>
                <div className="page-container">
                    <Card>
                        <CardContent className="empty-state py-12">
                            <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <p className="text-lg font-medium">Request not found</p>
                            <Button className="mt-4" onClick={() => navigate('/requests')}>
                                Back to Requests
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="page-container">
                {/* Header */}
                <div className="mb-8">
                    <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-accent p-3">{getIcon()}</div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold">Request #{request.id}</h1>
                                    {request.is_flagged && <FlaggedBadge />}
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                    <TypeBadge type={request.request_type} />
                                    <StatusBadge status={request.status} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isManagerOrAdmin && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleFlag}
                                    disabled={flagRequest.isPending}
                                >
                                    {request.is_flagged ? (
                                        <>
                                            <FlagOff className="mr-2 h-4 w-4" />
                                            Unflag
                                        </>
                                    ) : (
                                        <>
                                            <Flag className="mr-2 h-4 w-4" />
                                            Flag
                                        </>
                                    )}
                                </Button>
                            )}
                            {canDelete && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Request</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this request? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Request Details */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Request Details</CardTitle>
                            <CardDescription>
                                Created on {format(new Date(request.created_at), 'MMMM d, yyyy')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* User Information */}
                            <div className="rounded-lg border bg-muted/50 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-primary/10 p-2">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Requested By</p>
                                        <p className="font-medium">{request.username || `User #${request.user}`}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Request Type Specific Details */}
                            {renderDetails()}
                        </CardContent>
                    </Card>

                    {/* Status & Actions */}
                    <div className="space-y-6">
                        {/* Decision Info */}
                        {request.decision_reason && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Decision</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{request.decision_reason}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Admin/Manager Actions */}
                        {isManagerOrAdmin && (request.status === 'PENDING' || request.status === 'NEEDS_REVIEW') && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Take Action</CardTitle>
                                    <CardDescription>Review and decide on this request</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Reason (optional)</Label>
                                        <Textarea
                                            placeholder="Add a reason for your decision..."
                                            value={actionReason}
                                            onChange={(e) => setActionReason(e.target.value)}
                                            className="min-h-20"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            onClick={() => handleAction('APPROVED')}
                                            disabled={requestAction.isPending}
                                            className="w-full bg-status-approved hover:bg-status-approved/90"
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleAction('REJECTED')}
                                            disabled={requestAction.isPending}
                                            variant="destructive"
                                            className="w-full"
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => handleAction('NEEDS_REVIEW')}
                                            disabled={requestAction.isPending}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <AlertCircle className="mr-2 h-4 w-4" />
                                            Needs Review
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default RequestDetail;