import { addParamsToWindowLocationHref } from "../../../test/addParamsToWindowLocationHref";
import {
  testLaunchParams,
  testAgent,
  testObject,
  testLaunchData,
  testAuthToken,
} from "../../../test/constants";
import Cmi5 from "../../Cmi5";
import axios from "axios";
import { Statement } from "@xapi/xapi";
import { Cmi5DefinedVerbs } from "../../constants";

jest.mock("axios");

describe("initialize", () => {
  beforeEach(async () => {
    addParamsToWindowLocationHref(testLaunchParams);
  });

  test("sends an xapi statement with correct parameters", async () => {
    const cmi5 = new Cmi5();
    (axios as jest.MockedFunction<any>).post.mockResolvedValueOnce({
      data: testAuthToken,
    });
    (axios as jest.MockedFunction<any>).request
      .mockResolvedValueOnce({
        headers: {
          "content-type": "application/json",
        },
        data: testLaunchData,
      })
      .mockResolvedValue({
        headers: {
          "content-type": "application/json",
        },
        data: {},
      });
    await cmi5.initialize();
    const expectedStatement: Statement = {
      actor: testAgent,
      verb: Cmi5DefinedVerbs.INITIALIZED,
      object: testObject,
    };
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining(expectedStatement)
    );
  });
});
