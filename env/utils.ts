export function bool(x: string) {
  return x === "true";
}

export function num(x: string) {
  const n = Number(x);
  if (Number.isNaN(n)) {
    throw new Error("Expect number string.");
  }
  return n;
}
