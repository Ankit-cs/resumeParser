'use client';

import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { useAuthStore } from "~/lib/authStore";
import { getStoredResumes } from "~/lib/storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "~/lib/theme";
import type { Resume } from "../types";
import ComparisonPanel from "~/components/ComparisonPanel";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth?next=/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const loadResumes = () => {
      setLoadingResumes(true);
      try {
        const stored = getStoredResumes();
        setResumes(stored);
      } catch (error) {
        console.error('Error loading resumes:', error);
      } finally {
        setLoadingResumes(false);
      }
    };

    loadResumes();
  }, []);

  return (
    <main className={`bg-cover min-h-screen ${theme === 'dark' ? 'dark-bg' : ''}`}>
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Know Your Worth. Track Your Progress. Get Hired.</h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Real-time resume ratings and application tracking - Stay ahead, Always.</h2>
          )}
        </div>

        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" alt="Scanning" className="w-[200px]" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <>
          <ComparisonPanel resumes={resumes} />
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
          </>
        )}

        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link href="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
