import { LanguageMap, ObjectiveActivity } from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5, { Period } from "Cmi5";

export function interactionLongFillIn(
  this: Cmi5,
  testId: string,
  questionId: string,
  answers: string[],
  correctAnswers?: string[],
  name?: LanguageMap,
  description?: LanguageMap,
  success?: boolean,
  duration?: Period,
  objective?: ObjectiveActivity
): AxiosPromise<string[]> {
  return this.interaction(
    testId,
    questionId,
    answers.join("[,]"),
    {
      type: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "long-fill-in",
      ...(correctAnswers
        ? {
            correctResponsesPattern: [correctAnswers.join("[,]")],
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
