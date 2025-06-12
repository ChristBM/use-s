export type PartialDeep<T> = {
  [P in keyof T]?: T[P] extends (...args: unknown[]) => unknown
    ? T[P]
    : T[P] extends object
    ? PartialDeep<T[P]>
    : T[P];
};

export type SetStateAction<T> = PartialDeep<T> | ((prev: T) => PartialDeep<T>);
;
