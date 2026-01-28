import { FlaggedBadge, StatusBadge, TypeBadge } from "@/components/badges/Badges";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useFlagRequest, useRequestAction, useRequests } from "@/hooks/useRequests";
import { DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle, FileText, Filter, Flag, FlagOff, Loader2, MoreHorizontal, XCircle } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const AdminRequests: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState<string>('ALL')
    const [typeFilter, setTypeFilter] = useState<string>('ALL')
    const { data: requests, isLoading } = useRequests()
    const requestAction = useRequestAction()
    const flagRequest = useFlagRequest()
    const { toast } = useToast()

    const filteredRequests = useMemo(() => {
        if (!requests) return []
        return requests.filter((r) => {
            const statusMatch = statusFilter === 'ALL' || r.status === statusFilter
            const typeMatch = typeFilter === 'ALL' || r.request_type === typeFilter
            return statusMatch && typeMatch
        })
    }, [requests, statusFilter, typeFilter])

    const handleQuickAction = async (id: number, action: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW') => {
        try {
            await requestAction.mutateAsync({ id, data: { action } });
            toast({ title: `Request ${action.toLowerCase()}` });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to perform action',
            });
        }
    };

    const handleFlag = async (id: number, isFlagged: boolean) => {
        try {
            await flagRequest.mutateAsync({ id, data: { is_flagged: !isFlagged } });
            toast({ title: isFlagged ? 'Request unflagged' : 'Request flagged' });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to flag request',
            });
        }
    };

    return (
        <AppLayout>
            <div className="page-container">
                {/* Header */}
                <div className="section-header">
                    <div>
                        <h1 className="text-3xl font-bold">All Requests</h1>
                        <p className="mt-1 text-muted-foreground">Manage and review all approval requests</p>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="py-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Statuses</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="APPROVED">Approved</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                    <SelectItem value="NEEDS_REVIEW">Needs Review</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Types</SelectItem>
                                    <SelectItem value="LEAVE">Leave</SelectItem>
                                    <SelectItem value="EXPENSE">Expense</SelectItem>
                                    <SelectItem value="DISCOUNT">Discount</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-muted-foreground">
                                {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Requests List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <Card>
                        <CardContent className="empty-state py-12">
                            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <p className="text-lg font-medium">No requests found</p>
                            <p className="text-sm text-muted-foreground">
                                No requests match the selected filters
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredRequests.map((request) => (
                            <Card key={request.id} className="transition-all hover:shadow-medium">
                                <CardContent className="flex items-center justify-between p-4">
                                    <Link to={`/requests/${request.id}`} className="flex flex-1 items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                                            <FileText className="h-5 w-5 text-accent-foreground" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">#{request.id}</span>
                                                <TypeBadge type={request.request_type} />
                                                {request.is_flagged && <FlaggedBadge />}
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                User #{request.user} •{' '}
                                                {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-4">
                                        <StatusBadge status={request.status} />
                                        {request.status === 'PENDING' && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => handleQuickAction(request.id, 'APPROVED')}
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4 text-status-approved" />
                                                        Approve
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleQuickAction(request.id, 'REJECTED')}
                                                    >
                                                        <XCircle className="mr-2 h-4 w-4 text-destructive" />
                                                        Reject
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleQuickAction(request.id, 'NEEDS_REVIEW')}
                                                    >
                                                        <AlertCircle className="mr-2 h-4 w-4 text-status-review" />
                                                        Needs Review
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleFlag(request.id, request.is_flagged)}
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
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}

export default AdminRequests