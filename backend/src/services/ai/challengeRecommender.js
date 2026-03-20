export function computeStruggleScore(recentSubmissions) {
  const recent = recentSubmissions.slice(-10);
  if (!recent.length) return 0;
  const failRate   = recent.filter(s => !s.passed).length / recent.length;
  const last3      = recent.slice(-3);
  const recentFail = last3.filter(s => !s.passed).length / Math.max(last3.length, 1);
  return +((failRate * 0.4) + (recentFail * 0.6)).toFixed(3);
}

export function recommendNextChallenge(studentState, allChallenges) {
  const { primaryCareerId, completedChallengeIds, earnedSkills, struggleScore, careerProfiles } = studentState;
  const career        = careerProfiles.find(c => c.id === primaryCareerId);
  const targetTags    = career?.challenge_tags || [];
  const missingSkills = career?.required_skills?.filter(s => !earnedSkills.includes(s)) || [];
  const targetDiff    = struggleScore >= 0.6 ? "easy" : struggleScore >= 0.3 ? "medium" : "hard";
  const diffMap       = { easy: 0, medium: 1, hard: 2 };

  const candidates = allChallenges
    .filter(c => !completedChallengeIds.includes(c.id))
    .map(c => {
      let score = 0;
      score += (c.career_tags?.filter(t => targetTags.includes(t)).length || 0) * 3;
      score += (c.skill_tags?.filter(s => missingSkills.includes(s)).length  || 0) * 2;
      if (c.difficulty === targetDiff) score += 2;
      score -= Math.abs((diffMap[c.difficulty] || 1) - (diffMap[targetDiff] || 1));
      return { ...c, recommendScore: score };
    })
    .filter(c => c.recommendScore > 0)
    .sort((a, b) => b.recommendScore - a.recommendScore);

  return {
    recommended:  candidates[0] || null,
    alternatives: candidates.slice(1, 4),
    reasoning:    candidates[0]
      ? `This ${targetDiff} challenge builds ${missingSkills[0] || "core skills"} for your career path.`
      : "Complete more challenges to unlock personalized recommendations!",
  };
}
