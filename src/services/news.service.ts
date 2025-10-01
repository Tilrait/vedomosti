import { XMLParser } from "fast-xml-parser"
import { fetchNews } from "../data-provider.js"
import * as types from '../types.js'

type FindNewsProps = {
    category: string,
    limit: number | undefined,
    offset: number
}

export async function findNewsByCategory({ category, limit, offset }: FindNewsProps) {
    const newsXml = await fetchNews(category)

    const xmlParser = new XMLParser({ignoreAttributes: false, attributeNamePrefix: "" })
    const parsedObject = xmlParser.parse(newsXml)
    
    const news: types.NewsItem[] = parsedObject.rss.channel.item
        .map((item: types.RssItem): types.NewsItem => ({
            title: item.title,
            link: item.link,
            category: item.category,
            description: item.description ?? "",
            published_at: item.pubDate,
            enclosure: item.enclosure ?? { url: ''}
        }))

    if (limit && limit > 0) {
        return news.slice(offset, limit + offset)
    }

    return news
}