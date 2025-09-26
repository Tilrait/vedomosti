export type RssItem = {
  title: string;
  link: string;
  category: string;
  description?: string;
  pubDate: string;
};

export type NewsItem = Required<Omit<RssItem, "pubDate">> & {
  published_at: string;
}

export type InputParams = {
  category: string;
  limit?: number;
  offset?: number;
};
