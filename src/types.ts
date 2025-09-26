export type RssItem = {
  title: string;
  link: string;
  category: string;
  description?: string;
  pubDate: string;
  enclosure?: {
    url: string;
    width?: number;
    height?: number;
  };
};

export type NewsItem = Required<Omit<RssItem, "pubDate">> & {
  published_at: string;
}

export type InputParams = {
  category: string;
  limit?: number;
  offset?: number;
};
