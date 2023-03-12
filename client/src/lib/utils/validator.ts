import { Member } from "../../api/types/model";
import { Session } from "../../auth/AuthContext";

export const isProjectMember = (members: Member[], session: Session | null) => {
  return members.some((member) => {
    if (!member.project_member_address.startsWith("USER#")) return false;
    return member.project_member_address.substring(5) === session?.address;
  });
};
