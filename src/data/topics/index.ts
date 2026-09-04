import { Topic, DifficultyFilter } from "../../types";
import { engineeringTopics } from "./engineering";
import { businessTopics } from "./business";
import { scienceTopics } from "./science";
import { healthAndHumanitiesTopics } from "./healthAndHumanities";
import { decisionMakingTopics } from "./decisionMaking";
import { interviewTopics } from "./interview";

export const allTopics: Topic[] = [
  ...engineeringTopics,
  ...businessTopics,
  ...scienceTopics,
  ...healthAndHumanitiesTopics,
  ...decisionMakingTopics,
  ...interviewTopics,
];

export function getTopicsByCategory(categoryName: string): Topic[] {
  return allTopics.filter(
    (t) => t.category.toLowerCase() === categoryName.toLowerCase()
  );
}

export function getTopicsBySubcategory(
  categoryName: string,
  subcategoryName: string
): Topic[] {
  return allTopics.filter(
    (t) =>
      t.category.toLowerCase() === categoryName.toLowerCase() &&
      t.subcategory.toLowerCase() === subcategoryName.toLowerCase()
  );
}

export function filterTopics(
  topics: Topic[],
  difficulty: DifficultyFilter
): Topic[] {
  if (difficulty === "All") return topics;
  return topics.filter((t) => t.difficulty === difficulty);
}
