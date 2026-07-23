'use client';

import { useAuthStore } from "~/lib/authStore";
import { clearStoredResumes } from "~/lib/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const WipeApp = () => {
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();
    const [wiped, setWiped] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/auth?next=/wipe");
        }
    }, [isLoading, isAuthenticated, router]);

    const handleDelete = () => {
        clearStoredResumes();
        setWiped(true);
    };

    if (isLoading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="p-8 flex flex-col gap-4 text-white">
            <div>Authenticated as: {user?.username || 'Demo User'}</div>
            <div>Wipe Application Data</div>
            {wiped ? (
                <div className="text-green-400 font-bold">App data wiped successfully!</div>
            ) : (
                <div>
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md cursor-pointer"
                        onClick={handleDelete}
                    >
                        Wipe Stored Resumes Data
                    </button>
                </div>
            )}
        </div>
    );
};

export default WipeApp;
