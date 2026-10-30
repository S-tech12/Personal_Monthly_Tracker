export interface FamilyMember {
  _id: string;
  name: string;
  email: string;
  profilePictureUrl?: string;
  isHead: boolean;
}

export interface FamilyOverview {
  hasFamily: boolean;
  isHead: boolean;
  headInfo: FamilyMember | null;
  members: FamilyMember[];
}

export interface PendingInvite {
  _id: string;
  invitedByUserId: {
    name: string;
    email: string;
    profilePictureUrl?: string;
  };
  invitedEmail: string;
  createdAt: string;
}

export interface SentInvite {
  _id: string;
  invitedEmail: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  respondedAt: string | null;
}
