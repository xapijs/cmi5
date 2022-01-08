import {
  InteractionComponent,
  LanguageMap,
  ObjectiveActivity,
} from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5, { PerformanceCriteria, Period } from "../../Cmi5";

export function interactionPerformance(
  this: Cmi5,
  testId: string,
  questionId: string,
  answers: Performance,
  correctAnswers?: PerformanceCriteria[],
  steps?: InteractionComponent[],
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
      interactionType: "performance",
      ...(correctAnswers
        ? {
            correctResponsesPattern: [
              Object.keys(correctAnswers)
                .map((key) => {
                  const exact: string = correctAnswers[key].exact
                    ? correctAnswers[key].exact.toString()
                    : "";
                  const min: string = correctAnswers[key].min
                    ? correctAnswers[key].min.toString()
                    : "";
                  const max: number = correctAnswers[key].max
                    ? correctAnswers[key].max.toString()
                    : "";
                  return `${key}[.]${exact ? exact : min + ":" + max}`;
                })
                .join("[,]"),
            ],
          }
        : {}),
      ...(steps ? { steps } : {}),
      ...(name ? { name } : {}),
      ...(description ? { description } : {}),
    },
    success,
    duration,
    objective
  );
}
