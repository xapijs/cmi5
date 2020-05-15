# Getting Started

## ES module

```bash
npm i @xapi/cmi5 --save
```

```ts
import Cmi5 from "@xapi/cmi5";

// Create Cmi5 instance
const cmi5: Cmi5 = new Cmi5();

// Initialize AU
cmi5.initialize();
```

## Browser

```html
<script src="https://unpkg.com/@xapi/cmi5"></script>

<script type="text/javascript">
  // Create Cmi5 instance
  const cmi5 = new Cmi5();

  // Initialize AU
  cmi5.initialize();
</script>
```

# Methods

- [Cmi5](#Cmi5)
  - [new Cmi5()](#new-Cmi5)

- [Helpers](#Helpers)
  - [getLaunchParameters](#getLaunchParameters)
  - [getLaunchData](#getLaunchData)
  - [getLearnerPreferences](#getLearnerPreferences)

- ["cmi5 defined" Statements](#"cmi5-defined"-Statements)
  - [initialize](#initialize)
  - [complete](#complete)
  - [pass](#pass)
  - [fail](#fail)
  - [terminate](#terminate)

- ["cmi5 allowed" Statements](#"cmi5-allowed"-Statements)
  - [progress](#progress)
  - [interactionTrueFalse](#interactionTrueFalse)
  - [interactionChoice](#interactionChoice)
  - [interactionFillIn](#interactionFillIn)
  - [interactionLongFillIn](#interactionLongFillIn)
  - [interactionLikert](#interactionLikert)
  - [interactionMatching](#interactionMatching)
  - [interactionPerformance](#interactionPerformance)
  - [interactionSequencing](#interactionSequencing)
  - [interactionNumeric](#interactionNumeric)
  - [interactionOther](#interactionOther)
  - [interaction](#interaction)

## Cmi5

### new Cmi5()

To use any methods, you will need to create a new instance of [Cmi5](./Cmi5.ts). The credentials are obtained from the LMS automatically via the URL launch parameters.

#### Example

```ts
const cmi5 = new Cmi5();
```

#### Returns

This returns a [Cmi5](./Cmi5.ts) object which you can use to communicate with the LRS.

## Helpers

### getLaunchParameters

This gets the launch parameters supplied in the URL. Can be used before initializing.

#### Example

```ts
import Cmi5, { LaunchParameters } from "@xapi/cmi5";

const cmi5 = new Cmi5();

const launchParameters: LaunchParameters = cmi5.getLaunchParameters();
```

#### Returns

This returns a [LaunchParameters](./interfaces/LaunchParameters.ts) object.

### getLaunchData

This gets the launch data from the LMS. Can **not** be used before initializing the AU.

#### Example

```ts
import Cmi5, { LaunchData } from "@xapi/cmi5";

const cmi5 = new Cmi5();

cmi5.initialize().then(() => {
  const launchData: LaunchData = cmi5.getLaunchData();
});
```

#### Returns

This returns a [LaunchData](./interfaces/LaunchData.ts) object.

### getLearnerPreferences

This gets the learner preferences from the LMS. Can **not** be used before initializing the AU.

#### Example

```ts
import Cmi5, { LearnerPreferences } from "@xapi/cmi5";

const cmi5 = new Cmi5();

cmi5.initialize().then(() => {
  const learnerPreferences: LearnerPreferences = cmi5.getLearnerPreferences();
});
```

## "cmi5 defined" Statements

### initialize

Initializes the session, must be called before performing other methods.

#### Example

```ts
import Cmi5 from "@xapi/cmi5";

const cmi5 = new Cmi5();

cmi5.initialize();
```

#### Returns

This returns a `Promise` containing an array with the resulting statementId if successful.

### complete

Completes the AU. Required for satisfaction if `LaunchData.moveOn` is equal to `Completed`, `CompletedAndPassed` or `CompletedOrPassed`.

#### Example

```ts
import Cmi5 from "@xapi/cmi5";

const cmi5 = new Cmi5();

// initialize etc

cmi5.complete();
```

#### Returns

This returns a `Promise` containing an array with the resulting statementId if successful.

### pass

Passes the AU. Required for satisfaction if `LaunchData.moveOn` is equal to `Passed`, `CompletedAndPassed` or `CompletedOrPassed`.

#### Example

##### Example 1: Pass

```ts
import Cmi5 from "@xapi/cmi5";

const cmi5 = new Cmi5();

// initialize etc

cmi5.pass();
```

##### Example 2: Pass with score

```ts
import Cmi5 from "@xapi/cmi5";
import { ResultScore } from "@xapi/xapi";

const cmi5 = new Cmi5();

// initialize etc

const score: ResultScore = {
  scaled: 0.95,
  raw: 95
  min: 0
  max: 100
}

cmi5.pass(score);
```

##### Example 3: Pass with score and objective

```ts
import Cmi5 from "@xapi/cmi5";
import { ResultScore, ObjectiveActivity } from "@xapi/xapi";

const cmi5 = new Cmi5();

// initialize etc

const score: ResultScore = {
  scaled: 0.95,
  raw: 95
  min: 0
  max: 100
}

const objective: ObjectiveActivity = {
  objectType: "Activity",
  id: "https://github.com/xapijs/cmi5/objectives/test",
  definition: {
    type: "http://adlnet.gov/expapi/activities/objective",
    name: {
      "en-US": "Example Objective"
    },
    description: {
      "en-US": "An example objective."
    }
  }
}

cmi5.pass(score, objective);
```
#### Parameters

|Parameter|Type|Reqiured|Description|
|-|-|-|-|
|score|[ResultScore](https://github.com/xapijs/xapi/blob/master/src/XAPI/interfaces/Statement/Result.ts)|false|The score achieved by the learner.|
|objective|[ObjectiveActivity](https://github.com/xapijs/xapi/blob/master/src/XAPI/interfaces/Statement/Activity/ObjectiveActivity.ts)|false|The objective achieved by the learner.|

Note: If using score and/or objective parameters, types for these are in `@xapi/xapi` and must be installed as a dev dependency `npm i --save-dev @xapi/xapi`.

#### Returns

This returns a `Promise` containing an array with the resulting statementId if successful.

### fail

Fails the AU. Required to mark the AU as Failed if `LaunchData.moveOn` is equal to `Passed`, `CompletedAndPassed` or `CompletedOrPassed`.

#### Example

##### Example 1: Fail

```ts
import Cmi5 from "@xapi/cmi5";

const cmi5 = new Cmi5();

// initialize etc

cmi5.fail();
```

##### Example 2: Fail with score

```ts
import Cmi5 from "@xapi/cmi5";
import { ResultScore } from "@xapi/xapi";

const cmi5 = new Cmi5();

// initialize etc

const score: ResultScore = {
  scaled: 0.25,
  raw: 25
  min: 0
  max: 100
}

cmi5.fail(score);
```

#### Parameters

|Parameter|Type|Reqiured|Description|
|-|-|-|-|
|score|[ResultScore](https://github.com/xapijs/xapi/blob/master/src/XAPI/interfaces/Statement/Result.ts)|false|The score achieved by the learner.|

Note: If using the score parameter, types for this are in `@xapi/xapi` and must be installed as a dev dependency `npm i --save-dev @xapi/xapi`.

#### Returns

This returns a `Promise` containing an array with the resulting statementId if successful.

### terminate

Terminates the session, must be the last method called before closing the window.

#### Example

```ts
import Cmi5 from "@xapi/cmi5";

const cmi5 = new Cmi5();

// initialize etc

cmi5.terminate();
```

#### Returns

This returns a `Promise` containing an array with the resulting statementId if successful.

## "cmi5 allowed" Statements

### progress

**TODO**

### interactionTrueFalse

**TODO**

### interactionChoice

**TODO**

### interactionFillIn

**TODO**

### interactionLongFillIn

**TODO**

### interactionLikert

**TODO**

### interactionMatching

**TODO**

### interactionPerformance

**TODO**

### interactionSequencing

**TODO**

### interactionNumeric

**TODO**

### interactionOther

**TODO**

### interaction

**TODO**
