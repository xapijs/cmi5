import { isCmiAvailable } from "./isCmiAvailable";
import { testLaunchParams } from "../../../test/constants";
import { addParamsToWindowLocationHref } from "../../../test/addParamsToWindowLocationHref";

describe("isCmiAvailable", () => {
  test("should return false when not all query params are present", () => {
    const result = isCmiAvailable();
    expect(result).toBeFalsy();
  });

  test("should return true when all query params are present", () => {
    addParamsToWindowLocationHref(testLaunchParams);
    const result = isCmiAvailable();
    expect(result).toBeTruthy();
  });
});
