import { OptionItem } from "@/types/utils";

/**
 * 将 k-v 转为 label-value的数组格式
 * @param obj
 * @returns
 */
export function transEnumToOptions(obj: Record<string, any>): OptionItem[] {
  if (!obj) return [];
  const res = [];
  for (const key in obj) {
    res.push({ label: key, value: obj[key] });
  }
  return res;
}
