export type PartialDeep<T> = {
  [P in keyof T]?: T[P] extends (...args: unknown[]) => unknown
    ? T[P]
    : T[P] extends object
    ? PartialDeep<T[P]>
    : T[P];
};

export type SetStateAction<T> = PartialDeep<T> | ((prev: T) => PartialDeep<T>);

export type Listener = () => void;

export type StateEntry<T> = {
  value: T;
  listeners: Set<Listener>;
};

export type GlobalConfig<T> = { value: T; key: string };

export type DebugOptions = {
  filterKey?: string;
  withConsoleTable?: boolean;
};

export type SupportedValueType =
  | "number"
  | "string"
  | "boolean"
  | "undefined"
  | "null"
  | "date"
  | "regexp"
  | "set"
  | "map"
  | "array"
  | "object";
