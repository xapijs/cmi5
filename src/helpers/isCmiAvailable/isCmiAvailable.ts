/**
 * Checks whether the environment has all of the necessary parameters for initialisation.
 * @returns true if the url search parameters have all required cmi5 query parameters
 */
export function isCmiAvailable(): boolean {
  const params = new URLSearchParams(window.location.search);
  return Boolean(
    params.get("fetch") &&
      params.get("endpoint") &&
      params.get("actor") &&
      params.get("registration") &&
      params.get("activityId")
  );
}
