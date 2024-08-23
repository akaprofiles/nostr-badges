"use server";

import {
  Platforms,
  SocialMediaFields,
  getEmptySocialMediaFields,
} from "@/data/socialMediaFields";
const apiKey = process.env.YOUTUBE_API_KEY;

interface GetChannelResult {
  success: boolean;
  error: string;
  fields: SocialMediaFields;
}

const getChannel = async (handle: string): Promise<GetChannelResult> => {
  const result = {
    success: false,
    error: "",
    fields: getEmptySocialMediaFields(),
  };

  if (!handle || Array.isArray(handle)) {
    result.success = false;
    result.error = "handle not found in Channel URL";
    return result;
  }

  try {
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${handle}&key=${apiKey}`
    );
    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      result.success = false;
      result.error = `channel for ${handle} not found`;
      return result;
    }

    const snippet = channelData.items[0].snippet;
    const statistics = channelData.items[0].statistics;
    result.success = true;

    result.fields.platform = Platforms.YouTube;
    result.fields.identity = handle;
    result.fields.title = snippet.title;
    result.fields.description = snippet.description as string;
    result.fields.url = snippet.customUrl;
    result.fields.avatar = snippet.thumbnails.default;

    if (statistics) {
      result.fields.followers = statistics.subscriberCount;
      result.fields.items = statistics.videoCount;
      result.fields.views = statistics.viewCount;
    }

    console.log(snippet);
    console.log(result);
    return result;
  } catch (error) {
    result.success = false;
    result.error = JSON.stringify(error);

    return result;
  }
};

export default getChannel;
