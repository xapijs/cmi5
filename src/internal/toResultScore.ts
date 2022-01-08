import { ResultScore } from "@xapi/xapi";

export function toResultScore(
  score?: ResultScore | number
): ResultScore | undefined {
  return !isNaN(Number(score))
    ? {
        scaled: Number(score),
      }
    : (score as ResultScore);
}
