![typed-emitters | Simple, Typed, Universal, Lightweight, Dependency-free event emitters](https://raw.githubusercontent.com/denvifer/typed-emitters/master/docs/image.png)

<div align="center">
  <a href="https://bundlephobia.com/package/typed-emitters" alt=“bundlephobia min”>
      <img src="https://img.shields.io/bundlephobia/min/typed-emitters" />
  </a>
  <a href="https://bundlephobia.com/package/typed-emitters" alt=“bundlephobia minzip”>
      <img src="https://img.shields.io/bundlephobia/minzip/typed-emitters" />
  </a>
  <a href="https://github.com/denvifer/typed-emitters/blob/master/LICENSE" alt=“license”>
      <img src="https://img.shields.io/github/license/denvifer/typed-emitters" />
  </a>
  <a href="https://www.npmjs.com/package/typed-emitters?activeTab=versions" alt=“version”>
      <img src="https://img.shields.io/npm/v/typed-emitters" />
  </a>
</div>

## Install

```bash
npm install typed-emitters
```

## Single-event emitter

### Provider

```typescript
import { createTypedEmitter } from "typed-emitters";
```

```typescript
const emitter =
    createTypedEmitter<
        [string, number] // Multiple args are supported
    >();

// Share the public interface
export const event = this.emitter.source;
```

```typescript
emitter.emit("Test string", 1); // Type checking
```

### Consumer

```typescript
// The source object allows listening to events but not emitting them

// The type of args is [string, number]
event.addListener((...args) => {
    console.log(args);
});
```

## Multi-event emitter

### Provider

```typescript
import { createTypedMultiEmitter } from "typed-emitters";
```

```typescript
const emitter =
    createTypedMultiEmitter<{
        'type1': [number],
        'type2' [string, number]
    }>();

// Share the public interface
export const events = this.emitter.source;
```

```typescript
emitter.emit("type1", 1); // Type checking
emitter.emit("type2", "Test string", 1); // Type checking
```

### Consumer

```typescript
// The source object allows listening to events but not emitting them

// The type of value is number
events.addListener("type1", (value) => {
    console.log(value);
});

// The type of args is [string, number]
events.addListener("type2", (...args) => {
    console.log(args);
});
```

## Unsubscribing

```typescript
// Option 1
event.removeListener(yourListener);

// Option 2
const dispose = event.addListener((...args) => {
    console.log(args);
});
dispose();
```

## Other

### Check if an emitter has any listeners

```typescript
emitter.checkForListeners();
```

```typescript
emitter.checkForListeners("type1");
```

### Removing all listeners

```typescript
emitter.removeAllListeners();
```

```typescript
emitter.removeAllListeners("type1");
```

### Exported types

-   `TypedEventEmitter<Args>`
-   `TypedEventSource<Args>`
-   `TypedMultiEventEmitter<ArgsByEventName>`
-   `TypedMultiEventSource<ArgsByEventName>`
