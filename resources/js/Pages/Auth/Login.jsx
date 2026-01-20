import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });
    const [validations, setValidations] = useState({ email: false, password: false });

    // Email validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Password validation
    const validatePassword = (password) => {
        return password.length >= 6;
    };

    // Handle email change
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setData('email', value);
        setValidations(prev => ({
            ...prev,
            email: validateEmail(value)
        }));
    };

    // Handle password change
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setData('password', value);
        setValidations(prev => ({
            ...prev,
            password: validatePassword(value)
        }));
    };

    // Handle field blur (mark as touched)
    const handleBlur = (field) => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate before submit
        if (!validateEmail(data.email)) {
            setTouched(prev => ({ ...prev, email: true }));
            return;
        }

        if (!validatePassword(data.password)) {
            setTouched(prev => ({ ...prev, password: true }));
            return;
        }

        post('/login');
    };

    // Check if form is valid
    const isFormValid = validations.email && validations.password;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-50 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <span className="text-2xl">🌾</span>
                        </div>
                        <span className="text-xl font-bold">AgriConnect</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
                    <CardDescription className="text-green-50">
                        Enter your credentials to access your agricultural platform
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4" method="POST">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="email" className="text-gray-700 font-medium">
                                    Email Address
                                </Label>
                                {touched.email && validations.email && (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={data.email}
                                    onChange={handleEmailChange}
                                    onBlur={() => handleBlur('email')}
                                    autoComplete="email"
                                    required
                                    className={`transition-all ${
                                        touched.email
                                            ? validations.email
                                                ? 'border-green-500 focus:ring-green-200'
                                                : 'border-red-500 focus:ring-red-200'
                                            : 'border-gray-300'
                                    }`}
                                />
                            </div>
                            {touched.email && !validations.email && data.email && (
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Please enter a valid email address</span>
                                </div>
                            )}
                            {errors.email && (
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{errors.email}</span>
                                </div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-gray-700 font-medium">
                                    Password
                                </Label>
                                {touched.password && validations.password && (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={data.password}
                                    onChange={handlePasswordChange}
                                    onBlur={() => handleBlur('password')}
                                    autoComplete="current-password"
                                    required
                                    className={`pr-10 transition-all ${
                                        touched.password
                                            ? validations.password
                                                ? 'border-green-500 focus:ring-green-200'
                                                : 'border-red-500 focus:ring-red-200'
                                            : 'border-gray-300'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {touched.password && !validations.password && data.password && (
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Password must be at least 6 characters</span>
                                </div>
                            )}
                            {errors.password && (
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{errors.password}</span>
                                </div>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center space-x-2">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                            />
                            <Label htmlFor="remember" className="text-sm font-normal text-gray-700 cursor-pointer">
                                Remember me for 30 days
                            </Label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={processing || !isFormValid}
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </Button>

                        {/* Backend Errors */}
                        {Object.keys(errors).length > 0 && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm font-medium text-red-800">Login failed</p>
                                <p className="text-sm text-red-600 mt-1">
                                    Please check your email and password and try again.
                                </p>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
