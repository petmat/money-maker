export const firstArg = (arg: string | string[]): string =>
  typeof arg === "string" ? arg : arg[0];
