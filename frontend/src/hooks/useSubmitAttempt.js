// hooks/useSubmitAttempt.js — calls POST /api/compiler/submit with real test cases
import { useEffect, useState } from "react";
import api from "../services/api.js";
import { useProgressStore } from "../store/progressStore.js";

const LANG_MAP = { Python: "python", "C++": "cpp", Java: "java" };

/**
 * Returns { submit, submitting, result, error }
 *
 * result shape (from backend):
 *   { submissionId, passed, results: [{ input, expected, actual, passed, stderr }], tutor }
 * tutor shape (only present on failure with a sensor tag):
 *   { tag, title, hint }
 */
export function useSubmitAttempt(unitId, challengePos) {
  const [submitting, setSubmitting]   = useState(false);
  const [result,     setResult]       = useState(null);
  const [error,      setError]        = useState(null);

  const markChallengePassedLocal = useProgressStore((s) => s.markChallengePassedLocal);

  // Reset state whenever the challenge changes
  useEffect(() => {
    setResult(null);
    setError(null);
  }, [unitId, challengePos]);

  const submit = async (code, language) => {
    if (submitting || !code?.trim()) return;
    setSubmitting(true);
    setResult(null);
    setError(null);

    try {
      const { data } = await api.post("/compiler/submit", {
        code,
        language: LANG_MAP[language] || "python",
        unitCode: unitId.toUpperCase(),
        position: Number(challengePos),
      });
      setResult(data);
      if (data.passed) {
        markChallengePassedLocal(unitId, challengePos);
      }
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || "Submission failed. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return { submit, submitting, result, error };
}
