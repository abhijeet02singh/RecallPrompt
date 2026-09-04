import { Topic } from "../types";
import { getRecentTopics } from "./storage";

export function getRandomTopic(pool: Topic[]): Topic | null {
  if (!pool || pool.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

export function getRandomTopicExcludingRecent(pool: Topic[]): Topic | null {
  if (!pool || pool.length === 0) return null;

  const recent = getRecentTopics();
  // Filter candidates whose title is not in recent
  const nonRecentCandidates = pool.filter((t) => !recent.includes(t.title));

  if (nonRecentCandidates.length > 0) {
    return getRandomTopic(nonRecentCandidates);
  }

  // If all topics have been visited recently, pick from the full pool
  return getRandomTopic(pool);
}
