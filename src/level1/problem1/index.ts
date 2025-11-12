export type Value = string | number | boolean | null | undefined |
  Date | Buffer | Map<unknown, unknown> | Set<unknown> |
  Array<Value> | { [key: string]: Value };

/**
 * Transforms JavaScript scalars and objects into JSON
 * compatible objects.
 */
export function serialize(value: Value): unknown {
  // This if statement catches the most of the primitive types and null
  if(value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === undefined) {
    return value;
  }
  // The if statement will check if the value is a Map, Set, Buffer
  // This return a type of Map and value of an array
  if(value instanceof Map) {
    return { __t: "Map", __v: Array.from(value.entries()) };
  }
  if(value instanceof Set) {
    return { __t: "Set", __v: Array.from(value) };
  }
  if(value instanceof Buffer) {
    return { __t: "Buffer", __v: Array.from(value) };
  }
  // The return value of number in milliseconds
  if(value instanceof Date) {
    return { __t: "Date", __v: value.getTime() };
  }

  // If the value is an array it would map each and use the current function to check each type
  if(Array.isArray(value)) { 
    return value.map(serialize);
  }
  // Since other type is already filtered, this will check for the objects
  // This will do a for loop and create a new object but check it with the current function
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value)) {
    out[key] = serialize(val as Value);
  }
  return out;
}

/**
 * Transforms JSON compatible scalars and objects into JavaScript
 * scalar and objects.
 */
export function deserialize<T = unknown>(value: unknown): T {
  // This if statement catches the most of the primitive types
  if(value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean" ||value === undefined) {
    return value as T;
  }
  // val is a temporary variable
  const val = value as any;

  // It will check the map and deserialize each key and value pair
  if(val.__t === "Map") {
    return new Map(
      val.__v.map(([k, val]: [unknown, unknown]) => [
        deserialize(k),
        deserialize(val),
      ])
    ) as T;
  }

  // It will check the set and deserialize each element
  if(val.__t === "Set") {
    return new Set(val.__v.map(deserialize)) as T;
  }
  // It will check the Buffer and deserialize
  if(val.__t === "Buffer") {
    return Buffer.from(val.__v) as T;
  }
  // If the type is a date
  // It will check the date and deserialize
  if(val.__t === "Date") {
    return new Date(val.__v) as T;
  }

  // If the value is an array it will map each and use the current function to check each type
  if(Array.isArray(val)) {
    return val.map(deserialize) as T;
  }
  
  // Since other type is already filtered, this will check for the objects
  // This will do a for loop and create a new object but check it with the current function
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(val)) {
    out[key] = deserialize(value as unknown);
  }
  return out as T;
  
}
