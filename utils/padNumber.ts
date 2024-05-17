export default function (num: number): string {
  return num.toString().padStart(3, "0");
}
