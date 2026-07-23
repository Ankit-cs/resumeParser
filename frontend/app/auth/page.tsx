'use client';

import { useAuthStore } from "~/lib/authStore";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "~/lib/theme";

const Auth = () => {
    const { isLoading, isAuthenticated, signIn, signOut } = useAuthStore();
    const searchParams = useSearchParams();
    const next = searchParams.get('next') || '/';
    const router = useRouter();
    const { theme } = useTheme();

    useEffect(() => {
        if (isAuthenticated) {
            router.push(next);
        }
    }, [isAuthenticated, next, router]);

    return (
        <main className={`bg-cover min-h-screen flex items-center justify-center ${theme === 'dark' ? 'dark-bg' : ''}`}>
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white dark:bg-gray-800 rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-black dark:text-white text-3xl font-bold">Welcome</h1>
                        <h2 className="text-gray-700 dark:text-gray-300">One Step Closer To GET HIRED.</h2>
                    </div>
                    <div>
                        {isLoading ? (
                            <button className="auth-button animate-pulse">
                                <p>Signing you in...</p>
                            </button>
                        ) : (
                            <>
                                {isAuthenticated ? (
                                    <button className="auth-button cursor-pointer" onClick={signOut}>
                                        <p>Sign Out</p>
                                    </button>
                                ) : (
                                    <button className="auth-button cursor-pointer" onClick={signIn}>
                                        <p>Sign In</p>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Auth;
