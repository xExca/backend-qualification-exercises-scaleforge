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
  /**
   * insert your code here
   */
  
  return;
}
