'use client';

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "~/lib/authStore";
import { useTheme } from "~/lib/theme";
import { getResumeById } from "~/lib/storage";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import type { Feedback, Resume as ResumeType } from "../../../types";
import Navbar from "~/components/Navbar";

const ResumeDetail = () => {
    const { isAuthenticated, isLoading } = useAuthStore();
    const params = useParams();
    const id = params.id as string;
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const router = useRouter();
    const { theme } = useTheme();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(`/auth?next=/resume/${id}`);
        }
    }, [isLoading, isAuthenticated, id, router]);

    useEffect(() => {
        if (!id) return;
        const resume: ResumeType | null = getResumeById(id);
        if (resume) {
            setFeedback(resume.feedback);
            setImageUrl(resume.imagePath || '/images/resume_01.png');
            setResumeUrl(resume.resumePath || '#');
        }
    }, [id]);

    return (
        <main className={`pt-0 bg-cover min-h-screen ${theme === 'dark' ? 'dark-bg' : 'light-bg'}`}>
            <Navbar />
            <nav className="resume-nav">
                <Link href="/" className="back-button">
                    <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
                    <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} text-sm font-semibold`}>
                        Back to Homepage
                    </span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className={`feedback-section ${theme === 'dark' ? 'bg-[url("/images/bg_dark.svg")]' : 'bg-[url("/images/bg-small.svg")]'} bg-cover h-screen sticky top-0 items-center justify-center`}>
                    {imageUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    alt="Resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className={`text-4xl ${theme === 'dark' ? 'text-white' : 'text-black'} font-bold mb-4`}>
                        Resume Review
                    </h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" alt="Loading" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    );
};

export default ResumeDetail;
