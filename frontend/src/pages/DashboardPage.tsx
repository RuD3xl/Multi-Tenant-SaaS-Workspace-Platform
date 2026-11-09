import { useEffect, useState } from 'react';
import { userService } from '../services/user.service';
import type { UserResponse } from '../types/user.types';

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserResponse | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userService.getProfile();
                setUser(data);
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-900">SBP Platform</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-700">
                            {isLoading ? 'Loading...' : user?.fullName}
                        </span>
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                            {isLoading ? '?' : user?.fullName?.charAt(0)}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Dashboard
                </h2>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                    <p className="text-slate-600 mb-2">
                        Welcome to the secure zone, <strong>{user?.fullName}</strong>!
                    </p>
                    <p className="text-sm text-slate-500">
                        Placeholder: Your subscription and billing data will appear here soon.
                    </p>
                </div>
            </main>

        </div>
    );
}