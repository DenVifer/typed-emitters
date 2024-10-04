import {
    createTypedEmitter,
    TypedEventEmitter,
} from "../lib/createTypedEmitter";

describe(createTypedEmitter.name, () => {
    let emitter: TypedEventEmitter<[string, number]>;

    beforeEach(() => {
        emitter = createTypedEmitter();
    });

    test("checkForListeners returns false if there are no listeners", () => {
        expect(emitter.checkForListeners()).toBeFalsy();
    });

    test("checkForListeners returns true after adding a listener", () => {
        emitter.addListener(jest.fn());
        expect(emitter.checkForListeners()).toBeTruthy();
    });

    test("checkForListeners returns false after removing a listener", () => {
        const listener = jest.fn();
        emitter.addListener(listener);
        emitter.removeListener(listener);

        expect(emitter.checkForListeners()).toBeFalsy();
    });

    test("calls a listener with right args", () => {
        const listener = jest.fn();
        emitter.addListener(listener);

        const args: [string, number] = ["test", 1];
        emitter.emit(...args);

        expect(listener).toBeCalledWith(...args);
    });

    test("source works correctly", () => {
        const listener = jest.fn();

        emitter.source.addListener(listener);
        expect(emitter.checkForListeners()).toBeTruthy();

        emitter.source.removeListener(listener);
        expect(emitter.checkForListeners()).toBeFalsy();
    });

    test("removes all listeners", () => {
        emitter.addListener(jest.fn());
        emitter.removeAllListeners();
        expect(emitter.checkForListeners()).toBeFalsy();
    });

    test("doesn't add duplicated listeners", () => {
        const listener = jest.fn();

        emitter.addListener(listener);
        emitter.addListener(listener);

        emitter.emit("test", 1);

        expect(listener).toBeCalledTimes(1);
    });
});
