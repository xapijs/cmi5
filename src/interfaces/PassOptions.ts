import { ObjectiveActivity } from "@xapi/xapi";
import { SendStatementOptions } from "./SendStatementOptions";

export interface PassOptions extends SendStatementOptions {
  objectiveActivity?: ObjectiveActivity;
}
