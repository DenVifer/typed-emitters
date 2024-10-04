type Listeners<ArgsByEventName extends Record<string | number, unknown[]>> = {
    [EventName in keyof ArgsByEventName]: Set<
        (...args: ArgsByEventName[EventName]) => void
    >;
};

export const createTypedMultiEmitter = <
    ArgsByEventName extends Record<string | number, unknown[]>
>() => {
    let listeners = {} as Listeners<ArgsByEventName>;

    const removeListener = <EventName extends keyof ArgsByEventName>(
        eventName: EventName,
        listener: (...args: ArgsByEventName[EventName]) => void
    ): void => {
        if (eventName in listeners) {
            listeners[eventName].delete(listener);
        }
    };

    const addListener = <EventName extends keyof ArgsByEventName>(
        eventName: EventName,
        listener: (...args: ArgsByEventName[EventName]) => void
    ): (() => void) => {
        if (!(eventName in listeners)) {
            listeners[eventName] = new Set();
        }
        listeners[eventName].add(listener);
        return () => {
            removeListener(eventName, listener);
        };
    };

    const checkForListeners = <EventName extends keyof ArgsByEventName>(
        eventName?: EventName
    ) => {
        if (eventName !== undefined) {
            return !!(eventName in listeners && listeners[eventName].size);
        } else {
            return Object.values(listeners).some(
                (listeners) => !!listeners.size
            );
        }
    };

    const emit = <EventName extends keyof ArgsByEventName>(
        eventName: EventName,
        ...args: ArgsByEventName[EventName]
    ) => {
        if (eventName in listeners) {
            listeners[eventName].forEach((listener) => {
                listener(...args);
            });
        }
    };

    const removeAllListeners = <EventName extends keyof ArgsByEventName>(
        eventName?: EventName
    ) => {
        if (eventName !== undefined) {
            listeners[eventName].clear();
        } else {
            listeners = {} as Listeners<ArgsByEventName>;
        }
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

export type TypedMultiEventEmitter<
    ArgsByEventName extends Record<string | number, Array<unknown>>
> = ReturnType<typeof createTypedMultiEmitter<ArgsByEventName>>;

export type TypedMultiEventSource<
    ArgsByEventName extends Record<string | number, Array<unknown>>
> = ReturnType<typeof createTypedMultiEmitter<ArgsByEventName>>["source"];
