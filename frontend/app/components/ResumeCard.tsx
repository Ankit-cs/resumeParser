'use client';

import Link from "next/link";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import type { Resume } from "../../types";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        if (!imagePath) return;
        const isPublicAsset =
            imagePath.startsWith('/images/') ||
            imagePath.startsWith('/assets/') ||
            imagePath.startsWith('/public/') ||
            imagePath.startsWith('data:') ||
            imagePath.startsWith('http');

        if (isPublicAsset) {
            setResumeUrl(imagePath);
        } else {
            setResumeUrl(imagePath.startsWith('/') ? imagePath : '/' + imagePath);
        }
    }, [imagePath]);

    return (
        <Link href={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    {companyName && <h2 className="text-black font-bold wrap-break-word">{companyName}</h2>}
                    {jobTitle && <h3 className="text-lg wrap-break-word text-gray-500">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="text-black font-bold">Resume</h2>}
                </div>
                <div className="shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            {resumeUrl ? (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full">
                        <img
                            src={resumeUrl}
                            alt="Resume"
                            className="w-full h-[350px] max-sm:h-[200px] object-contain"
                            onError={() => setResumeUrl('')}
                        />
                    </div>
                </div>
            ) : (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <div className="text-gray-500 dark:text-gray-400 text-center">
                            <div className="text-2xl mb-2">📄</div>
                            <div>Resume Preview</div>
                        </div>
                    </div>
                </div>
            )}
        </Link>
    )
}
export default ResumeCard;
