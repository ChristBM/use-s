const ISO8601 = /"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z"/g;
const sameFn = () => null;

export function serialize<T>(value: T): string {
  if (value instanceof Date) {
    return JSON.stringify({ __type: "date", value: value.toISOString() }, null, 2);
  }

  return JSON.stringify(
    value,
    (_, v) => {
      if (typeof v === "bigint") return { __type: "bigint", value: v.toString() };
      if (v === undefined) return { __type: "undefined" };
      if (v instanceof Map) return { __type: "map", entries: Array.from(v.entries()) };
      if (v instanceof Set) return { __type: "set", values: Array.from(v.values()) };
      if (v instanceof RegExp) return { __type: "regexp", pattern: v.source, flags: v.flags };
      if (typeof v === "function") return { __type: "function" };
      return v;
    },
    2
  ).replace(ISO8601, match => `{ "__type": "date", "value": ${match} }`);
}

export function deserialize<T>(json: string): T {
  return JSON.parse(json, (_, v) => {
    if (v && v.__type === "bigint") return BigInt(v.value);
    if (v && v.__type === "undefined") return undefined;
    if (v && v.__type === "map") return new Map(v.entries);
    if (v && v.__type === "set") return new Set(v.values);
    if (v && v.__type === "date") return new Date(v.value);
    if (v && v.__type === "regexp") return new RegExp(v.pattern, v.flags);
    if (v && v.__type === "function") return sameFn
    return v;
  });
}
