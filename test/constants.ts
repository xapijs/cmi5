import { LaunchParameters } from "../src/interfaces";
import { Agent } from "@xapi/xapi";

const testUrlBase = "http://example.com";

const testAgent: Agent = {
  objectType: "Agent",
  name: "Jest",
  mbox: "mailto:hello@example.com",
};

export const testLaunchParams: LaunchParameters = {
  activityId: `${testUrlBase}/activity-id`,
  actor: testAgent,
  endpoint: `${testUrlBase}/xapi/`,
  fetch: `${testUrlBase}/fetchauth`,
  registration: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
};
