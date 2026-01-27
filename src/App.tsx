import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from './components/ui/tooltip'
import { Toaster } from './components/ui/sonner'
import { BrowserRouter, Navigate, replace, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Dashboard from './pages/Dashboard'
import { ProtectedRoute } from './components/ProtectedRoute'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			retry: 1,
		},
	},
})

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<BrowserRouter>
				<AuthProvider>
					<Routes>
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />

						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>

						<Route
							path='/profile'
							element={
								<ProtectedRoute>
									<Profile />
								</ProtectedRoute>
							}
						/>

						<Route path='/' element={<Navigate to="/dashboard" replace />} />

						<Route path='/' element={<NotFound />} />
					</Routes>
				</AuthProvider>
			</BrowserRouter>
		</TooltipProvider>
	</QueryClientProvider>
)

export default App
