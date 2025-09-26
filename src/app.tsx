import { Hono } from "hono";
import { type FC } from "hono/jsx";
import { findNewsByCategory } from "./services/news.service.js";
import * as types from './types.js'

const NewsPage: FC<{ news: types.NewsItem[] }> = (props: {
    news: types.NewsItem[]
}) => {
    return (
        <body>
            <h1>News</h1>
            <main>
                {props.news.map(item => <h3>{item.title}</h3>)}
            </main>
        </body>
    )
}

export const app = new Hono()

app.get('/news', async function getNews(c) {
    const { category, limit, offset } = c.req.query()

    if (!category) {
        return c.json({ message: 'CATEGORY NOT FOUND' })
    }

    try {
        const result = await findNewsByCategory({
            category,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : 0
        })

        return c.json({ result })
    } catch (error) {
        console.error(error)
        return c.json({ message: "ERROR ON FETCH NEWS" })
    }
})

app.get('/', async (c) => {
    const news = await findNewsByCategory({
        category: "business",
        limit: 20,
        offset: 0
    })
    return c.html(<NewsPage news={news} />)
})

app.notFound(function notFound(c) {
    return c.json({ status: 'NOT FOUND' })
})

export type App = typeof app.route