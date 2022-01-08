import XAPI from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5 from "../../Cmi5";
import { Cmi5DefinedVerbs, Cmi5ContextActivity } from "../../constants";
import { SendStatementOptions } from "../../interfaces";

export function complete(
  this: Cmi5,
  options?: SendStatementOptions
): AxiosPromise<string[]> {
  // 10.0 xAPI State Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#100-xapi-state-data-model
  if (this.launchData.launchMode !== "Normal")
    return Promise.reject(
      new Error("Can only send COMPLETED when launchMode is 'Normal'")
    );
  return this.sendCmi5DefinedStatement(
    {
      // 9.3.3 Completed - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#933-completed
      verb: Cmi5DefinedVerbs.COMPLETED,
      result: {
        // 9.5.3 Completion - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#953-completion
        completion: true,
        // 9.5.4.1 Duration - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#completed-statement
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
      },
    },
    options
  );
}
