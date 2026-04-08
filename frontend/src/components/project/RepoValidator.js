/**
 * Parse and validate a pasted GitHub repo URL against the expected repo name.
 */

export function parseGithubRepoUrl(raw) {
  const t = (raw || "").trim();
  if (!t) return { ok: false, reason: "empty" };
  const normalized = t.startsWith("http") ? t : `https://${t}`;
  try {
    const u = new URL(normalized);
    if (!/^([a-z0-9-]+\.)*github\.com$/i.test(u.hostname)) {
      return { ok: false, reason: "not-github" };
    }
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return { ok: false, reason: "short-path" };
    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/i, "");
    return { ok: true, owner, repo, httpsUrl: `https://github.com/${owner}/${repo}` };
  } catch {
    return { ok: false, reason: "bad-url" };
  }
}

export function repoSlugMatchesExpected(parsed, expectedRepoSlug) {
  if (!parsed?.ok) return false;
  return parsed.repo.toLowerCase() === (expectedRepoSlug || "").toLowerCase();
}
