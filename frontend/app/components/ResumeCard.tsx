import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import type { Resume } from "../../types";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        const loadResume = async () => {
            console.log('Loading resume image for path:', imagePath);
            const isPublicAsset =
                imagePath.startsWith('/images/') ||
                imagePath.startsWith('/assets/') ||
                imagePath.startsWith('/public/');

            if (isPublicAsset) {
                // Public asset URL
                console.log('Using public asset URL:', imagePath);
                setResumeUrl(imagePath);
            } else {
                // Load from Puter FS
                const path = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
                console.log('Reading from Puter FS:', path);
                const blob = await fs.read(path);
                console.log('Blob received:', blob);
                if (!blob) {
                    console.log('No blob returned for path:', path);
                    return;
                }
                let url = URL.createObjectURL(blob);
                console.log('Created blob URL:', url);
                setResumeUrl(url);
            }
        }

        loadResume();
    }, [imagePath]);

    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
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
                            onError={(e) => {
                                console.log('Image failed to load:', resumeUrl);
                                setResumeUrl('');
                            }}
                            onLoad={() => console.log('Image loaded successfully:', resumeUrl)}
                        />
                    </div>
                </div>
            ) : (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <div className="text-gray-500 text-center">
                            <div className="text-2xl mb-2">📄</div>
                            <div>Resume Preview</div>
                            <div className="text-xs mt-1">Image: {imagePath}</div>
                        </div>
                    </div>
                </div>
            )}
        </Link>
    )
}
export default ResumeCard
