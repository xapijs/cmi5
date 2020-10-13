import { Statement } from "@xapi/xapi";

export interface StatementTransform {
  (s: Statement): Statement;
}
