'use client';

import { type FormEvent, useState, useEffect } from 'react';
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { useAuthStore } from "~/lib/authStore";
import { useRouter } from "next/navigation";
import { convertPdfToImage, extractTextFromPdf } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { saveResume } from "~/lib/storage";
import { useTheme } from "~/lib/theme";
import type { Resume } from "../../types";

const Upload = () => {
    const { isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [githubUrl, setGithubUrl] = useState('');
    const [roleTemplate, setRoleTemplate] = useState('general');
    const { theme } = useTheme();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth?next=/upload');
        }
    }, [isLoading, isAuthenticated, router]);

    const handleFileSelect = (selectedFile: File | null) => {
        setFile(selectedFile);
    };

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string; jobTitle: string; jobDescription: string; file: File }) => {
        setIsProcessing(true);

        try {
            setStatusText('Converting PDF preview...');
            let imagePath = '/images/resume_01.png';
            try {
                const imageResult = await convertPdfToImage(file);
                if (imageResult?.imageUrl) {
                    imagePath = imageResult.imageUrl;
                }
            } catch (e) {
                console.warn('Could not convert PDF to image, using default preview:', e);
            }

            setStatusText('Extracting resume text...');
            const { text: resumeText, pageCount } = await extractTextFromPdf(file);
            setStatusText('Evaluating evidence, job match, and optional GitHub projects...');
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyName,
                    jobTitle,
                    jobDescription,
                    resumeText,
                    pageCount,
                    githubUrl,
                    roleTemplate,
                }),
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const feedback = await response.json();
            if (feedback.error) throw new Error(feedback.error);
            const uuid = generateUUID();

            const newResume: Resume = {
                id: uuid,
                companyName,
                jobTitle,
                imagePath,
                resumePath: URL.createObjectURL(file),
                feedback,
            };

            saveResume(newResume);
            setStatusText('Analysis complete, redirecting...');
            router.push(`/resume/${uuid}`);
        } catch (error) {
            console.error('Error analyzing resume:', error);
            setStatusText('Error: Failed to analyze resume');
            setIsProcessing(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    };

    return (
        <main className={`bg-cover min-h-screen ${theme === 'dark' ? 'dark-bg' : 'light-bg'}`}>
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1 className="text-black dark:text-white">Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2 className="text-gray-700 dark:text-gray-300">{statusText}</h2>
                            <img src="/images/resume-scan.gif" alt="Scanning" className="w-full max-w-md mx-auto" />
                        </>
                    ) : (
                        <h2 className="text-gray-700 dark:text-gray-300">Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name" className="text-gray-700 dark:text-gray-300">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" required />
                            </div>
                            <div className="form-div">
                                <label htmlFor="role-template" className="text-gray-700 dark:text-gray-300">Role template</label>
                                <select id="role-template" value={roleTemplate} onChange={(e) => setRoleTemplate(e.target.value)} className="w-full rounded-2xl p-4 dark:bg-gray-700 dark:text-white">
                                    <option value="general">General software role</option><option value="frontend">Frontend developer</option><option value="backend">Backend developer</option><option value="data">Data / ML role</option>
                                </select>
                            </div>
                            <div className="form-div">
                                <label htmlFor="github-url" className="text-gray-700 dark:text-gray-300">GitHub profile URL (optional)</label>
                                <input id="github-url" type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/username" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title" className="text-gray-700 dark:text-gray-300">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" required />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description" className="text-gray-700 dark:text-gray-300">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" required />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader" className="text-gray-700 dark:text-gray-300">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button cursor-pointer" type="submit" disabled={!file}>
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Upload;
