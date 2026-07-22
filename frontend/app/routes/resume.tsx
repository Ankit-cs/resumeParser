import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import {useTheme} from "~/lib/theme";
import Summary from "../components/Summary";
import ATS from "../components/ATS";
import Details from "../components/Details";
import type { Feedback } from "../../types";
import Navbar from "~/components/Navbar";

export const meta = () => ([
    { title: 'Parsify | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            console.log('Loading resume with id:', id);
            if (!id) {
                console.error('No resume id provided');
                return;
            }

            try {
                const resume = await kv.get(`resume:${id}`);
                console.log('Resume data from kv:', resume);

                if(!resume) {
                    console.error('No resume data found for id:', id);
                    return;
                }

                const data = JSON.parse(resume);
                console.log('Parsed resume data:', data);

                if (data.resumePath) {
                    const resumePath = data.resumePath.startsWith('/') ? data.resumePath : '/' + data.resumePath;
                    const resumeBlob = await fs.read(resumePath);
                    if(resumeBlob) {
                        const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                        const resumeUrl = URL.createObjectURL(pdfBlob);
                        setResumeUrl(resumeUrl);
                        console.log('Resume URL created:', resumeUrl);
                    } else {
                        console.error('Failed to read resume blob from path:', resumePath);
                    }
                }

                if (data.imagePath) {
                    const imagePath = data.imagePath.startsWith('/') ? data.imagePath : '/' + data.imagePath;
                    const imageBlob = await fs.read(imagePath);
                    if(imageBlob) {
                        const imageUrl = URL.createObjectURL(imageBlob);
                        setImageUrl(imageUrl);
                        console.log('Image URL created:', imageUrl);
                    } else {
                        console.error('Failed to read image blob from path:', imagePath);
                    }
                }

                if (data.feedback) {
                    setFeedback(data.feedback);
                    console.log('Feedback set:', data.feedback);
                } else {
                    console.error('No feedback data in resume');
                }
            } catch (error) {
                console.error('Error loading resume:', error);
            }
        }

        if (id) {
            loadResume();
        }
    }, [id]);

    return (
        <main className={`pt-0 bg-cover ${theme === 'dark' ? 'dark-bg' : 'light-bg'}`}>
            <Navbar/>
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} text-sm font-semibold`}>Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className={`feedback-section ${theme === 'dark' ? 'bg-[url("/images/bg_dark.svg")]' : 'bg-[url("/images/bg-small.svg")]'} bg-cover h-screen sticky top-0 items-center justify-center`}>
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="Resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className={`text-4xl ${theme === 'dark' ? 'text-white' : 'text-black'} font-bold mb-4`}>Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume
