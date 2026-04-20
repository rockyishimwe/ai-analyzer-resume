export const resumes: Resume[] = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "2",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume_02.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: {
      overallScore: 55,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "3",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
]

const compactText = (value: string, maxLength: number) =>
  value.replace(/\s+/g, " ").trim().slice(0, maxLength)

export const AIResponseFormat = `{
  "overallScore": 0,
  "ATS": { "score": 0, "tips": [{ "type": "good|improve", "tip": "short tip" }] },
  "toneAndStyle": { "score": 0, "tips": [{ "type": "good|improve", "tip": "short title", "explanation": "one concise sentence" }] },
  "content": { "score": 0, "tips": [{ "type": "good|improve", "tip": "short title", "explanation": "one concise sentence" }] },
  "structure": { "score": 0, "tips": [{ "type": "good|improve", "tip": "short title", "explanation": "one concise sentence" }] },
  "skills": { "score": 0, "tips": [{ "type": "good|improve", "tip": "short title", "explanation": "one concise sentence" }] }
}`

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
  AIResponseFormat,
}: {
  jobTitle: string
  jobDescription: string
  AIResponseFormat: string
}) => {
  const safeJobTitle = compactText(jobTitle, 80) || "Not provided"
  const safeJobDescription =
    compactText(jobDescription, 2200) || "Not provided"

  return [
    "You are an ATS resume reviewer.",
    "Score the resume against the target role.",
    "Return valid JSON only with integer scores from 0 to 100.",
    "Keep feedback concise and actionable.",
    "Return up to 2 ATS tips and up to 1 good plus 1 improve tip for each scored category.",
    "Each explanation must stay to one short sentence.",
    `Job title: ${safeJobTitle}.`,
    `Job description: ${safeJobDescription}.`,
    `JSON: ${AIResponseFormat}`,
  ].join("\n")
}
