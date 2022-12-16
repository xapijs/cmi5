import XAPI, { ResultScore, ObjectiveActivity } from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5, { PassOptions, SendStatementOptions } from "../../Cmi5";
import { isObjectiveActivity } from "../../internal/isObjectiveActivity";
import { toResultScore } from "../../internal/toResultScore";
import { Cmi5DefinedVerbs, Cmi5ContextActivity } from "../../constants";

export function pass(
  this: Cmi5,
  score?: ResultScore | number,
  objectiveOrOptions?: ObjectiveActivity | PassOptions
): AxiosPromise<string[]> {
  // 10.0 xAPI State Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#100-xapi-state-data-model
  if (this.launchData.launchMode !== "Normal")
    return Promise.reject(
      new Error("Can only send PASSED when launchMode is 'Normal'")
    );
  const rScore = toResultScore(score);
  // Best Practice #4 - AU Mastery Score - https://aicc.github.io/CMI-5_Spec_Current/best_practices/
  if (
    this.launchData.masteryScore &&
    (!rScore ||
      isNaN(Number(rScore.scaled)) ||
      rScore.scaled < this.launchData.masteryScore)
  )
    return Promise.reject(new Error("Learner has not met Mastery Score"));
  const [objective, options] = isObjectiveActivity(objectiveOrOptions)
    ? [objectiveOrOptions as ObjectiveActivity, undefined]
    : [
        (objectiveOrOptions as PassOptions)
          ? (objectiveOrOptions as PassOptions).objectiveActivity
          : undefined,
        objectiveOrOptions as SendStatementOptions,
      ];
  return this.sendCmi5DefinedStatement(
    {
      // 9.3.4 Passed - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#934-passed
      verb: Cmi5DefinedVerbs.PASSED,
      result: {
        // 9.5.1 Score - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#951-score
        ...(rScore ? { score: rScore } : {}),
        // 9.5.2 Success - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#952-success
        success: true,
        // 9.5.4.1 Duration - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#passed-statement
        duration: XAPI.calculateISO8601Duration(
          this.initialisedDate,
          new Date()
        ),
      },
      context: {
        contextActivities: {
          category: [
            // 9.6.2.2 moveOn Category Activity - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#9622-moveon-category-activity
            Cmi5ContextActivity.MOVE_ON,
          ],
          // Best Practice #1 - Use of Objectives - https://aicc.github.io/CMI-5_Spec_Current/best_practices/
          ...(objective
            ? {
                parent: [objective as ObjectiveActivity],
              }
            : {}),
        },
        ...(this.launchData.masteryScore
          ? {
              extensions: {
                "https://w3id.org/xapi/cmi5/context/extensions/masteryscore":
                  this.launchData.masteryScore,
              },
            }
          : {}),
      },
    },
    options
  );
}
