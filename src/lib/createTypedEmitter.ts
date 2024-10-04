export const createTypedEmitter = <Args extends unknown[] = []>() => {
    const listeners = new Set<(...args: Args) => void>();

    const removeListener = (listener: (...args: Args) => void): void => {
        listeners.delete(listener);
    };

    const addListener = (listener: (...args: Args) => void): (() => void) => {
        listeners.add(listener);
        return () => {
            removeListener(listener);
        };
    };

    const checkForListeners = () => !!listeners.size;

    const emit = (...args: Args) => {
        listeners.forEach((listener) => {
            listener(...args);
        });
    };

    const removeAllListeners = () => {
        listeners.clear();
    };

    return {
        addListener,
        removeListener,
        checkForListeners,
        emit,
        removeAllListeners,
        get source() {
            return {
                addListener,
                removeListener,
            };
        },
    };
};

export type TypedEventEmitter<Args extends Array<unknown>> = ReturnType<
    typeof createTypedEmitter<Args>
>;

export type TypedEventSource<Args extends Array<unknown>> = ReturnType<
    typeof createTypedEmitter<Args>
>["source"];
