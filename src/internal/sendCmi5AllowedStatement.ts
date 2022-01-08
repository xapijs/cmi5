import { Context, Statement } from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5, { SendStatementOptions } from "../Cmi5";
import deepmerge from "deepmerge";
import { Agent } from "@xapi/xapi";
import { v4 as uuidv4 } from "uuid";

export function sendCmi5AllowedStatement(
  this: Cmi5,
  statement: Partial<Statement>,
  options?: SendStatementOptions
): AxiosPromise<string[]> {
  // 9.1 Statement ID - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#statement_id
  const id = uuidv4();
  // 9.2 Actor - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#92-actor
  const actor: Agent = this.launchParameters.actor;
  // 9.7 Timestamp - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#97-timestamp
  const timestamp = new Date().toISOString();
  // 10.0 xAPI State Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#100-xapi-state-data-model
  const context: Context = Object.assign({}, this.launchData.contextTemplate);
  // 9.6.1 Registration - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#961-registration
  context.registration = this.launchParameters.registration;
  const cmi5AllowedStatementRequirements: Partial<Statement> = {
    id: id,
    actor: actor,
    timestamp: timestamp,
    context: context,
  };
  const mergedStatement = deepmerge.all([
    cmi5AllowedStatementRequirements,
    statement,
  ]) as Statement;
  const sendStatement =
    options && typeof options.transform === "function"
      ? options.transform(mergedStatement)
      : mergedStatement;
  return Cmi5.xapi.sendStatement({
    statement: sendStatement,
  });
}
