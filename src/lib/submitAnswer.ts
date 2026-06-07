import { APPS_SCRIPT_URL } from "@/config";

const PROGRESS_KEY = "nightshade:progress:v1";

export type Progress = {
  solvedFragments: string[]; // fragment IDs the user got correct
  unlockedArtifacts: string[]; // artifact IDs newly revealed in the carousel
  log: { time: string; answer: string; correct: boolean; fragmentId?: string }[];
};

export type SubmitResponse = {
  success: boolean;
  message: string;
  fragmentId?: string;
  unlocks?: string[]; // artifact IDs to reveal in the carousel
};

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { solvedFragments: [], unlockedArtifacts: [], log: [] };
    return { solvedFragments: [], unlockedArtifacts: [], log: [], ...JSON.parse(raw) };
  } catch {
    return { solvedFragments: [], unlockedArtifacts: [], log: [] };
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch {
    // ignore quota / private mode errors
  }
}

function mergeUnique(a: string[], b: string[]) {
  return Array.from(new Set([...a, ...b]));
}

export async function submitAnswer(input: {
  name: string;
  answer: string;
}): Promise<SubmitResponse> {
  // Use text/plain to avoid a CORS preflight against Apps Script.
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      name: input.name.trim().slice(0, 60),
      answer: input.answer.trim().slice(0, 300),
    }),
  });

  if (!res.ok) {
    throw new Error(`Server responded ${res.status}`);
  }

  const data = (await res.json()) as SubmitResponse;

  if (data.success) {
    const prev = loadProgress();
    saveProgress({
      solvedFragments: data.fragmentId
        ? mergeUnique(prev.solvedFragments, [data.fragmentId])
        : prev.solvedFragments,
      unlockedArtifacts: data.unlocks
        ? mergeUnique(prev.unlockedArtifacts, data.unlocks)
        : prev.unlockedArtifacts,
      log: [
        ...prev.log,
        {
          time: new Date().toISOString(),
          answer: input.answer,
          correct: true,
          fragmentId: data.fragmentId,
        },
      ].slice(-50),
    });
  } else {
    const prev = loadProgress();
    saveProgress({
      ...prev,
      log: [
        ...prev.log,
        { time: new Date().toISOString(), answer: input.answer, correct: false },
      ].slice(-50),
    });
  }

  return data;
}
