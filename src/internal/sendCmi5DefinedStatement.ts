import { Context, Statement, StatementObject } from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5, { SendStatementOptions } from "../Cmi5";
import { Cmi5ContextActivity } from "../constants";
import deepmerge from "deepmerge";

export function sendCmi5DefinedStatement(
  this: Cmi5,
  statement: Partial<Statement>,
  options?: SendStatementOptions
): AxiosPromise<string[]> {
  // 9.4 Object - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#94-object
  const object: StatementObject = {
    objectType: "Activity",
    id: this.launchParameters.activityId,
  };
  const context: Context = {
    contextActivities: {
      category: [
        // 9.6.2.1 cmi5 Category Activity - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#9621-cmi5-category-activity
        Cmi5ContextActivity.CMI5,
      ],
    },
  };
  const cmi5DefinedStatementRequirements: Partial<Statement> = {
    object: object,
    context: context,
  };
  const mergedStatement: Partial<Statement> = deepmerge.all([
    cmi5DefinedStatementRequirements,
    statement,
  ]);
  return this.sendCmi5AllowedStatement(mergedStatement, options);
}
