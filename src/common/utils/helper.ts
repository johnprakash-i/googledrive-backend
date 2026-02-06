export function getSingleParam(param: string | string[] | undefined, name: string): string {
  if (!param) throw new Error(`${name} is required`)
  return Array.isArray(param) ? param[0] : param
}