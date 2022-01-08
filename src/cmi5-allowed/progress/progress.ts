import XAPI from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5 from "Cmi5";

export function progress(this: Cmi5, percent: number): AxiosPromise<string[]> {
  return this.sendCmi5AllowedStatement({
    verb: XAPI.Verbs.PROGRESSED,
    object: {
      objectType: "Activity",
      id: this.launchParameters.activityId,
    },
    result: {
      extensions: {
        "https://w3id.org/xapi/cmi5/result/extensions/progress": percent,
      },
    },
  });
}
