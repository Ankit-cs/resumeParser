import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import { resumes as sampleResumes } from "../../constants";
import { useTheme } from "~/lib/theme";
import type { Resume } from "../../types";
import type { KVItem } from "../../types/puter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Parsify" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      try {
        const uploadedResumes = (await kv.list('resume:*', true)) as KVItem[];

        const parsedResumes = uploadedResumes?.map((resume) => (
            JSON.parse(resume.value) as Resume
        ))

        // If no uploaded resumes, show sample resumes
        setResumes(parsedResumes && parsedResumes.length > 0 ? parsedResumes : sampleResumes);
      } catch (error) {
        console.error('Error loading resumes:', error);
        // Fallback to sample resumes on error
        setResumes(sampleResumes);
      } finally {
        setLoadingResumes(false);
      }
    }

    loadResumes()
  }, []);

  return <main className={`bg-cover ${theme === 'dark' ? 'dark-bg' : ''}`}>
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Know Your Worth. Track Your Progress. Get Hired.</h1>
        {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
        ): (
          <h2>Real-time resume ratings and application tracking - Stay ahead, Always.</h2>
        )}
      </div>
      {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
      )}

      {!loadingResumes && resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}

      {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
      )}
    </section>
  </main>
}