import amber from "@mui/material/colors/amber";
import blue from "@mui/material/colors/blue";
import lime from "@mui/material/colors/lime";
import pink from "@mui/material/colors/pink";
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
      return ["Proposing", blue[300]];
    case "VOTE":
      return ["Accepting Vote", pink[300]];
    case "IMPLEMENTATION":
      return ["On Going", amber[300]];
    case "EVALUATION":
      return ["Evaluating", lime[300]];
    case "COMPLETED":
      return ["Completed", pink[900]];
    case "WITHDRAWAL":
      return ["Withdrawn", blue[900]];
    default:
      return ["", ""];
  }
};
