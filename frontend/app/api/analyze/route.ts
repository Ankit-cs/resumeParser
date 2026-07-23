import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { companyName, jobTitle, jobDescription, resumeText } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze this resume for position "${jobTitle}" at "${companyName}".
Job Description: ${jobDescription}
Resume Text: ${resumeText || 'Standard resume provided'}

Respond strictly with a JSON object matching this structure:
{
  "overallScore": 82,
  "ATS": {
    "score": 85,
    "tips": [
      { "type": "good", "tip": "Keywords match job description" },
      { "type": "improve", "tip": "Add quantifiable metrics to bullet points" }
    ]
  },
  "toneAndStyle": {
    "score": 80,
    "tips": [
      { "type": "good", "tip": "Professional action verbs", "explanation": "Strong verbs like Developed, Scaled, and Orchestrated." },
      { "type": "improve", "tip": "Avoid passive voice", "explanation": "Rephrase responsibilities to emphasize active ownership." }
    ]
  },
  "content": {
    "score": 85,
    "tips": [
      { "type": "good", "tip": "Relevant project highlights", "explanation": "Projects directly showcase required tech stack." }
    ]
  },
  "structure": {
    "score": 88,
    "tips": [
      { "type": "good", "tip": "Clean section headers", "explanation": "Standard headers facilitate ATS parsing." }
    ]
  },
  "skills": {
    "score": 84,
    "tips": [
      { "type": "good", "tip": "Core technical skills listed", "explanation": "Matches 80% of desired technical requirements." }
    ]
  }
}`,
                  },
                ],
              },
            ],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) {
          return NextResponse.json(JSON.parse(content));
        }
      }
    }

    // Fallback AI analysis response if no Gemini key or fetch fails
    const mockFeedback = {
      overallScore: Math.floor(Math.random() * 25) + 70,
      ATS: {
        score: 85,
        tips: [
          { type: 'good', tip: `Keywords match ${jobTitle || 'target'} role` },
          { type: 'improve', tip: 'Include more quantifiable metrics and impact percentages' },
          { type: 'improve', tip: 'Use standard bullet points for work experience' },
        ],
      },
      toneAndStyle: {
        score: 82,
        tips: [
          { type: 'good', tip: 'Strong active verb usage', explanation: 'Good use of action verbs at the start of bullet points.' },
          { type: 'improve', tip: 'Remove first-person pronouns', explanation: 'Keep tone objective without using "I" or "my".' },
        ],
      },
      content: {
        score: 80,
        tips: [
          { type: 'good', tip: 'Relevant work history', explanation: 'Clear progression of roles aligned with target position.' },
          { type: 'improve', tip: 'Tailor skills to job requirements', explanation: `Explicitly mention keywords from ${companyName || 'company'} description.` },
        ],
      },
      structure: {
        score: 88,
        tips: [
          { type: 'good', tip: 'Clean layout structure', explanation: 'Hierarchy and typography are easily readable by parser.' },
          { type: 'improve', tip: 'Keep formatting consistent', explanation: 'Ensure date formats match across all sections.' },
        ],
      },
      skills: {
        score: 86,
        tips: [
          { type: 'good', tip: 'Core technical stack highlighted', explanation: 'Primary skills are prominently displayed.' },
          { type: 'improve', tip: 'Group skills by category', explanation: 'Divide into Languages, Frameworks, and Tools.' },
        ],
      },
    };

    return NextResponse.json(mockFeedback);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
