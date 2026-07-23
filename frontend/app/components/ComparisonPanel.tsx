"use client";
import { useState } from "react";
import type { Resume } from "../../types";

export default function ComparisonPanel({ resumes }: { resumes: Resume[] }) {
  const [leftId, setLeftId] = useState(resumes[0]?.id || ""); const [rightId, setRightId] = useState(resumes[1]?.id || "");
  if (resumes.length < 2) return null;
  const left = resumes.find((r) => r.id === leftId), right = resumes.find((r) => r.id === rightId);
  const label = (resume?: Resume) => `${resume?.jobTitle || "Resume"} · ${resume?.companyName || "Untitled"}`;
  const delta = (a: number, b: number) => <span className={b - a >= 0 ? "text-green-600" : "text-red-600"}>{b - a >= 0 ? "+" : ""}{b - a}</span>;
  return <section className="w-full max-w-5xl rounded-2xl bg-white dark:bg-gray-800 shadow-md p-6"><h2 className="font-bold dark:text-white">Compare analyses</h2><div className="grid sm:grid-cols-2 gap-3 mt-4"><select value={leftId} onChange={(e) => setLeftId(e.target.value)} className="rounded-lg border p-3">{resumes.map((r) => <option key={r.id} value={r.id}>{label(r)}</option>)}</select><select value={rightId} onChange={(e) => setRightId(e.target.value)} className="rounded-lg border p-3">{resumes.map((r) => <option key={r.id} value={r.id}>{label(r)}</option>)}</select></div>{left && right && <div className="grid sm:grid-cols-3 gap-4 mt-5 text-center"><div><p className="text-sm text-gray-500">Overall score</p><b className="text-xl dark:text-white">{left.feedback.overallScore} → {right.feedback.overallScore}</b><p>{delta(left.feedback.overallScore, right.feedback.overallScore)}</p></div><div><p className="text-sm text-gray-500">Job match</p><b className="text-xl dark:text-white">{left.feedback.hiringEvaluation?.jobMatch.score ?? "—"} → {right.feedback.hiringEvaluation?.jobMatch.score ?? "—"}</b></div><div><p className="text-sm text-gray-500">Missing keywords</p><b className="text-xl dark:text-white">{left.feedback.hiringEvaluation?.jobMatch.missingKeywords.length ?? 0} → {right.feedback.hiringEvaluation?.jobMatch.missingKeywords.length ?? 0}</b></div></div>}</section>;
}
