export type SocialPlatform =
  | "TWITTER"
  | "INSTAGRAM"
  | "FACEBOOK"
  | "LINKEDIN"
  | "TIKTOK"
  | "YOUTUBE"
  | "THREADS"
  | "PINTEREST";

export type PostStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "PUBLISHING"
  | "PUBLISHED"
  | "FAILED"
  | "ARCHIVED";

export type MemberRole = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

export type NotificationType =
  | "POST_PUBLISHED"
  | "POST_FAILED"
  | "POST_SCHEDULED"
  | "TEAM_INVITE"
  | "TEAM_JOINED"
  | "AI_CREDITS_LOW"
  | "ACCOUNT_DISCONNECTED"
  | "SYSTEM";

export interface WorkspaceUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: MemberRole;
}

export interface SocialAccountUI {
  id: string;
  platform: SocialPlatform;
  username: string;
  displayName: string;
  avatar: string | null;
  isActive: boolean;
  followers?: number;
}

export interface PostUI {
  id: string;
  content: string;
  mediaUrls: string[];
  status: PostStatus;
  scheduledAt: string | null;
  publishedAt: string | null;
  platforms: SocialPlatform[];
  author: { name: string | null; image: string | null };
  aiGenerated: boolean;
}

export interface NotificationUI {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalPosts: number;
  scheduledPosts: number;
  publishedPosts: number;
  totalAccounts: number;
  totalEngagements: number;
  totalReach: number;
  aiCreditsUsed: number;
  aiCreditsTotal: number;
}

export interface CalendarPost {
  id: string;
  content: string;
  scheduledAt: string;
  status: PostStatus;
  platforms: SocialPlatform[];
  mediaUrls: string[];
}

export const PLATFORM_META: Record<
  SocialPlatform,
  { label: string; color: string; textColor: string; icon: string }
> = {
  TWITTER: { label: "Twitter / X", color: "#1da1f2", textColor: "#fff", icon: "twitter" },
  INSTAGRAM: { label: "Instagram", color: "#e1306c", textColor: "#fff", icon: "instagram" },
  FACEBOOK: { label: "Facebook", color: "#1877f2", textColor: "#fff", icon: "facebook" },
  LINKEDIN: { label: "LinkedIn", color: "#0a66c2", textColor: "#fff", icon: "linkedin" },
  TIKTOK: { label: "TikTok", color: "#ff0050", textColor: "#fff", icon: "tiktok" },
  YOUTUBE: { label: "YouTube", color: "#ff0000", textColor: "#fff", icon: "youtube" },
  THREADS: { label: "Threads", color: "#101010", textColor: "#fff", icon: "threads" },
  PINTEREST: { label: "Pinterest", color: "#e60023", textColor: "#fff", icon: "pinterest" },
};
