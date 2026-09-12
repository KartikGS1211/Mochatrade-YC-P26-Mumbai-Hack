export { cn } from "cn";

export function formatINR(val: number) {
  return val.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}
