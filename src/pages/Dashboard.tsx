import { FlaggedBadge, StatusBadge, TypeBadge } from "@/components/badges/Badges"
import { AppLayout } from "@/components/layout/AppLayout"
import { StatCard } from "@/components/stats/StatCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useRequests } from "@/hooks/useRequests"
import { AlertCircle, ArrowRight, CheckCircle, Clock, FileText, Loader2, PlusCircle, XCircle } from "lucide-react"
import React from "react"
import { Link } from "react-router-dom"
import { formatDistanceToNow } from 'date-fns'

const Dashboard: React.FC = () => {
    const { user } = useAuth()
    const { data: requests, isLoading } = useRequests({ mine: true })

    const stats = React.useMemo(() => {
        if (!requests) return null

        return {
            total: requests.length,
            pending: requests.filter((r) => r.status === 'PENDING').length,
            approved: requests.filter((r) => r.status === 'APPROVED').length,
            rejected: requests.filter((r) => r.status === 'REJECTED').length,
            needsReview: requests.filter((r) => r.status === 'NEEDS_REVIEW').length,
        }
    }, [requests])

    const recentRequests = requests?.slice(0, 5) || []
    return (
        <AppLayout>
            <div className="page-container">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Welcome back, {user?.username}!</h1>
                    <p className="mt-1 text-muted-foreground">
                        Here's an overview of your approval requests
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                title="Total Requests"
                                value={stats?.total || 0}
                                icon={<FileText className="h-5 w-5" />}
                                variant="primary"
                            />
                            <StatCard
                                title="Pending"
                                value={stats?.pending || 0}
                                icon={<Clock className="h-5 w-5" />}
                                variant="warning"
                            />
                            <StatCard
                                title="Approved"
                                value={stats?.approved || 0}
                                icon={<CheckCircle className="h-5 w-5" />}
                                variant="success"
                            />
                            <StatCard
                                title="Rejected"
                                value={stats?.rejected || 0}
                                icon={<XCircle className="h-5 w-5" />}
                                variant="danger"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="mb-8 grid gap-4 sm:grid-cols-3">
                            <Link to="/requests/new?type=LEAVE">
                                <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-medium">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <div className="rounded-lg bg-type-leave/10 p-3">
                                            <PlusCircle className="h-5 w-5 text-type-leave" />
                                        </div>
                                        <div>
                                            <p className="font-medium">New Leave Request</p>
                                            <p className="text-sm text-muted-foreground">Request time off</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                            <Link to="/requests/new?type=EXPENSE">
                                <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-medium">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <div className="rounded-lg bg-type-expense/10 p-3">
                                            <PlusCircle className="h-5 w-5 text-type-expense" />
                                        </div>
                                        <div>
                                            <p className="font-medium">New Expense Request</p>
                                            <p className="text-sm text-muted-foreground">Submit expenses</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                            <Link to="/requests/new?type=DISCOUNT">
                                <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-medium">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <div className="rounded-lg bg-type-discount/10 p-3">
                                            <PlusCircle className="h-5 w-5 text-type-discount" />
                                        </div>
                                        <div>
                                            <p className="font-medium">New Discount Request</p>
                                            <p className="text-sm text-muted-foreground">Request discounts</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>

                        {/* Recent Requests */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Recent Requests</CardTitle>
                                    <CardDescription>Your latest approval requests</CardDescription>
                                </div>
                                <Link to="/requests">
                                    <Button variant="outline" size="sm">
                                        View All
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {recentRequests.length === 0 ? (
                                    <div className="empty-state">
                                        <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                        <p className="text-lg font-medium">No requests yet</p>
                                        <p className="text-sm text-muted-foreground">
                                            Create your first request to get started
                                        </p>
                                        <Link to="/requests/new" className="mt-4">
                                            <Button>
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                New Request
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {recentRequests.map((request) => (
                                            <Link
                                                key={request.id}
                                                to={`/requests/${request.id}`}
                                                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <TypeBadge type={request.request_type} />
                                                            {request.is_flagged && <FlaggedBadge />}
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {formatDistanceToNow(new Date(request.created_at), {
                                                                addSuffix: true,
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <StatusBadge status={request.status} />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </AppLayout>
    )
}

export default Dashboard