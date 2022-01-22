import { LaunchData, LaunchParameters } from "../src/interfaces";
import { Agent, StatementObject } from "@xapi/xapi";

const testUrlBase = "http://example.com";

const testRegistration = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

export const testAgent: Agent = {
  objectType: "Agent",
  name: "Jest",
  mbox: "mailto:hello@example.com",
};

export const testLaunchParams: LaunchParameters = {
  activityId: `${testUrlBase}/activity-id`,
  actor: testAgent,
  endpoint: `${testUrlBase}/xapi/`,
  fetch: `${testUrlBase}/fetchauth`,
  registration: testRegistration,
};

export const testObject: StatementObject = {
  objectType: "Activity",
  id: testLaunchParams.activityId,
};

export const testAuthToken = {
  "auth-token": "abcdefgh",
};

export const testLaunchData: LaunchData = {
  contextTemplate: {
    registration: testRegistration,
  },
  launchMode: "Normal",
  moveOn: "CompletedAndPassed",
  masteryScore: 0.5,
  returnURL: "/returnUrl",
};
