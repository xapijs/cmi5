import XAPI, { Agent } from "@xapi/xapi";
import { LaunchData, LaunchParameters } from "../src/interfaces";
import MockAxios from "axios-mock-adapter";
import axios, { AxiosResponse } from "axios";

export const DEFAULT_ACCESS_TOKEN_USERNAME = "testuser";
export const DEFAULT_ACCESS_TOKEN_PASSWORD = "testpassword";
export const DEFAULT_URL_BASE = "http://example.com";
export const DEFAULT_LAUNCH_PARAMETERS: LaunchParameters = {
  activityId: `${DEFAULT_URL_BASE}/activity-id`,
  actor: {
    name: DEFAULT_ACCESS_TOKEN_USERNAME,
    objectType: "Agent",
    account: {
      homePage: `${DEFAULT_URL_BASE}/users`,
      name: DEFAULT_ACCESS_TOKEN_PASSWORD,
    },
  },
  endpoint: `${DEFAULT_URL_BASE}/xapi/`,
  fetch: `${DEFAULT_URL_BASE}/fetchauth`,
  registration: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
};
export const DEFAULT_FAKE_LAUNCH_DATA: LaunchData = {
  contextTemplate: {
    registration: DEFAULT_LAUNCH_PARAMETERS.registration,
  },
  launchMode: "Normal",
  moveOn: "CompletedAndPassed",
  masteryScore: 0.5,
  returnURL: "/returnUrl",
};
export const DEFAULT_FAKE_AGENT_PROFILE = {};

function _axiosResponse<T>(
  r: Partial<AxiosResponse<T>>
): Promise<AxiosResponse<T>> {
  const resWithStatus = {
    ...r,
    status: r.status || 200,
  } as AxiosResponse<T>;
  return resWithStatus.status < 400
    ? Promise.resolve(resWithStatus)
    : Promise.reject({
        response: resWithStatus,
      });
}

const _setWindowLocation = (newLocation: URL | Location): void => {
  delete (window as any).location;
  (window as any).location = newLocation;
};

export type MockCmi5HelperParams = Partial<
  LaunchParameters & { urlBase: string }
>;

export class MockCmi5Helper {
  accessTokenPassword = DEFAULT_ACCESS_TOKEN_PASSWORD;
  accessTokenUsername = DEFAULT_ACCESS_TOKEN_USERNAME;
  activityId = DEFAULT_LAUNCH_PARAMETERS.activityId;
  actor: Agent = DEFAULT_LAUNCH_PARAMETERS.actor;
  endpoint = DEFAULT_LAUNCH_PARAMETERS.endpoint;
  fakeLaunchData = DEFAULT_FAKE_LAUNCH_DATA;
  fakeAgentProfile = DEFAULT_FAKE_AGENT_PROFILE;
  fetch = DEFAULT_LAUNCH_PARAMETERS.fetch;
  registration = DEFAULT_LAUNCH_PARAMETERS.registration;
  urlBase = DEFAULT_URL_BASE;
  locationOriginal?: Location;
  mockAxios: MockAxios;
  mockXapiGetAgentProfile: jest.SpyInstance;
  mockXapiGetState: jest.SpyInstance;
  mockXapiSendStatement: jest.SpyInstance;

  constructor(params: MockCmi5HelperParams = {}) {
    this.activityId = params.activityId || this.activityId;
    this.actor = params.actor || this.actor;
    this.endpoint = params.endpoint || this.endpoint;
    this.fetch = params.fetch || this.fetch;
    this.registration = params.registration || this.registration;
    this.urlBase = params.urlBase || this.urlBase;
    this.locationOriginal = window.location;
    this.mockAxios = new MockAxios(axios);
    this.mockXapiGetAgentProfile = jest.spyOn(
      XAPI.prototype,
      "getAgentProfile"
    );
    this.mockXapiGetState = jest.spyOn(XAPI.prototype, "getState");
    this.mockXapiSendStatement = jest.spyOn(XAPI.prototype, "sendStatement");
  }

  get search(): URLSearchParams {
    return new URLSearchParams({
      activityId: this.activityId,
      actor: JSON.stringify(this.actor),
      endpoint: this.endpoint,
      fetch: this.fetch,
      registration: this.registration,
    });
  }

  get url(): URL {
    return new URL(`${this.urlBase}?${this.search.toString()}`);
  }

  mockLocation(): void {
    _setWindowLocation(this.url);
  }

  mockFetch(responseStatus = 200): void {
    this.mockAxios.onPost(this.fetch).reply(
      responseStatus,
      responseStatus === 200
        ? {
            "auth-token": Buffer.from(
              `${this.accessTokenUsername}:${this.accessTokenPassword}`
            ).toString("base64"),
          }
        : {}
    );
  }

  mockGetAgentProfile(fakeResponse?: Partial<AxiosResponse>): void {
    this.mockXapiGetAgentProfile.mockImplementation(() =>
      _axiosResponse(
        fakeResponse
          ? fakeResponse
          : {
              data: this.fakeAgentProfile,
            }
      )
    );
  }

  mockGetState(fakeResponse?: Partial<AxiosResponse>): void {
    this.mockXapiGetState.mockImplementation(() =>
      _axiosResponse(
        fakeResponse
          ? fakeResponse
          : {
              data: this.fakeLaunchData,
            }
      )
    );
  }

  mockSendStatement(fakeResponse?: Partial<AxiosResponse>): void {
    this.mockXapiSendStatement.mockImplementation(() =>
      _axiosResponse(
        fakeResponse
          ? fakeResponse
          : {
              data: ["fake-statement-id"],
            }
      )
    );
  }

  restore(): void {
    if (this.locationOriginal) {
      _setWindowLocation(this.locationOriginal);
    }
    this.mockAxios.restore();
    jest.resetAllMocks();
  }
}
