import { ObjectiveActivity, Statement, Verb } from "@xapi/xapi";
import MockDate from "mockdate";
import Cmi5 from "../../src/Cmi5";
import { Cmi5DefinedVerbs } from "../../src/constants";
import { MockCmi5Helper, DEFAULT_LAUNCH_PARAMETERS } from "../helpers";

const DEFAULT_OBJECTIVE_ACTIVITY: ObjectiveActivity = {
  objectType: "Activity",
  id: "http://example.com/object/12345",
  definition: { type: "http://adlnet.gov/expapi/activities/objective" },
};

function mockDateFloorSeconds(now: number): void {
  // needs to floor seconds when mocking date for xapi durations
  // or we'll get tests failing with non-deterministic rounding
  MockDate.set(now - (now % 1000));
}

async function initialize(mockCmi5: MockCmi5Helper): Promise<Cmi5> {
  mockCmi5.mockLocation();
  mockCmi5.mockFetch();
  mockCmi5.mockGetState();
  mockCmi5.mockGetAgentProfile();
  mockCmi5.mockSendStatement();
  const cmi5 = new Cmi5();
  await cmi5.initialize();
  return cmi5;
}

function expectActivityStatement(
  cmi5: Cmi5,
  verb: Verb,
  additionalProps: Record<string, any> = {}
): Partial<Statement> {
  const lps = cmi5.getLaunchParameters();
  return expect.objectContaining({
    actor: lps.actor,
    context: expect.objectContaining({
      registration: lps.registration,
    }),
    object: expect.objectContaining({
      id: lps.activityId,
    }),
    verb,
    ...(additionalProps || {}),
  });
}

