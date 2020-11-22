import { SendStatementOptions } from "./SendStatementOptions";
import { ResultScore } from "@xapi/xapi/";

export interface MoveOnOptions extends SendStatementOptions {
  score?: ResultScore | number;
  disableSendTerminated?: boolean;
}
