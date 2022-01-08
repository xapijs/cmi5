import { LanguageMap, ObjectiveActivity } from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5, {
  NumericCriteria,
  NumericExact,
  NumericRange,
  Period,
} from "Cmi5";

export function interactionNumeric(
  this: Cmi5,
  testId: string,
  questionId: string,
  answer: number,
  correctAnswer: NumericCriteria,
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
      interactionType: "numeric",
      ...(correctAnswer
        ? {
            correctResponsesPattern: [
              `${
                (correctAnswer as NumericExact).exact
                  ? (correctAnswer as NumericExact).exact
                  : (correctAnswer as NumericRange).min +
                    ":" +
                    (correctAnswer as NumericRange).max
              }`,
            ],
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
