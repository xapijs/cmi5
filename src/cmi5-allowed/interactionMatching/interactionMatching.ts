import {
  InteractionComponent,
  LanguageMap,
  ObjectiveActivity,
} from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5 from "../../Cmi5";
import { Period } from "../../interfaces";

export function interactionMatching(
  this: Cmi5,
  testId: string,
  questionId: string,
  answers: { [sourceId: string]: string },
  correctAnswers?: { [sourceId: string]: string },
  source?: InteractionComponent[],
  target?: InteractionComponent[],
  name?: LanguageMap,
  description?: LanguageMap,
  success?: boolean,
  duration?: Period,
  objective?: ObjectiveActivity
): AxiosPromise<string[]> {
  return this.interaction(
    testId,
    questionId,
    Object.keys(answers)
      .map((key) => {
        return `${key}[.]${answers[key]}`;
      })
      .join("[,]"),
    {
      type: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "matching",
      ...(correctAnswers
        ? {
            correctResponsesPattern: [
              Object.keys(correctAnswers)
                .map((key) => {
                  return `${key}[.]${correctAnswers[key]}`;
                })
                .join("[,]"),
            ],
          }
        : {}),
      ...(source ? { source } : {}),
      ...(target ? { target } : {}),
      ...(name ? { name } : {}),
      ...(description ? { description } : {}),
    },
    success,
    duration,
    objective
  );
}
