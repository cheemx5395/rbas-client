import { useToast } from '@/hooks/use-toast'
import type React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '@/api/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Loader2, UserPlus } from 'lucide-react'

const registerSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  email: z.email().optional(),
  role: z.enum(["ADMIN", "MANAGER", "USER"]),
  grade: z.enum(["GRADE1", "GRADE2", "GRADE3", "NA"]),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

type RegisterFormData = z.infer<typeof registerSchema>

const Register: React.FC = () => {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'USER',
            grade: 'NA',
        }
    })

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true)
        try {
            await authApi.register({
                username: data.username,
                email: data.email || undefined,
                password: data.password,
                role: data.role,
                grade: data.grade,
            })
            toast({
                title: 'Registration successful!',
                description: 'You can now sign in with your credentials',
            })
            navigate('/login')
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Registration failed',
                description: error.response?.data?.message || 'Something went wrong'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-md animate-fade-in">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                        <span className="text-xl font-bold text-primary-foreground">RBAS</span>
                    </div>
                    <h1 className="text-2xl font-bold">Join RBAS</h1>
                    <p className="mt-1 text-muted-foreground">Create your account to get started</p>
                </div>

                <Card className="border-0 shadow-medium">
                    <CardHeader className="text-center">
                        <CardTitle>Create Account</CardTitle>
                        <CardDescription>Fill in your details to register</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username *</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    className="input-focus"
                                    {...register('username')}
                                />
                                {errors.username && (
                                    <p className="text-sm text-destructive">{errors.username.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email (optional)"
                                    className="input-focus"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Select
                                        value={watch('role')}
                                        onValueChange={(value) => setValue('role', value as any)}
                                    >
                                        <SelectTrigger className="input-focus">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USER">User</SelectItem>
                                            <SelectItem value="MANAGER">Manager</SelectItem>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Grade</Label>
                                    <Select
                                        value={watch('grade')}
                                        onValueChange={(value) => setValue('grade', value as any)}
                                    >
                                        <SelectTrigger className="input-focus">
                                            <SelectValue placeholder="Select grade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NA">N/A</SelectItem>
                                            <SelectItem value="GRADE1">Grade 1</SelectItem>
                                            <SelectItem value="GRADE2">Grade 2</SelectItem>
                                            <SelectItem value="GRADE3">Grade 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                    className="input-focus"
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    className="input-focus"
                                    {...register('confirmPassword')}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full btn-gradient" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Create Account
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Register