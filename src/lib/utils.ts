export { cn } from "cn";

export function formatINR(val?: number | null) {
  return (typeof val === "number" && !isNaN(val) ? val : 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}
