export function isObjectiveActivity(x?: any): boolean {
  return (
    x &&
    x.objectType === "Activity" &&
    typeof x.id === "string" &&
    x.definition &&
    typeof x.definition === "object" &&
    x.definition.type === "http://adlnet.gov/expapi/activities/objective"
  );
}
