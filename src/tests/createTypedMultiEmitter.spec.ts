import {
    createTypedMultiEmitter,
    TypedMultiEventEmitter,
} from "../lib/createTypedMultiEmitter";

describe(createTypedMultiEmitter.name, () => {
    let emitter: TypedMultiEventEmitter<{
        event1: [string, number];
        event2: [number, string];
    }>;

    beforeEach(() => {
        emitter = createTypedMultiEmitter();
    });

    test("checkForListeners returns false if there are no listeners", () => {
        expect(emitter.checkForListeners("event1")).toBeFalsy();
        expect(emitter.checkForListeners("event2")).toBeFalsy();
    });

    test("checkForListeners returns true for the right eventName after adding a listener", () => {
        emitter.addListener("event1", jest.fn());
        expect(emitter.checkForListeners("event1")).toBeTruthy();
        expect(emitter.checkForListeners("event2")).toBeFalsy();
    });

    test("checkForListeners returns false after removing a listener", () => {
        const listener = jest.fn();
        emitter.addListener("event1", listener);
        emitter.removeListener("event1", listener);

        expect(emitter.checkForListeners("event1")).toBeFalsy();
        expect(emitter.checkForListeners("event2")).toBeFalsy();
    });

    test("checkForListeners method works correctly when eventName is not specified", () => {
        const listener = jest.fn();
        emitter.addListener("event1", listener);
        expect(emitter.checkForListeners()).toBeTruthy();
        emitter.removeAllListeners();
        expect(emitter.checkForListeners()).toBeFalsy();
    });

    test("calls the right listener with right args", () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        emitter.addListener("event1", listener1);
        emitter.addListener("event2", listener2);

        const args: [string, number] = ["test", 1];
        emitter.emit("event1", ...args);

        expect(listener1).toBeCalledWith(...args);
        expect(listener2).not.toBeCalled();
    });

    test("source works correctly", () => {
        const listener = jest.fn();

        emitter.source.addListener("event1", listener);
        expect(emitter.checkForListeners("event1")).toBeTruthy();

        emitter.source.removeListener("event1", listener);
        expect(emitter.checkForListeners("event1")).toBeFalsy();
    });

    test("removes all listeners", () => {
        emitter.addListener("event1", jest.fn());
        emitter.addListener("event2", jest.fn());
        emitter.removeAllListeners();
        expect(emitter.checkForListeners("event1")).toBeFalsy();
        expect(emitter.checkForListeners("event2")).toBeFalsy();
    });

    test("removes all listeners for a specific eventName", () => {
        emitter.addListener("event1", jest.fn());
        emitter.addListener("event2", jest.fn());
        emitter.removeAllListeners("event1");
        expect(emitter.checkForListeners("event1")).toBeFalsy();
        expect(emitter.checkForListeners("event2")).toBeTruthy();
    });

    test("doesn't add duplicated listeners", () => {
        const listener = jest.fn();

        emitter.addListener("event1", listener);
        emitter.addListener("event1", listener);

        emitter.emit("event1", "test", 1);

        expect(listener).toBeCalledTimes(1);
    });
});
