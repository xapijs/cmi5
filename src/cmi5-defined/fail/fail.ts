import XAPI, { ResultScore } from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5, { SendStatementOptions } from "../../Cmi5";
import { toResultScore } from "../../internal/toResultScore";
import { Cmi5DefinedVerbs, Cmi5ContextActivity } from "../../constants";

export function fail(
  this: Cmi5,
  score?: ResultScore | number,
  options?: SendStatementOptions
): AxiosPromise<string[]> {
  // 10.0 xAPI State Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#100-xapi-state-data-model
  if (this.launchData.launchMode !== "Normal")
    return Promise.reject(
      new Error("Can only send FAILED when launchMode is 'Normal'")
    );
  const rScore = toResultScore(score);
  return this.sendCmi5DefinedStatement(
    {
      // 9.3.5 Failed - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#935-failed
      verb: Cmi5DefinedVerbs.FAILED,
      result: {
        // 9.5.1 Score - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#951-score
        ...(rScore ? { score: rScore } : {}),
        // 9.5.2 Success - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#952-success
        success: false,
        // 9.5.4.1 Duration - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#failed-statement
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
