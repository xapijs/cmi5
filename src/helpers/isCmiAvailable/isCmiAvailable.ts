export function isCmiAvailable(): boolean {
  if (!window || typeof window !== "object") {
    return false;
  }
  if (!window.location || typeof window.location.search !== "string") {
    return false;
  }
  const p = new URLSearchParams(window.location.search);
  return Boolean(
    // true if has all required cmi5 query params
    p.get("fetch") &&
      p.get("endpoint") &&
      p.get("actor") &&
      p.get("registration") &&
      p.get("activityId")
  );
}
