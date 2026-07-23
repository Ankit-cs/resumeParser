import type { Resume } from "../../types";
import { resumes as sampleResumes } from "../../constants";

const STORAGE_KEY = "parsify_resumes";

export const getStoredResumes = (): Resume[] => {
  if (typeof window === "undefined") return sampleResumes;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleResumes));
      return sampleResumes;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : sampleResumes;
  } catch (e) {
    console.error("Error reading stored resumes:", e);
    return sampleResumes;
  }
};

export const getResumeById = (id: string): Resume | null => {
  const resumes = getStoredResumes();
  return resumes.find((r) => r.id === id) || null;
};

export const saveResume = (resume: Resume): void => {
  if (typeof window === "undefined") return;
  try {
    const resumes = getStoredResumes();
    const existingIndex = resumes.findIndex((r) => r.id === resume.id);
    if (existingIndex >= 0) {
      resumes[existingIndex] = resume;
    } else {
      resumes.unshift(resume);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
  } catch (e) {
    console.error("Error saving resume:", e);
  }
};

export const clearStoredResumes = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Error clearing resumes:", e);
  }
};

export const deleteResume = (id: string): void => {
  if (typeof window === "undefined") return;
  const remaining = getStoredResumes().filter((resume) => resume.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
};

export const updateResume = (resume: Resume): void => saveResume(resume);
