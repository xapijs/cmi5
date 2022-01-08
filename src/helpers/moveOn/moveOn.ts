import { ResultScore, Statement } from "@xapi/xapi";
import { AxiosResponse } from "axios";
import Cmi5 from "Cmi5";
import { MoveOnOptions } from "interfaces";
import { toResultScore } from "internal/toResultScore";

function setResultScore(
  resultScore: ResultScore,
  statement: Statement
): Statement {
  return {
    ...statement,
    result: {
      ...(statement.result || {}),
      score: resultScore,
    },
  };
}

function appendStatementIds(
  response: AxiosResponse<string[]>,
  toIds: string[]
): void {
  // eslint-disable-next-line prefer-spread
  toIds.push.apply(toIds, response.data);
}

export async function moveOn(
  this: Cmi5,
  options?: MoveOnOptions
): Promise<string[]> {
  let effectiveOptions = options;
  // 10.0 xAPI State Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#100-xapi-state-data-model
  if (this.launchData.launchMode !== "Normal")
    return Promise.reject(
      new Error("Can only send FAILED when launchMode is 'Normal'")
    );
  const newStatementIds: string[] = [];
  if (effectiveOptions?.score) {
    const rScore = toResultScore(effectiveOptions?.score);
    if (this.launchData.masteryScore) {
      if (rScore.scaled >= this.launchData.masteryScore) {
        appendStatementIds(
          await this.pass(rScore, effectiveOptions),
          newStatementIds
        );
      } else {
        appendStatementIds(
          await this.fail(rScore, effectiveOptions),
          newStatementIds
        );
      }
    } else {
      const _setResultScore = (s: Statement): Statement => {
        return setResultScore(rScore, s);
      };
      const transformProvided = effectiveOptions?.transform;
      effectiveOptions = {
        ...(effectiveOptions || {}),
        transform:
          typeof transformProvided === "function"
            ? // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
              (s) => transformProvided(_setResultScore(s))
            : // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
              (s) => _setResultScore(s),
      };
    }
  }
  appendStatementIds(await this.complete(effectiveOptions), newStatementIds);
  if (!options?.disableSendTerminated) {
    appendStatementIds(await this.terminate(), newStatementIds);
  }
  return newStatementIds;
}
