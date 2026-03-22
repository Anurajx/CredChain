/**
 * Compute a confidence score (0-10) for a citizen record based on:
 * - Number of linked credentials (more => higher confidence)
 * - Presence of a creation event
 * - Volume of profile updates (more frequent updates can reduce confidence slightly)
 *
 * Returns an object: { score: number, breakdown: { ... } }
 */
function computeConfidenceScore({ voter, auditTrail }) {
  const linkedCount = Array.isArray(voter?.LinkedCredentials)
    ? voter.LinkedCredentials.length
    : 0;

  const creationCount = (auditTrail || []).filter((e) => e.TYPE === "CREATION")
    .length;
  const updateEvents = (auditTrail || []).filter(
    (e) => e.TYPE === "UPDATION" && e.CREDENTIAL_TYPE === "PROFILE",
  );
  const updateCount = updateEvents.length;

  // Heuristic:
  // Base: 5
  // + up to +4 for linked credentials (1 per credential, capped at 4)
  // +1 if creation event exists
  // - up to -2 for many updates (0.2 per update, capped at 10 updates)
  let score =
    5 +
    Math.min(linkedCount, 4) * 1 +
    (creationCount > 0 ? 1 : 0) -
    Math.min(updateCount, 10) * 0.2;

  score = Math.max(0, Math.min(10, Number(score.toFixed(2))));

  return {
    score,
    breakdown: {
      base: 5,
      linkedCredentials: linkedCount,
      creationEvents: creationCount,
      profileUpdates: updateCount,
      note:
        "Higher linked credentials increase confidence; frequent profile updates slightly reduce it.",
    },
  };
}

module.exports = { computeConfidenceScore };

