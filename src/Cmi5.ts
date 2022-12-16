import XAPI from "@xapi/xapi";
import { LaunchData, LaunchParameters, LearnerPreferences } from "./interfaces";

import { initialize } from "./cmi5-defined/initialize/initialize";
import { complete } from "./cmi5-defined/complete/complete";
import { pass } from "./cmi5-defined/pass/pass";
import { fail } from "./cmi5-defined/fail/fail";
import { terminate } from "./cmi5-defined/terminate/terminate";

import { progress } from "./cmi5-allowed/progress/progress";
import { interactionTrueFalse } from "./cmi5-allowed/interactionTrueFalse/interactionTrueFalse";
import { interactionChoice } from "./cmi5-allowed/interactionChoice/interactionChoice";
import { interactionFillIn } from "./cmi5-allowed/interactionFillIn/interactionFillIn";
import { interactionLongFillIn } from "./cmi5-allowed/interactionLongFillIn/interactionLongFillIn";
import { interactionLikert } from "./cmi5-allowed/interactionLikert/interactionLikert";
import { interactionMatching } from "./cmi5-allowed/interactionMatching/interactionMatching";
import { interactionPerformance } from "./cmi5-allowed/interactionPerformance/interactionPerformance";
import { interactionSequencing } from "./cmi5-allowed/interactionSequencing/interactionSequencing";
import { interactionNumeric } from "./cmi5-allowed/interactionNumeric/interactionNumeric";
import { interactionOther } from "./cmi5-allowed/interactionOther/interactionOther";
import { interaction } from "./cmi5-allowed/interaction/interaction";

import { isCmiAvailable } from "./helpers/isCmiAvailable/isCmiAvailable";
import { moveOn } from "./helpers/moveOn/moveOn";

import { sendCmi5DefinedStatement } from "./internal/sendCmi5DefinedStatement";
import { sendCmi5AllowedStatement } from "./internal/sendCmi5AllowedStatement";

export * from "./interfaces";

/**
 * Experience API cmi5 Profile (Quartz - 1st Edition)
 * Reference: https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md
 */
export default class Cmi5 {
  private static _instance: Cmi5 | null = null;
  private static _xapi: XAPI | null = null;
  protected launchParameters: LaunchParameters;
  protected launchData!: LaunchData;
  protected learnerPreferences!: LearnerPreferences;
  protected initialisedDate!: Date;

  constructor() {
    this.launchParameters = XAPI.getSearchQueryParamsAsObject(
      window.location.search
    ) as LaunchParameters;
    if (!this.launchParameters.fetch) {
      throw Error("Unable to construct, no `fetch` parameter found in URL.");
    } else if (!this.launchParameters.endpoint) {
      throw Error("Unable to construct, no `endpoint` parameter found in URL.");
    } else if (!this.launchParameters.actor) {
      throw Error("Unable to construct, no `actor` parameter found in URL.");
    } else if (!this.launchParameters.activityId) {
      throw Error(
        "Unable to construct, no `activityId` parameter found in URL."
      );
    } else if (!this.launchParameters.registration) {
      throw Error(
        "Unable to construct, no `registration` parameter found in URL."
      );
    }
  }

  // "cmi5 defined" Statements

  public initialize = initialize;

  public complete = complete;

  public pass = pass;

  public fail = fail;

  public terminate = terminate;

  // "cmi5 allowed" Statements

  public progress = progress;

  public interactionTrueFalse = interactionTrueFalse;

  public interactionChoice = interactionChoice;

  public interactionFillIn = interactionFillIn;

  public interactionLongFillIn = interactionLongFillIn;

  public interactionLikert = interactionLikert;

  public interactionMatching = interactionMatching;

  public interactionPerformance = interactionPerformance;

  public interactionSequencing = interactionSequencing;

  public interactionNumeric = interactionNumeric;

  public interactionOther = interactionOther;

  public interaction = interaction;

  // helpers

  public getLaunchParameters(): LaunchParameters {
    return this.launchParameters;
  }

  public getLaunchData(): LaunchData {
    return this.launchData;
  }

  // 11.0 xAPI Agent Profile Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#110-xapi-agent-profile-data-model
  public getLearnerPreferences(): LearnerPreferences {
    return this.learnerPreferences;
  }

  public static get isCmiAvailable() {
    return isCmiAvailable();
  }

  public get isAuthenticated(): boolean {
    return Boolean(Cmi5._xapi);
  }

  static get instance(): Cmi5 {
    if (!Cmi5._instance) {
      Cmi5._instance = new Cmi5();
    }
    return Cmi5._instance;
  }

  static clearInstance(): void {
    Cmi5._instance = null;
  }

  public moveOn = moveOn;

  static get xapi(): XAPI | null {
    return Cmi5._xapi;
  }

  protected set xapi(xapi: XAPI) {
    Cmi5._xapi = xapi;
  }

  // internal

  protected sendCmi5DefinedStatement = sendCmi5DefinedStatement;

  protected sendCmi5AllowedStatement = sendCmi5AllowedStatement;
}
