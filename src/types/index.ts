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

export type GlobalStateConfig<T> = { value: T; key: string };

export type DebugOptions = {
  filterKey?: string;
  consoleLog?: boolean;
};

export type SupportedValueType =
  | "number"
  | "string"
  | "boolean"
  | "bigint"
  | "undefined"
  | "null"
  | "date"
  | "regexp"
  | "set"
  | "map"
  | "array"
  | "object"
  | "function";

  export type ComparisonResponseType = "equals" | "different" | "incompatible";
