import {
  InteractionComponent,
  LanguageMap,
  ObjectiveActivity,
} from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5, { Period } from "Cmi5";

export function interactionLikert(
  this: Cmi5,
  testId: string,
  questionId: string,
  answerId: string,
  correctAnswerId?: string,
  scale?: InteractionComponent[],
  name?: LanguageMap,
  description?: LanguageMap,
  success?: boolean,
  duration?: Period,
  objective?: ObjectiveActivity
): AxiosPromise<string[]> {
  return this.interaction(
    testId,
    questionId,
    answerId,
    {
      type: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "likert",
      ...(correctAnswerId
        ? {
            correctResponsesPattern: [correctAnswerId],
          }
        : {}),
      ...(scale ? { scale } : {}),
      ...(name ? { name } : {}),
      ...(description ? { description } : {}),
    },
    success,
    duration,
    objective
  );
}
