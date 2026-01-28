import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard, DistributionBar } from '@/components/stats/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Loader2,
    FileText,
    Percent,
    Clock,
    Flag,
    BarChart3,
    Filter,
    IndianRupee,
} from 'lucide-react';
import type { AnalyticsFilters } from '@/types';

const AdminAnalytics: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [filters, setFilters] = useState<AnalyticsFilters>({
        year: currentYear,
        month: currentMonth,
    });

    const { data: analytics, isLoading } = useAnalytics(filters);

    const statusDistribution = analytics
        ? [
            {
                label: 'Pending',
                value: analytics.status_counts.PENDING || 0,
                color: 'bg-status-pending',
            },
            {
                label: 'Approved',
                value: analytics.status_counts.APPROVED || 0,
                color: 'bg-status-approved',
            },
            {
                label: 'Rejected',
                value: analytics.status_counts.REJECTED || 0,
                color: 'bg-status-rejected',
            },
            {
                label: 'Needs Review',
                value: analytics.status_counts.NEEDS_REVIEW || 0,
                color: 'bg-status-review',
            },
        ]
        : [];

    const typeDistribution = analytics
        ? [
            {
                label: 'Leave',
                value: analytics.type_counts.LEAVE || 0,
                color: 'bg-type-leave',
            },
            {
                label: 'Expense',
                value: analytics.type_counts.EXPENSE || 0,
                color: 'bg-type-expense',
            },
            {
                label: 'Discount',
                value: analytics.type_counts.DISCOUNT || 0,
                color: 'bg-type-discount',
            },
        ]
        : [];

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' },
    ];

    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <AppLayout>
            <div className="page-container">
                {/* Header */}
                <div className="section-header">
                    <div>
                        <h1 className="text-3xl font-bold">Analytics</h1>
                        <p className="mt-1 text-muted-foreground">
                            Overview of approval requests and performance
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="py-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select
                                value={String(filters.month || '')}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, month: value ? Number(value) : undefined })
                                }
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Months</SelectItem>
                                    {months.map((month) => (
                                        <SelectItem key={month.value} value={String(month.value)}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={String(filters.year || '')}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, year: value ? Number(value) : undefined })
                                }
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Years</SelectItem>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={String(year)}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.request_type || ''}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, request_type: value ? (value as any) : undefined })
                                }
                            >
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="LEAVE">Leave</SelectItem>
                                    <SelectItem value="EXPENSE">Expense</SelectItem>
                                    <SelectItem value="DISCOUNT">Discount</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.grade || ''}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, grade: value || undefined })
                                }
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Grades</SelectItem>
                                    <SelectItem value="GRADE1">Grade 1</SelectItem>
                                    <SelectItem value="GRADE2">Grade 2</SelectItem>
                                    <SelectItem value="GRADE3">Grade 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : !analytics ? (
                    <Card>
                        <CardContent className="empty-state py-12">
                            <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <p className="text-lg font-medium">No data available</p>
                            <p className="text-sm text-muted-foreground">
                                Try adjusting your filters to see analytics
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Key Metrics */}
                        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                title="Total Requests"
                                value={analytics.total_requests}
                                icon={<FileText className="h-5 w-5" />}
                                variant="primary"
                            />
                            <StatCard
                                title="Total Expenses"
                                value={`₹${(analytics.financial_summary.total_expense_amount || 0).toLocaleString()}`}
                                icon={<IndianRupee className="h-5 w-5" />}
                                variant="warning"
                            />
                            <StatCard
                                title="Avg Discount"
                                value={`${(analytics.financial_summary.avg_discount_percentage || 0).toFixed(1)}%`}
                                icon={<Percent className="h-5 w-5" />}
                                variant="success"
                            />
                            <StatCard
                                title="Flagged"
                                value={analytics.flagged_count}
                                icon={<Flag className="h-5 w-5" />}
                                variant="danger"
                            />
                        </div>

                        {/* Processing Time */}
                        {analytics.performance_metrics.avg_processing_time_hours !== null && (
                            <Card className="mb-8">
                                <CardContent className="py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-lg bg-primary/10 p-3">
                                            <Clock className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Average Processing Time</p>
                                            <p className="text-2xl font-bold">
                                                {analytics.performance_metrics.avg_processing_time_hours.toFixed(1)} hours
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Distributions */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Status Distribution</CardTitle>
                                    <CardDescription>Breakdown of requests by status</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <DistributionBar items={statusDistribution} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Type Distribution</CardTitle>
                                    <CardDescription>Breakdown of requests by type</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <DistributionBar items={typeDistribution} />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Stats */}
                        <div className="mt-6 grid gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Status Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {Object.entries(analytics.status_counts).map(([status, count]) => (
                                            <div key={status} className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    {status.replace('_', ' ')}
                                                </span>
                                                <span className="font-medium">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Type Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {Object.entries(analytics.type_counts).map(([type, count]) => (
                                            <div key={type} className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">{type}</span>
                                                <span className="font-medium">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
};

export default AdminAnalytics;
