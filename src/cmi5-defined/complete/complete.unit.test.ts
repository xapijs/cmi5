import { addParamsToWindowLocationHref } from "../../../test/addParamsToWindowLocationHref";
import {
  testLaunchParams,
  testAgent,
  testObject,
} from "../../../test/constants";
import Cmi5 from "../../Cmi5";
import axios from "axios";
import { Statement } from "@xapi/xapi";
import { Cmi5DefinedVerbs } from "../../constants";

jest.mock("axios");

// describe("complete", () => {
//   beforeEach(async () => {
//     addParamsToWindowLocationHref(testLaunchParams);
//     (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
//       headers: {
//         "content-type": "application/json",
//       },
//     });
//   });

//   test("sends an xapi statement with correct parameters", async () => {
//     const cmi5 = new Cmi5();
//     await cmi5.complete();
//     const expectedStatement: Statement = {
//       actor: testAgent,
//       verb: Cmi5DefinedVerbs.COMPLETED,
//       object: testObject,
//     };
//     expect(axios.request).toHaveBeenCalledWith(
//       expect.objectContaining(expectedStatement)
//     );
//   });
// });
