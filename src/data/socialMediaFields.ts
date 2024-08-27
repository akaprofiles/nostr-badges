export enum Platforms {
  YouTube = "youtube",
  Twitter = "twitter",
  Facebook = "facebook",
  Instagram = "instagram",
  LinkedIn = "linkedin",
}

export type SocialMediaFields = {
  platform: string;
  identity: string;
  title: string;
  description: string;
  avatar: string;
  url: string;
  followers: number;
  following: number;
  items: number;
  views: number;
  listed: number;
};

export const getEmptySocialMediaFields = () => {
  const result: SocialMediaFields = {
    platform: "",
    identity: "",
    title: "",
    description: "",
    avatar: "",
    url: "",
    followers: 0,
    following: 0,
    items: 0,
    views: 0,
    listed: 0,
  };
  return result;
};

export const isSocialMediaFields = (obj: Record<string, any>): boolean => {
  // Check if the "platform" key exists and its value is one of the Platforms enum values
  return (
    obj.hasOwnProperty("platform") &&
    Object.values(Platforms).includes(obj.platform)
  );
};
