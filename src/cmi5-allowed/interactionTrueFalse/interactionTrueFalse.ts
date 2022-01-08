import { LanguageMap, ObjectiveActivity } from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5, { Period } from "../../Cmi5";

export function interactionTrueFalse(
  this: Cmi5,
  testId: string,
  questionId: string,
  answer: boolean,
  correctAnswer?: boolean,
  name?: LanguageMap,
  description?: LanguageMap,
  success?: boolean,
  duration?: Period,
  objective?: ObjectiveActivity
): AxiosPromise<string[]> {
  return this.interaction(
    testId,
    questionId,
    answer.toString(),
    {
      type: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "true-false",
      ...(correctAnswer !== undefined
        ? {
            correctResponsesPattern: correctAnswer ? ["true"] : ["false"],
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
