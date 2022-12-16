export function addParamsToWindowLocationHref(params: {}) {
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
