import XAPI, {
  InteractionActivityDefinition,
  ObjectiveActivity,
} from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5 from "../../Cmi5";
import { Period } from "../../interfaces";

export function interaction(
  this: Cmi5,
  testId: string,
  questionId: string,
  response: string,
  interactionDefinition: InteractionActivityDefinition,
  success?: boolean,
  duration?: Period,
  objective?: ObjectiveActivity
): AxiosPromise<string[]> {
  return this.sendCmi5AllowedStatement({
    verb: XAPI.Verbs.ANSWERED,
    result: {
      response: response,
      ...(duration
        ? {
            duration: XAPI.calculateISO8601Duration(
              duration.start,
              duration.end
            ),
          }
        : {}),
      ...(typeof success === "boolean" ? { success } : {}),
    },
    object: {
      objectType: "Activity",
      // Best Practice #16 - AU should use a derived activity ID for “cmi.interaction” statements - https://aicc.github.io/CMI-5_Spec_Current/best_practices/
      id: `${this.launchParameters.activityId}/test/${testId}/question/${questionId}`,
      definition: interactionDefinition,
    },
    // Best Practice #1 - Use of Objectives - https://aicc.github.io/CMI-5_Spec_Current/best_practices/
    ...(objective
      ? {
          context: {
            contextActivities: {
              parent: [objective],
            },
          },
        }
      : {}),
  });
}
