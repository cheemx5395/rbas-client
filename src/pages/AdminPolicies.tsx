import React, { useState } from 'react';
import { useCreatePolicy, useDeletePolicy, usePolicies, useUpdatePolicy } from '@/hooks/userPolicies'
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, Plus, Pencil, Trash2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Policy, RequestType } from '@/types';

const initialFormState: Omit<Policy, 'id'> = {
    request_type: 'LEAVE',
    policy_key: '',
    value: '',
    policy_grade: '',
    violation_action: 'FLAG',
    is_active: true,
};

const AdminPolicies: React.FC = () => {
    const { data: policies, isLoading } = usePolicies();
    const createPolicy = useCreatePolicy();
    const updatePolicy = useUpdatePolicy();
    const deletePolicy = useDeletePolicy();
    const { toast } = useToast();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
    const [formData, setFormData] = useState<Omit<Policy, 'id'>>(initialFormState);

    const handleOpenCreate = () => {
        setEditingPolicy(null);
        setFormData(initialFormState);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (policy: Policy) => {
        setEditingPolicy(policy);
        setFormData({
            request_type: policy.request_type,
            policy_key: policy.policy_key,
            value: policy.value,
            policy_grade: policy.policy_grade || '',
            violation_action: policy.violation_action,
            is_active: policy.is_active,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPolicy) {
                await updatePolicy.mutateAsync({ id: editingPolicy.id!, data: formData });
                toast({ title: 'Policy updated' });
            } else {
                await createPolicy.mutateAsync(formData);
                toast({ title: 'Policy created' });
            }
            setIsDialogOpen(false);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save policy',
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deletePolicy.mutateAsync(id);
            toast({ title: 'Policy deleted' });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete policy',
            });
        }
    };

    const getTypeColor = (type: RequestType) => {
        switch (type) {
            case 'LEAVE':
                return 'bg-type-leave/10 text-type-leave';
            case 'EXPENSE':
                return 'bg-type-expense/10 text-type-expense';
            case 'DISCOUNT':
                return 'bg-type-discount/10 text-type-discount';
        }
    };

    return (
        <AppLayout>
            <div className="page-container">
                {/* Header */}
                <div className="section-header">
                    <div>
                        <h1 className="text-3xl font-bold">Policies</h1>
                        <p className="mt-1 text-muted-foreground">Manage approval rules and policies</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="btn-gradient" onClick={handleOpenCreate}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Policy
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle>{editingPolicy ? 'Edit Policy' : 'Create Policy'}</DialogTitle>
                                    <DialogDescription>
                                        {editingPolicy
                                            ? 'Update the policy details'
                                            : 'Configure a new approval policy'}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label>Request Type</Label>
                                        <Select
                                            value={formData.request_type}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, request_type: value as RequestType })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LEAVE">Leave</SelectItem>
                                                <SelectItem value="EXPENSE">Expense</SelectItem>
                                                <SelectItem value="DISCOUNT">Discount</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="policy_key">Policy Key</Label>
                                        <Input
                                            id="policy_key"
                                            value={formData.policy_key}
                                            onChange={(e) => setFormData({ ...formData, policy_key: e.target.value })}
                                            placeholder="e.g., max_days, max_amount"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="value">Value</Label>
                                        <Input
                                            id="value"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                            placeholder="e.g., 10, 5000"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Policy Grade (optional)</Label>
                                        <Select
                                            value={formData.policy_grade || 'NONE'}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, policy_grade: value === 'NONE' ? '' : value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select grade" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NONE">All Grades</SelectItem>
                                                <SelectItem value="GRADE1">Grade 1</SelectItem>
                                                <SelectItem value="GRADE2">Grade 2</SelectItem>
                                                <SelectItem value="GRADE3">Grade 3</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Violation Action</Label>
                                        <Select
                                            value={formData.violation_action}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, violation_action: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="AUTO_REJECT">Auto Reject</SelectItem>
                                                <SelectItem value="FLAG">Flag</SelectItem>
                                                <SelectItem value="NEEDS_REVIEW">Needs Review</SelectItem>
                                                <SelectItem value="AUTO_APPROVE">Auto Approve</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <Label htmlFor="is_active">Active</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Enable or disable this policy
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_active"
                                            checked={formData.is_active}
                                            onCheckedChange={(checked) =>
                                                setFormData({ ...formData, is_active: checked })
                                            }
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="mt-6">
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={createPolicy.isPending || updatePolicy.isPending}
                                    >
                                        {createPolicy.isPending || updatePolicy.isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : editingPolicy ? (
                                            'Update Policy'
                                        ) : (
                                            'Create Policy'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Policies List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : !policies || policies.length === 0 ? (
                    <Card>
                        <CardContent className="empty-state py-12">
                            <Shield className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <p className="text-lg font-medium">No policies configured</p>
                            <p className="text-sm text-muted-foreground">
                                Create your first policy to automate approvals
                            </p>
                            <Button className="mt-4" onClick={handleOpenCreate}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Policy
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {policies.map((policy) => (
                            <Card key={policy.id} className={!policy.is_active ? 'opacity-60' : ''}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div
                                            className={`rounded-lg px-2 py-1 text-xs font-medium ${getTypeColor(
                                                policy.request_type
                                            )}`}
                                        >
                                            {policy.request_type}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleOpenEdit(policy)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Policy</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this policy? This action cannot be
                                                            undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(policy.id!)}>
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg">{policy.policy_key}</CardTitle>
                                    <CardDescription>Value: {policy.value}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        {policy.policy_grade && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Grade</span>
                                                <span className="font-medium">{policy.policy_grade}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Action</span>
                                            <span className="font-medium">{policy.violation_action.replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Status</span>
                                            <span
                                                className={`font-medium ${policy.is_active ? 'text-status-approved' : 'text-muted-foreground'
                                                    }`}
                                            >
                                                {policy.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default AdminPolicies;
