module.exports = {
  testEnvironmentOptions: {
    url: "http://example.com",
  },
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  moduleFileExtensions: ["ts", "js"],
  testEnvironment: "jsdom",
};
