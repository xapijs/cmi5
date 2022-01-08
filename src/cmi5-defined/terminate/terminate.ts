import XAPI from "@xapi/xapi";
import { AxiosPromise } from "axios";
import Cmi5 from "Cmi5";
import { Cmi5DefinedVerbs } from "../../constants";

export function terminate(this: Cmi5): AxiosPromise<string[]> {
  return this.sendCmi5DefinedStatement({
    // 9.3.8 Terminated - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#938-terminated
    verb: Cmi5DefinedVerbs.TERMINATED,
    result: {
      // 9.5.4.1 Duration - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#terminated-statement
      duration: XAPI.calculateISO8601Duration(this.initialisedDate, new Date()),
    },
  });
}