describe("Cmi5", () => {
  let mockCmi5: MockCmi5Helper;

  beforeEach(() => {
    mockDateFloorSeconds(Date.now());
    mockCmi5 = new MockCmi5Helper();
  });

  afterEach(() => {
    mockCmi5.restore();
    MockDate.reset();
  });

  describe("constructor", () => {
    it("parses launch params from window.location.href", async () => {
      mockCmi5.mockLocation();
      const cmi5 = new Cmi5();
      expect(cmi5.getLaunchParameters()).toEqual(DEFAULT_LAUNCH_PARAMETERS);
    });
  });

  describe("isCmiAvailable", () => {
    it("returns false when any required cmi query params are missing from window.location", async () => {
      expect(Cmi5.isCmiAvailable).toBe(false);
    });
    it("returns true when all required cmi query params set in window.location", async () => {
      mockCmi5.mockLocation();
      expect(Cmi5.isCmiAvailable).toBe(true);
    });
  });

  describe("initialize", () => {
    it("authenticates, loads state and profile and posts initialized statement", async () => {
      const cmi5 = await initialize(mockCmi5);
      expect(cmi5.isAuthenticated).toEqual(true);
      expect(cmi5.getLaunchData()).toEqual(mockCmi5.fakeLaunchData);
      expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
        expectActivityStatement(cmi5, Cmi5DefinedVerbs.INITIALIZED)
      );
    });

    [401, 404, 500, 502].forEach((failStatus) => {
      it(`throws on fetch failed with ${failStatus}`, async () => {
        mockCmi5.mockLocation();
        mockCmi5.mockFetch(failStatus);
        const cmi5 = new Cmi5();
        expect.assertions(1);
        await expect(cmi5.initialize()).rejects.toThrow(
          expect.objectContaining({
            response: expect.objectContaining({
              status: failStatus,
              config: expect.objectContaining({
                url: mockCmi5.fetch,
              }),
            }),
          })
        );
      });
    });

    [401, 404, 500, 502].forEach((failStatus) => {
      it(`throws on getLaunchData failed with ${failStatus}`, async () => {
        mockCmi5.mockLocation();
        mockCmi5.mockFetch();
        mockCmi5.mockGetState({
          status: failStatus,
          config: {
            url: "activities/state",
          },
        });
        const cmi5 = new Cmi5();
        let exception;
        try {
          await cmi5.initialize();
        } catch (err) {
          exception = err;
        }
        expect(exception).toEqual(
          expect.objectContaining({
            response: expect.objectContaining({
              status: failStatus,
              config: expect.objectContaining({
                url: "activities/state",
              }),
            }),
          })
        );
      });
    });

    [401, 404, 500, 502].forEach((failStatus) => {
      it(`swallows errors on getLearnerPrefs failed with ${failStatus}`, async () => {
        mockCmi5.mockLocation();
        mockCmi5.mockFetch();
        mockCmi5.mockGetState();
        mockCmi5.mockGetAgentProfile({
          status: failStatus,
          config: {
            url: "activities/profile",
          },
        });
        mockCmi5.mockSendStatement();
        const cmi5 = new Cmi5();
        await cmi5.initialize();
        expect(cmi5.getLearnerPreferences()).toEqual({});
        expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
          expectActivityStatement(cmi5, Cmi5DefinedVerbs.INITIALIZED)
        );
      });
    });

    [401, 404, 500, 502].forEach((failStatus) => {
      it(`throws on post INITIALIZED statement fails with ${failStatus}`, async () => {
        mockCmi5.mockLocation();
        mockCmi5.mockFetch();
        mockCmi5.mockGetState();
        mockCmi5.mockGetAgentProfile();
        mockCmi5.mockSendStatement({
          status: failStatus,
          config: {
            url: "xapi/statements",
          },
        });
        const cmi5 = new Cmi5();
        let exception;
        try {
          await cmi5.initialize();
        } catch (err) {
          exception = err;
        }
        expect(exception).toEqual(
          expect.objectContaining({
            response: expect.objectContaining({
              status: failStatus,
              config: expect.objectContaining({
                url: "xapi/statements",
              }),
            }),
          })
        );
      });
    });
  });

  describe("complete", () => {
    it("posts a COMPLETED statement", async () => {
      const cmi5 = await initialize(mockCmi5);
      cmi5.complete();
      expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
        expectActivityStatement(cmi5, Cmi5DefinedVerbs.COMPLETED)
      );
    });

    it("applies optional statement transform when provided", async () => {
      const cmi5 = await initialize(mockCmi5);
      cmi5.complete({
        transform: (s: Statement) => {
          return {
            ...s,
            context: {
              ...(s.context || {}),
              extensions: {
                "http://example.com/xapi/content/ext/my-ext": 2,
              },
            },
          };
        },
      });
      expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
        expectActivityStatement(cmi5, Cmi5DefinedVerbs.COMPLETED, {
          context: expect.objectContaining({
            registration: mockCmi5.registration,
            extensions: {
              "http://example.com/xapi/content/ext/my-ext": 2,
            },
          }),
        })
      );
    });

    [
      { seconds: 125, expectedDuration: "PT2M5S" },
      { seconds: 31, expectedDuration: "PT31S" },
    ].forEach((ex) => {
      it(`sends duration as time since initialized (${ex.seconds}=${ex.expectedDuration})`, async () => {
        const cmi5 = await initialize(mockCmi5);
        mockDateFloorSeconds(Date.now() + +ex.seconds * 1000);
        cmi5.complete();
        expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
          expectActivityStatement(cmi5, Cmi5DefinedVerbs.COMPLETED, {
            result: expect.objectContaining({
              duration: ex.expectedDuration,
            }),
          })
        );
      });
    });

    ["Browse", "Review", null].forEach((launchMode) => {
      it(`throws exception if COMPLETED invalid for launch mode ${launchMode}`, async () => {
        mockCmi5.fakeLaunchData = {
          ...mockCmi5.fakeLaunchData,
          launchMode: launchMode as any,
        };
        const cmi5 = await initialize(mockCmi5);
        let exception;
        try {
          await cmi5.complete();
        } catch (err) {
          exception = err;
        }
        expect(exception).toEqual(
          expect.objectContaining({
            message: "Can only send COMPLETED when launchMode is 'Normal'",
          })
        );
      });
    });
  });

  describe("passed", () => {
    it("posts a PASSED statement with a result score", async () => {
      const cmi5 = await initialize(mockCmi5);
      cmi5.pass({ scaled: 0.9 });
      expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
        expectActivityStatement(cmi5, Cmi5DefinedVerbs.PASSED, {
          result: expect.objectContaining({
            success: true,
            score: {
              scaled: 0.9,
            },
          }),
        })
      );
    });

    it("posts a PASSED statement with a result score passed as a number", async () => {
      const cmi5 = await initialize(mockCmi5);
      cmi5.pass(0.75);
      expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
        expectActivityStatement(cmi5, Cmi5DefinedVerbs.PASSED, {
          result: expect.objectContaining({
            success: true,
            score: {
              scaled: 0.75,
            },
          }),
        })
      );
    });

    it("posts a PASSED statement with no result score when score not passed", async () => {
      mockCmi5.fakeLaunchData = {
        ...mockCmi5.fakeLaunchData,
        masteryScore: undefined,
      };
      const cmi5 = await initialize(mockCmi5);
      cmi5.pass();
      expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
        expectActivityStatement(cmi5, Cmi5DefinedVerbs.PASSED, {
          result: expect.not.objectContaining({
            score: expect.anything(),
          }),
        })
      );
    });

    it("throws if passed score is beneath masteryScore", async () => {
      const cmi5 = await initialize(mockCmi5);
      let exception;
      try {
        await cmi5.pass(0.1);
      } catch (err) {
        exception = err;
      }
      expect(exception).toEqual(
        expect.objectContaining({
          message: "Learner has not met Mastery Score",
        })
      );
    });

    ["Browse", "Review", null].forEach((launchMode) => {
      it(`throws exception if PASSED invalid for launch mode ${launchMode}`, async () => {
        mockCmi5.fakeLaunchData = {
          ...mockCmi5.fakeLaunchData,
          launchMode: launchMode as any,
        };
        const cmi5 = await initialize(mockCmi5);
        let exception;
        try {
          await cmi5.pass();
        } catch (err) {
          exception = err;
        }
        expect(exception).toEqual(
          expect.objectContaining({
            message: "Can only send PASSED when launchMode is 'Normal'",
          })
        );
      });
    });

    it("assigns an ObjectiveActivity when passed as second param", async () => {
      const cmi5 = await initialize(mockCmi5);
      cmi5.pass(0.6, DEFAULT_OBJECTIVE_ACTIVITY);
      expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
        expectActivityStatement(cmi5, Cmi5DefinedVerbs.PASSED, {
          context: expect.objectContaining({
            contextActivities: expect.objectContaining({
              parent: [DEFAULT_OBJECTIVE_ACTIVITY],
            }),
          }),
          result: expect.objectContaining({
            success: true,
            score: {
              scaled: 0.6,
            },
          }),
        })
      );
    });

    it("applies optional statement transform when provided", async () => {
      const cmi5 = await initialize(mockCmi5);
      cmi5.pass(0.75, {
        transform: (s: Statement) => {
          return {
            ...s,
            result: {
              ...(s.result || {}),
              extensions: {
                "http://example.com/xapi/result/ext/some-ext": "some-val",
              },
            },
          };
        },
      });
      expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
        expectActivityStatement(cmi5, Cmi5DefinedVerbs.PASSED, {
          result: expect.objectContaining({
            success: true,
            score: {
              scaled: 0.75,
            },
            extensions: {
              "http://example.com/xapi/result/ext/some-ext": "some-val",
            },
          }),
        })
      );
    });

    [{ seconds: 93, expectedDuration: "PT1M33S" }].forEach((ex) => {
      it(`sends duration as time since initialized (${ex.seconds}=${ex.expectedDuration})`, async () => {
        const cmi5 = await initialize(mockCmi5);
        mockDateFloorSeconds(Date.now() + ex.seconds * 1000);
        cmi5.pass(0.9);
        expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
          expectActivityStatement(cmi5, Cmi5DefinedVerbs.PASSED, {
            result: expect.objectContaining({
              duration: ex.expectedDuration,
            }),
          })
        );
      });
    });
  });

  describe("failed", () => {
    it("posts a FAILED statement with a result score", async () => {
      const cmi5 = await initialize(mockCmi5);
      cmi5.fail({ scaled: 0.1 });
      expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
        expectActivityStatement(cmi5, Cmi5DefinedVerbs.FAILED, {
          result: expect.objectContaining({
            success: false,
            score: {
              scaled: 0.1,
            },
          }),
        })
      );
    });

    it("posts a FAILED statement with a result score passed as a number", async () => {
      const cmi5 = await initialize(mockCmi5);
      cmi5.fail(0.2);
      expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
        expectActivityStatement(cmi5, Cmi5DefinedVerbs.FAILED, {
          result: expect.objectContaining({
            success: false,
            score: {
              scaled: 0.2,
            },
          }),
        })
      );
    });

    it("posts a FAILED statement with no result score when score not passed", async () => {
      mockCmi5.fakeLaunchData = {
        ...mockCmi5.fakeLaunchData,
        masteryScore: undefined,
      };
      const cmi5 = await initialize(mockCmi5);
      cmi5.fail();
      expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
        expectActivityStatement(cmi5, Cmi5DefinedVerbs.FAILED, {
          result: expect.not.objectContaining({
            score: expect.anything(),
          }),
        })
      );
    });

    ["Browse", "Review", null].forEach((launchMode) => {
      it(`throws exception if FAILED invalid for launch mode ${launchMode}`, async () => {
        mockCmi5.fakeLaunchData = {
          ...mockCmi5.fakeLaunchData,
          launchMode: launchMode as any,
        };
        const cmi5 = await initialize(mockCmi5);
        let exception;
        try {
          await cmi5.fail();
        } catch (err) {
          exception = err;
        }
        expect(exception).toEqual(
          expect.objectContaining({
            message: "Can only send FAILED when launchMode is 'Normal'",
          })
        );
      });
    });

    it("applies optional statement transform when provided", async () => {
      const cmi5 = await initialize(mockCmi5);
      cmi5.fail(0.3, {
        transform: (s: Statement) => {
          return {
            ...s,
            result: {
              ...(s.result || {}),
              extensions: {
                "http://example.com/xapi/result/ext/another-ext": "another-val",
              },
            },
          };
        },
      });
      expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
        expectActivityStatement(cmi5, Cmi5DefinedVerbs.FAILED, {
          result: expect.objectContaining({
            success: false,
            score: {
              scaled: 0.3,
            },
            extensions: {
              "http://example.com/xapi/result/ext/another-ext": "another-val",
            },
          }),
        })
      );
    });

    [{ seconds: 13, expectedDuration: "PT13S" }].forEach((ex) => {
      it(`sends duration as time since initialized (${ex.seconds}=${ex.expectedDuration})`, async () => {
        const cmi5 = await initialize(mockCmi5);
        mockDateFloorSeconds(Date.now() + ex.seconds * 1000);
        cmi5.fail(0.1);
        expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
          expectActivityStatement(cmi5, Cmi5DefinedVerbs.FAILED, {
            result: expect.objectContaining({
              duration: ex.expectedDuration,
            }),
          })
        );
      });
    });
  });

  describe("terminate", () => {
    it("posts a TERMINATED statement", async () => {
      const cmi5 = await initialize(mockCmi5);
      cmi5.terminate();
      expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
        expectActivityStatement(cmi5, Cmi5DefinedVerbs.TERMINATED)
      );
    });

    [{ seconds: 3713, expectedDuration: "PT1H1M53S" }].forEach((ex) => {
      it(`sends duration as time since initialized (${ex.seconds}=${ex.expectedDuration})`, async () => {
        const cmi5 = await initialize(mockCmi5);
        mockDateFloorSeconds(Date.now() + ex.seconds * 1000);
        cmi5.terminate();
        expect(mockCmi5.mockXapiSendStatement).toHaveBeenCalledWith(
          expectActivityStatement(cmi5, Cmi5DefinedVerbs.TERMINATED, {
            result: expect.objectContaining({
              duration: ex.expectedDuration,
            }),
          })
        );
      });
    });
  });
});