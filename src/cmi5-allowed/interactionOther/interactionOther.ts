import { LanguageMap, ObjectiveActivity } from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5, { Period } from "Cmi5";

export function interactionOther(
  this: Cmi5,
  testId: string,
  questionId: string,
  answer: string,
  correctAnswer: string,
  name?: LanguageMap,
  description?: LanguageMap,
  success?: boolean,
  duration?: Period,
  objective?: ObjectiveActivity
): AxiosPromise<string[]> {
  return this.interaction(
    testId,
    questionId,
    answer,
    {
      type: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "other",
      ...(correctAnswer
        ? {
            correctResponsesPattern: [correctAnswer],
          }
        : {}),
      ...(name ? { name } : {}),
      ...(description ? { description } : {}),
    },
    success,
    duration,
    objective
  );
}
