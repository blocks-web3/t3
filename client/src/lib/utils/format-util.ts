import { Member } from "../../api/types/model";

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

export const resolveProjectMembers = (members: Member[]) => {
  let result = "";
  members
    .sort((a, b) => (b.member_role === "PROPOSER" ? 1 : -1))
    .forEach((member: Member) => {
      if (result) {
        result += ", ";
      }
      switch (member.member_role) {
        case "PROPOSER":
          result += `P.${member.member_name}`;
          break;
        case "COLLABORATOR":
          result += `C.${member.member_name}`;
          break;
        default:
          result += `${member.member_name}`;
          break;
      }
    });
  return result;
};

export const resolveStatus = (status: string) => {
  switch (status) {
    case "PROPOSAL":
      return "Proposing";
    case "VOTE":
      return "Accepting Vote";
    case "IMPLEMENTATION":
      return "Project On Going";
    case "EVALUATION":
      return "Accepting Evaluation";
    case "COMPLETED":
      return "Project Completed";
    case "WITHDRAWAL":
      return "Project Withdrawn";
    default:
      break;
  }
};
