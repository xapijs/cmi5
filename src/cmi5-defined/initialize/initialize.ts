import XAPI from "@xapi/xapi";
import axios, { AxiosPromise } from "axios";
import Cmi5, {
  AuthTokenResponse,
  LaunchData,
  LearnerPreferences,
} from "../../Cmi5";
import { Cmi5DefinedVerbs } from "../../constants";

function getAuthTokenFromLMS(
  fetchUrl: string
): AxiosPromise<AuthTokenResponse> {
  return axios.post<AuthTokenResponse>(fetchUrl);
}

export function getLaunchDataFromLMS(this: Cmi5): AxiosPromise<LaunchData> {
  return Cmi5.xapi.getState({
    agent: this.launchParameters.actor,
    activityId: this.launchParameters.activityId,
    stateId: "LMS.LaunchData",
    registration: this.launchParameters.registration,
  }) as AxiosPromise<LaunchData>;
}

export function getLearnerPreferencesFromLMS(): AxiosPromise<LearnerPreferences> {
  return Cmi5.xapi
    .getAgentProfile({
      agent: this.launchParameters.actor,
      profileId: "cmi5LearnerPreferences",
    })
    .then(
      (result) => {
        return result.data;
      },
      () => {
        return {};
      }
    ) as AxiosPromise<LearnerPreferences>;
}

export function initialize(this: Cmi5): AxiosPromise<string[]> {
  return getAuthTokenFromLMS(this.launchParameters.fetch)
    .then((response) => {
      const authToken: string = response.data["auth-token"];
      this.xapi = new XAPI({
        endpoint: this.launchParameters.endpoint,
        auth: `Basic ${authToken}`,
      });
      return this.getLaunchDataFromLMS();
    })
    .then((result) => {
      this.launchData = result.data;
    })
    .then(() => {
      return this.getLearnerPreferencesFromLMS();
    })
    .then((result) => {
      this.learnerPreferences = result.data || {};
    })
    .then(() => {
      this.initialisedDate = new Date();
      // 9.3.2 Initialized - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#932-initialized
      return this.sendCmi5DefinedStatement({
        verb: Cmi5DefinedVerbs.INITIALIZED,
      });
    });
}
