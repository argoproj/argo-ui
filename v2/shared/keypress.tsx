import * as React from 'react';

export enum Key {
    TAB = 9,
    ENTER = 13,
    SHIFT = 16,
    ESCAPE = 27,
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40,
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90,
    SLASH = 191,
    QUESTION = 191,
}

export enum NumKey {
    ZERO = 48,
    ONE = 49,
    TWO = 50,
    THREE = 51,
    FOUR = 52,
    FIVE = 53,
    SIX = 54,
    SEVEN = 55,
    EIGHT = 56,
    NINE = 57,
}

export enum NumPadKey {
    ZERO = 96,
    ONE = 97,
    TWO = 98,
    THREE = 99,
    FOUR = 100,
    FIVE = 101,
    SIX = 102,
    SEVEN = 103,
    EIGHT = 104,
    NINE = 105,
}

export type AnyNumKey = NumKey | NumPadKey;
export type AnyKeys = AnyNumKey | Key | (AnyNumKey | Key)[];

// useNav adds simple stateful navigation to your component
// Returns:
//   - pos: indicates current position
//   - nav: fxn that accepts an integer that represents number to increment/decrement pos
//   - reset: fxn that sets current position to -1
// Accepts:
//   - upperBound: maximum value that pos can grow to
//   - init: optional initial value for pos

export const useNav = (upperBound: number, init?: number): [number, (n: number) => boolean, () => void] => {
    const [pos, setPos] = React.useState(init || -1);
    const isInBounds = (p: number): boolean => p < upperBound && p > -1;

    const nav = (val: number): boolean => {
        const newPos = pos + val;
        return isInBounds(newPos) ? setPos(newPos) === null : false;
    };

    const reset = () => {
        setPos(-1);
    };

    return [pos, nav, reset];
};

export interface KeyState { action: KeyAction; pressed: boolean; group: number; target?: React.MutableRefObject<any> | React.MutableRefObject<any>[]; }
export type KeyAction = (keyCode?: number) => boolean;
export interface KeyMap { [key: number]: KeyState; }
export type KeyHandler = (e: KeyboardEvent) => null;

export type KeyFxn = (props: KeyFxnProps) => void;
export interface KeyFxnProps {
    keys: AnyKeys;
    action: KeyAction;
    combo?: boolean;
    target?: React.MutableRefObject<any> | React.MutableRefObject<any>[];
}

export interface GroupMap {
    groupForKey: {[key: number]: number};
    groups: {[group: number]: KeyMap};
    index: number;
}

const handlePress = (e: KeyboardEvent, state: GroupMap) => {
    const {groups, groupForKey} = state;
    const g = groupForKey[e.keyCode];

    if (groups[g]) {
        let allPressed = true;
        groups[g][e.keyCode].pressed = true;

        for (const i of Object.keys(groups[g])) {
            const k = parseInt(i, 10);
            const key = groups[g][k];

            if (!key.pressed) {
                allPressed = false;
            }
        }

        const targetProp = groups[g][e.keyCode]?.target;
        if (Array.isArray(targetProp)) {
            const targets = targetProp as React.MutableRefObject<any>[];
            targets.every((aTarget) => {
                return checkTarget(allPressed, aTarget?.current, e, groups[g]);
            });
        } else {
            const target = targetProp as React.MutableRefObject<any>;
            checkTarget(allPressed, target?.current, e, groups[g]);

        }
    }
};

const checkTarget = (allPressed: boolean, curTarget: any, e: KeyboardEvent, groupKeyMap: KeyMap): boolean => {
    if (allPressed && (curTarget === e.target || (!curTarget && e.target === document.body))) {
        const prevent = groupKeyMap[e.keyCode].action(e.keyCode);
        if (prevent) {
            e.preventDefault();
        }
        return false;
    }
    return true;
};

const handleKeyUp = (e: KeyboardEvent, state: GroupMap) => {
    const {groups, groupForKey} = state;
    const g = groupForKey[e.keyCode];
    if (groups[g]) {
        groups[g][e.keyCode].pressed = false;
    }
};

const useKeyListen = (state: GroupMap) => {
    const localKeyPress = (e: KeyboardEvent) => handlePress(e, state);
    const localKeyUp = (e: KeyboardEvent) => handleKeyUp(e, state);

    React.useEffect(() => {
        document.addEventListener('keydown', localKeyPress);
        document.addEventListener('keyup', localKeyUp);
        return () => {
            document.removeEventListener('keydown', localKeyPress);
            document.removeEventListener('keyup', localKeyUp);
        };
    }, [state]);
};

export const useKeyListener = () => {
    let state = NewGroupMap();
    useKeyListen(state);
    return (keys: AnyKeys, action: KeyAction, combo?: boolean) => {
        state = addKeybinding(state, {keys, action, combo});
    };
};

export const useSharedKeyListener = (): GroupMap => {
    const state = NewGroupMap();
    useKeyListen(state);
    return state;
};

const NewGroupMap = () => {
    const groupForKey = {} as {[key: number]: number};
    const groups = {} as {[group: number]: KeyMap};
    return {
        groups,
        groupForKey,
        index: 0,
    };
};

export const addKeybinding = (state: GroupMap, props: KeyFxnProps): GroupMap => {
    const {groups, groupForKey} = state;
    const {keys, action, combo, target} = props;

    let index = state.index;
    if (Array.isArray(keys)) {
        let g = index;
        for (const key of keys) {
            // create association between this key and its group
            groupForKey[key] = index;

            if (!groups[g]) {
                groups[index] = {} as KeyMap;
            }

            groups[index][key] = {
                group: g,
                action,
                pressed: false,
                target,
            };

            if (!combo) {
                g = g + 1;
            }
        }
        index = g + 1;
    } else {
        groupForKey[keys] = index;

        if (!groups[index]) {
            groups[index] = {} as KeyMap;
        }

        groups[index][keys] = {
            group: index,
            action,
            pressed: false,
            target,
        };

        index = index + 1;
    }

    return {groups, groupForKey, index};
};

export const NumKeyToNumber = (key: AnyNumKey): number => {
    if (key > 47 && key < 58) {
        return key - 48;
    } else if (key > 95 && key < 106) {
        return key - 96;
    }
    return -1;
};

export const KeybindingContext = React.createContext<{
    keybindingState: GroupMap;
    useKeybinding: KeyFxn;
}>({
    keybindingState: NewGroupMap(),
    useKeybinding: (props: KeyFxnProps) => null,
});

export const KeybindingProvider = (props: {children: React.ReactNode}) => {
    let keybindingState: GroupMap = useSharedKeyListener();

    const useKeybinding = (aProps: KeyFxnProps) => {
        keybindingState = addKeybinding(keybindingState, aProps);
    };

    return <KeybindingContext.Provider value={{keybindingState, useKeybinding}}>{props.children}</KeybindingContext.Provider>;
};
