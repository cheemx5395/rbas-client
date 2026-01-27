import { RoleBadge } from "@/components/badges/Badges";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Award, Calendar, Mail, Shield, User } from "lucide-react";
import React from "react";

const Profile: React.FC = () => {
    const { user } = useAuth()

    const profileItems = [
        {
            icon: User,
            label: 'Username',
            value: user?.username,
        },
        {
            icon: Mail,
            label: 'Email',
            value: user?.email || 'Not provided',
        },
        {
            icon: Shield,
            label: 'Role',
            value: <RoleBadge role={user?.role || 'USER'} />,
        },
        {
            icon: Award,
            label: 'Grade',
            value: user?.grade === 'NA' ? 'Not Assigned' : user?.grade,
        },
        {
            icon: Calendar,
            label: 'Member Since',
            value: user?.created_at
                ? format(new Date(user.created_at), 'MMMM d, yyyy')
                : 'Unknown'
        },
    ]

    return (
        <AppLayout>
            <div className="page-container">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Profile</h1>
                    <p className="mt-1 text-muted-foreground">Manage your account information</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Profile Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Your personal details and account settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {profileItems.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="rounded-lg bg-accent p-3">
                                                <Icon className="h-5 w-5 text-accent-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">{item.label}</p>
                                                <div className="font-medium">{item.value}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Role Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Role Permissions</CardTitle>
                            <CardDescription>What you can do in the system</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {user?.role === 'ADMIN' && (
                                    <>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-role-admin" />
                                            <div>
                                                <p className="font-medium">Full Admin Access</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Manage policies, view analytics, and approve requests
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-role-admin" />
                                            <div>
                                                <p className="font-medium">Policy Management</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Create, update, and delete approval policies
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                                    <>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-role-manager" />
                                            <div>
                                                <p className="font-medium">Request Approval</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Review and approve or reject requests
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-role-manager" />
                                            <div>
                                                <p className="font-medium">Flag Requests</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Mark requests for special attention
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-role-user" />
                                    <div>
                                        <p className="font-medium">Create Requests</p>
                                        <p className="text-sm text-muted-foreground">
                                            Submit leave, expense, and discount requests
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 h-2 w-2 rounded-full bg-role-user" />
                                    <div>
                                        <p className="font-medium">View Own Requests</p>
                                        <p className="text-sm text-muted-foreground">
                                            Track the status of your submissions
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}

export default Profile