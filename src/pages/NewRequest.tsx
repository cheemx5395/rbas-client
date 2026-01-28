import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateRequest } from '@/hooks/useRequests';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, ArrowLeft, Calendar, Percent, IndianRupee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { RequestType } from '@/types';

// Leave request schema
const leaveSchema = z.object({
    leave_type: z.enum(['SICK', 'PAID', 'UNPAID']),
    from_date: z.string().min(1, 'Start date is required'),
    to_date: z.string().min(1, 'End date is required'),
    reason: z.string().min(1, 'Reason is required'),
}).refine((data) => {
    if (data.from_date && data.to_date) {
        return new Date(data.from_date) <= new Date(data.to_date);
    }
    return true;
}, {
    message: 'End date must be after or equal to start date',
    path: ['to_date'],
});

// Expense request schema
const expenseSchema = z.object({
    amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
    category: z.enum(['FOOD', 'TRAVEL', 'ACCOMMODATION', 'OTHER']),
    description: z.string().optional(),
});

// Discount request schema
const discountSchema = z.object({
    discount_percentage: z.coerce.number().min(0.01, 'Discount must be greater than 0').max(100, 'Discount cannot exceed 100%'),
    discount_category: z.enum(['LOAN', 'FESTIVE', 'OTHER']).optional(),
    description: z.string().optional(),
});

type LeaveFormValues = z.infer<typeof leaveSchema>;
type ExpenseFormValues = z.infer<typeof expenseSchema>;
type DiscountFormValues = z.infer<typeof discountSchema>;

const NewRequest: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const initialType = (searchParams.get('type') as RequestType) || 'LEAVE';
    const [requestType, setRequestType] = useState<RequestType>(initialType);
    const { createRequest, isLoading } = useCreateRequest();

    const getSchema = () => {
        switch (requestType) {
            case 'LEAVE':
                return leaveSchema;
            case 'EXPENSE':
                return expenseSchema;
            case 'DISCOUNT':
                return discountSchema;
        }
    };

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(getSchema()),
    });

    // Reset form when type changes
    React.useEffect(() => {
        reset();
    }, [requestType, reset]);

    const onSubmit = async (data: any) => {
        try {
            await createRequest(requestType, data);
            toast({
                title: 'Request created!',
                description: 'Your request has been submitted successfully',
            });
            navigate('/requests');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create request',
            });
        }
    };

    const leaveErrors = errors as FieldErrors<LeaveFormValues>;
    const expenseErrors = errors as FieldErrors<ExpenseFormValues>;
    const discountErrors = errors as FieldErrors<DiscountFormValues>;

    return (
        <AppLayout>
            <div className="page-container">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        className="mb-4"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold">New Request</h1>
                    <p className="mt-1 text-muted-foreground">
                        Create a new approval request
                    </p>
                </div>

                <div className="mx-auto max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Request Details</CardTitle>
                            <CardDescription>Fill in the details for your request</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Request Type */}
                                <div className="space-y-2">
                                    <Label>Request Type</Label>
                                    <Select
                                        value={requestType}
                                        onValueChange={(value) => setRequestType(value as RequestType)}
                                    >
                                        <SelectTrigger className="input-focus">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LEAVE">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Leave Request
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="EXPENSE">
                                                <div className="flex items-center gap-2">
                                                    <IndianRupee className="h-4 w-4" />
                                                    Expense Request
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="DISCOUNT">
                                                <div className="flex items-center gap-2">
                                                    <Percent className="h-4 w-4" />
                                                    Discount Request
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Leave Request Fields */}
                                {requestType === 'LEAVE' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Leave Type</Label>
                                            <Select
                                                value={watch('leave_type')}
                                                onValueChange={(value) => setValue('leave_type', value as 'SICK' | 'PAID' | 'UNPAID')}
                                            >
                                                <SelectTrigger className="input-focus">
                                                    <SelectValue placeholder="Select leave type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SICK">Sick Leave</SelectItem>
                                                    <SelectItem value="PAID">Paid Leave</SelectItem>
                                                    <SelectItem value="UNPAID">Unpaid Leave</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {leaveErrors.leave_type && (
                                                <p className="text-sm text-destructive">{String(leaveErrors.leave_type.message)}</p>
                                            )}
                                        </div>

                                        {/* In the Leave Request Fields section */}
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="from_date">Start Date</Label>
                                                <Input
                                                    id="from_date"
                                                    type="date"
                                                    className="input-focus"
                                                    {...register('from_date')}
                                                />
                                                {leaveErrors.from_date && (
                                                    <p className="text-sm text-destructive">{String(leaveErrors.from_date.message)}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="to_date">End Date</Label>
                                                <Input
                                                    id="to_date"
                                                    type="date"
                                                    className="input-focus"
                                                    min={watch('from_date')} // Add this line
                                                    {...register('to_date')}
                                                />
                                                {leaveErrors.to_date && (
                                                    <p className="text-sm text-destructive">{String(leaveErrors.to_date.message)}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="reason">Reason</Label>
                                            <Textarea
                                                id="reason"
                                                placeholder="Explain the reason for your leave request"
                                                className="input-focus min-h-24"
                                                {...register('reason')}
                                            />
                                            {leaveErrors.reason && (
                                                <p className="text-sm text-destructive">{String(leaveErrors.reason.message)}</p>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Expense Request Fields */}
                                {requestType === 'EXPENSE' && (
                                    <>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="amount">Amount</Label>
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    className="input-focus"
                                                    {...register('amount')}
                                                />
                                                {expenseErrors.amount && (
                                                    <p className="text-sm text-destructive">{String(expenseErrors.amount.message)}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Category</Label>
                                                <Select
                                                    value={watch('category')}
                                                    onValueChange={(value) => setValue('category', value as 'FOOD' | 'TRAVEL' | 'ACCOMMODATION' | 'OTHER')}
                                                >
                                                    <SelectTrigger className="input-focus">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="FOOD">Food</SelectItem>
                                                        <SelectItem value="TRAVEL">Travel</SelectItem>
                                                        <SelectItem value="ACCOMMODATION">Accommodation</SelectItem>
                                                        <SelectItem value="OTHER">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {expenseErrors.category && (
                                                    <p className="text-sm text-destructive">{String(expenseErrors.category.message)}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description (optional)</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Provide additional details about the expense"
                                                className="input-focus min-h-24"
                                                {...register('description')}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Discount Request Fields */}
                                {requestType === 'DISCOUNT' && (
                                    <>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="discount_percentage">Discount Percentage</Label>
                                                <Input
                                                    id="discount_percentage"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    className="input-focus"
                                                    {...register('discount_percentage')}
                                                />
                                                {discountErrors.discount_percentage && (
                                                    <p className="text-sm text-destructive">{String(discountErrors.discount_percentage.message)}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Category (optional)</Label>
                                                <Select
                                                    value={watch('discount_category')}
                                                    onValueChange={(value) => setValue('discount_category', value as 'LOAN' | 'FESTIVE' | 'OTHER')}
                                                >
                                                    <SelectTrigger className="input-focus">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="LOAN">Loan</SelectItem>
                                                        <SelectItem value="FESTIVE">Festive</SelectItem>
                                                        <SelectItem value="OTHER">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description (optional)</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Provide additional details about the discount request"
                                                className="input-focus min-h-24"
                                                {...register('description')}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Submit Button */}
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => navigate('/requests')}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1 btn-gradient" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Request'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default NewRequest; 
