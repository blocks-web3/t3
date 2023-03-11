export const numberFormat = (num: number): string => {
  return num.toLocaleString();
};

export const formatIsoString = (val: string): string => {
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "long",
    timeZone: "JST",
  }).format(new Date(val));
};
