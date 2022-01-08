import {
  InteractionComponent,
  LanguageMap,
  ObjectiveActivity,
} from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5, { Period } from "Cmi5";

export function interactionChoice(
  this: Cmi5,
  testId: string,
  questionId: string,
  answerIds: string[],
  correctAnswerIds?: string[],
  choices?: InteractionComponent[],
  name?: LanguageMap,
  description?: LanguageMap,
  success?: boolean,
  duration?: Period,
  objective?: ObjectiveActivity
): AxiosPromise<string[]> {
  return this.interaction(
    testId,
    questionId,
    answerIds.join("[,]"),
    {
      type: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "choice",
      ...(correctAnswerIds
        ? {
            correctResponsesPattern: [correctAnswerIds.join("[,]")],
          }
        : {}),
      ...(choices ? { choices } : {}),
      ...(name ? { name } : {}),
      ...(description ? { description } : {}),
    },
    success,
    duration,
    objective
  );
}
