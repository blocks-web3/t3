export const numberFormat = (num: number): string => {
  return num.toLocaleString();
};

export const formatIsoString = (val: string): string => {
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "long",
    timeZone: "JST",
  }).format(new Date(val));
};

export const formatIsoStringWithTime = (val: string): string => {
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "long",
    timeZone: "JST",
    timeStyle: "short",
  }).format(new Date(val));
};

export const shortenAddress = (
  val?: string,
  leftWordNum = 6,
  rightWordNum = 6
): string => {
  if (!val) return "";

  if (val.length <= leftWordNum + rightWordNum) return val;

  return (
    val.substring(0, leftWordNum) +
    "..." +
    val.substring(val.length - rightWordNum)
  );
};
