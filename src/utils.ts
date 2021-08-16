export function simpleClone(obj: any) {
  if (obj == null) {
    return null;
  }
  return JSON.parse(JSON.stringify(obj));
}
