import XAPI, { Verb } from "@xapi/xapi";

// 9.3 Verbs - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#93-verbs
export class Cmi5DefinedVerbs {
  public static readonly INITIALIZED: Verb = XAPI.Verbs.INITIALIZED;
  public static readonly COMPLETED: Verb = XAPI.Verbs.COMPLETED;
  public static readonly PASSED: Verb = XAPI.Verbs.PASSED;
  public static readonly FAILED: Verb = XAPI.Verbs.FAILED;
  public static readonly TERMINATED: Verb = XAPI.Verbs.TERMINATED;
}
