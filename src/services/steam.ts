import axios from "axios";

const STEAM_API_BASE_URL = "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2";

interface SteamNewsResponse {
  appnews: {
    appid: number;
    count: number;
    newsitems: Array<{
      gid: string;
      url: string;
      date: number;
      title: string;
      appid: number;
      author: string;
      contents: string;
      feedname: string;
      feedlabel: string;
      feed_type: number;
      is_external_url: boolean;
    }>;
  };
}

export class SteamService {
  private static readonly APOGEIA_APP_ID = 2796220;

  static async getNews(count: number = 10): Promise<SteamNewsResponse> {
    try {
      const response = await axios.get(STEAM_API_BASE_URL, {
        params: {
          count,
          maxlength: 300,
          appid: this.APOGEIA_APP_ID,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch Steam news: ${error.message}`);
      }
      throw error;
    }
  }
}
