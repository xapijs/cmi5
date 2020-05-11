import { Agent } from "@xapi/xapi";

export interface LaunchParameters {
  endpoint: string;
  fetch: string;
  actor: Agent;
  registration: string;
  activityId: string;
}
