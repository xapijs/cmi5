import Cmi5 from "./Cmi5";
import { DEFAULT_LAUNCH_PARAMETERS } from "../test/helpers";

function addParamsToWindowLocationHref(params: {}) {
  const search =
    "?" +
    Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&");

  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
    writable: true,
  });
}

function deepclone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

describe("cmi5 constructor", () => {
  test("should throw error when no `fetch` parameter in URL", () => {
    const params = deepclone(DEFAULT_LAUNCH_PARAMETERS);
    delete params.fetch;
    addParamsToWindowLocationHref(params);
    const cmi5 = () => new Cmi5();
    expect(cmi5).toThrow(
      Error("Unable to construct, no `fetch` parameter found in URL.")
    );
  });

  test("should throw error when no `endpoint` parameter found in URL", () => {
    const params = deepclone(DEFAULT_LAUNCH_PARAMETERS);
    delete params.endpoint;
    addParamsToWindowLocationHref(params);
    const cmi5 = () => new Cmi5();
    expect(cmi5).toThrow(
      Error("Unable to construct, no `endpoint` parameter found in URL.")
    );
  });

  test("should throw error when no `actor` parameter found in URL", () => {
    const params = deepclone(DEFAULT_LAUNCH_PARAMETERS);
    delete params.actor;
    addParamsToWindowLocationHref(params);
    const cmi5 = () => new Cmi5();
    expect(cmi5).toThrow(
      Error("Unable to construct, no `actor` parameter found in URL.")
    );
  });

  test("should throw error when no `activityId` parameter found in URL", () => {
    const params = deepclone(DEFAULT_LAUNCH_PARAMETERS);
    delete params.activityId;
    addParamsToWindowLocationHref(params);
    const cmi5 = () => new Cmi5();
    expect(cmi5).toThrow(
      Error("Unable to construct, no `activityId` parameter found in URL.")
    );
  });

  test("should throw error when no `registration` parameter found in URL", () => {
    const params = deepclone(DEFAULT_LAUNCH_PARAMETERS);
    delete params.registration;
    addParamsToWindowLocationHref(params);
    const cmi5 = () => new Cmi5();
    expect(cmi5).toThrow(
      Error("Unable to construct, no `registration` parameter found in URL.")
    );
  });

  test("should not throw error when all parameters found in URL", () => {
    addParamsToWindowLocationHref(DEFAULT_LAUNCH_PARAMETERS);
    const cmi5 = () => new Cmi5();
    expect(cmi5).not.toThrow(Error);
  });
});

describe("cmi5 singleton", () => {
  test("should return a singleton instance", () => {
    const instance = Cmi5.instance;
    expect(instance).toBe(Cmi5.instance);
  });

  test("should clear a singleton instance", () => {
    const instance = Cmi5.instance;
    Cmi5.clearInstance();
    expect(instance).not.toBe(Cmi5.instance);
  });
});

describe("xapi instance", () => {
  beforeEach(() => {
    addParamsToWindowLocationHref(DEFAULT_LAUNCH_PARAMETERS);
  });
  test("should be null when not initialised", () => {
    const cmi5 = new Cmi5();
    expect(Cmi5.xapi).toBe(null);
  });

  // test("should return an xAPI instance when initialised successfully", () => {
  //   const cmi5 = new Cmi5();
  //   return cmi5.initialize().then(() => {
  //     expect(Cmi5.xapi).toBeTruthy();
  //   });
  // });
});
