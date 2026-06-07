import { APPS_SCRIPT_URL } from "@/config";
import type { Artifact } from "@/data/artifacts";

const PROGRESS_KEY = "nightshade:progress:v1";
const CUSTOM_ARTIFACTS_KEY = "nightshade:custom-artifacts:v1";

export type Progress = {
  solvedFragments: string[];
  unlockedArtifacts: string[];
  log: { time: string; answer: string; correct: boolean; fragmentId?: string }[];
};

/**
 * A new artifact defined entirely by the sheet/Apps Script response.
 * Lets you add brand-new puzzles with no code change.
 */
export type CustomArtifact = {
  id: string;
  title: string;
  caption: string;
  lore: string;
  image: string; // public URL (e.g. hosted on Google Drive, Imgur, or your own CDN)
  detailImage?: string;
};

export type SubmitResponse = {
  success: boolean;
  message: string;
  fragmentId?: string;
  unlocks?: string[];
  /** Optional: a full artifact definition to inject into the carousel. */
  newArtifact?: CustomArtifact;
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
    /* ignore */
  }
}

export function loadCustomArtifacts(): Artifact[] {
  try {
    const raw = localStorage.getItem(CUSTOM_ARTIFACTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CustomArtifact[];
    return parsed.map((c) => ({
      id: c.id,
      title: c.title,
      image: c.image,
      detailImage: c.detailImage || c.image,
      caption: c.caption,
      lore: c.lore,
    }));
  } catch {
    return [];
  }
}

function saveCustomArtifact(a: CustomArtifact) {
  try {
    const raw = localStorage.getItem(CUSTOM_ARTIFACTS_KEY);
    const list: CustomArtifact[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((x) => x.id !== a.id);
    filtered.push(a);
    localStorage.setItem(CUSTOM_ARTIFACTS_KEY, JSON.stringify(filtered));
  } catch {
    /* ignore */
  }
}

function mergeUnique(a: string[], b: string[]) {
  return Array.from(new Set([...a, ...b]));
}

export async function submitAnswer(input: {
  name: string;
  answer: string;
}): Promise<SubmitResponse> {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      name: input.name.trim().slice(0, 60),
      answer: input.answer.trim().slice(0, 300),
    }),
  });

  if (!res.ok) throw new Error(`Server responded ${res.status}`);

  const data = (await res.json()) as SubmitResponse;

  if (data.success) {
    if (data.newArtifact?.id) saveCustomArtifact(data.newArtifact);

    const prev = loadProgress();
    const extraUnlock = data.newArtifact?.id ? [data.newArtifact.id] : [];
    saveProgress({
      solvedFragments: data.fragmentId
        ? mergeUnique(prev.solvedFragments, [data.fragmentId])
        : prev.solvedFragments,
      unlockedArtifacts: mergeUnique(
        prev.unlockedArtifacts,
        [...(data.unlocks ?? []), ...extraUnlock],
      ),
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
