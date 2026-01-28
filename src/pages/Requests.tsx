import { FlaggedBadge, StatusBadge, TypeBadge } from "@/components/badges/Badges";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRequests } from "@/hooks/useRequests";
import { formatDistanceToNow } from "date-fns";
import { FileText, Filter, Loader2, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Requests: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState<string>('ALL')
    const { data: requests, isLoading } = useRequests({ mine: true })
    const filteredRequests = React.useMemo(() => {
        if (!requests) return []
        if (statusFilter === 'ALL') return requests
        return requests.filter((r) => r.status === statusFilter)
    }, [requests, statusFilter])

    return (
        <AppLayout>
            <div className="page-container">
                {/* Header */}
                <div className="section-header">
                    <div>
                        <h1 className="text-3xl font-bold">My Requests</h1>
                        <p className="mt-1 text-muted-foreground">View and manage your approval requests</p>
                    </div>
                    <Link to="/requests/new">
                        <Button className="btn-gradient">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Request
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filter by status" />
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
                                {statusFilter === 'ALL'
                                    ? 'Create your first request to get started'
                                    : 'No requests match the selected filter'}
                            </p>
                            {statusFilter === 'ALL' && (
                                <Link to="/requests/new" className="mt-4">
                                    <Button>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        New Request
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredRequests.map((request) => (
                            <Link key={request.id} to={`/requests/${request.id}`}>
                                <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-medium">
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                                                <FileText className="h-5 w-5 text-accent-foreground" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <TypeBadge type={request.request_type} />
                                                    {request.is_flagged && <FlaggedBadge />}
                                                </div>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Created{' '}
                                                    {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <StatusBadge status={request.status} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

        </AppLayout>
    )
}

export default Requests 