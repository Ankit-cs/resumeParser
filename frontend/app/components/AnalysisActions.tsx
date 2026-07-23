"use client";

import { useState } from "react";
import { deleteResume, updateResume } from "~/lib/storage";
import type { Resume } from "../../types";

export default function AnalysisActions({ resume, onDeleted }: { resume: Resume; onDeleted: () => void }) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(JSON.stringify(resume.feedback.hiringEvaluation?.parsedResume || {}, null, 2));
  const download = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a");
    link.href = url; link.download = `hiring-agent-report-${resume.id}.json`; link.click(); URL.revokeObjectURL(url);
  };
  const saveParsedResume = () => {
    try { const parsedResume = JSON.parse(content); updateResume({ ...resume, feedback: { ...resume.feedback, hiringEvaluation: { ...resume.feedback.hiringEvaluation!, parsedResume } } }); setEditing(false); }
    catch { alert("The parsed resume must be valid JSON."); }
  };
  return <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-md p-5 flex flex-col gap-4">
    <h2 className="text-xl font-bold dark:text-white">Report tools</h2>
    <div className="flex flex-wrap gap-3"><button className="primary-button" onClick={download}>Export JSON</button><button className="rounded-full border px-4 py-2 dark:text-white" onClick={() => window.print()}>Print / Save PDF</button><button className="rounded-full border px-4 py-2 dark:text-white" onClick={() => setEditing(!editing)}>Review parsed resume</button><button className="rounded-full border border-red-300 px-4 py-2 text-red-700" onClick={() => { if (confirm("Delete this stored analysis?")) { deleteResume(resume.id); onDeleted(); } }}>Delete analysis</button></div>
    {editing && <div><p className="mb-2 text-sm text-gray-500">Correct extraction errors, then save. Re-run analysis after meaningful changes.</p><textarea className="min-h-80 font-mono text-sm" value={content} onChange={(event) => setContent(event.target.value)} /><button className="primary-button mt-3" onClick={saveParsedResume}>Save corrections</button></div>}
  </section>;
}
