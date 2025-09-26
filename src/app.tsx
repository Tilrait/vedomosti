import { Hono } from "hono";
import { type FC } from "hono/jsx";
import { findNewsByCategory } from "./services/news.service.js";
import * as types from './types.js'


const parseCategories = async (): Promise<string[]> => {
    const response = await fetch('https://www.finanz.ru/novosti');
    const html = await response.text();
    
    const categories = new Set<string>();
    const regex = /<a[^>]*href="\/novosti\/[^"]*"[^>]*>([^<]+)<\/a>/gi;
    
    let match;
    while ((match = regex.exec(html)) !== null) {
        if (match[1]) {
            categories.add(match[1].trim());
        }
    }
    
    return Array.from(categories);
};

const CATEGORIES = ["business", "auto"]

const NewsPage : FC<{ news: types.NewsItem[]}> = (props) => {
    return (
        <body>
            <h1>News</h1>
            <main>
                {props.news.map(item => (
                    <article>
                        {item.enclosure && item.enclosure.url && (
                <img 
                    src={item.enclosure.url} 
                    alt={item.title}
                    width={item.enclosure.width || 300}
                    height={item.enclosure.height || 200}
                />
            )}
                    </article>
                ))}
            </main>
        </body>
    )
}



export const app = new Hono()

app.get('/api/categories', async function getNews(c) {
    // 2 балла
    // вывести JSON со списком категорий 
    // (из CATEGORIES или иного источника данных)
    const result = ['', '']

    return c.json({ result })
})

app.get('/api/news', async function getNews(c) {
    // 1 балл
    // TODO проверять пришедший query-параметр на существование

    // 2 балла
    // разобраться и внедрить
    // валидацию входных значений
    // через zod или альтернативу
    // https://www.npmjs.com/package/@hono/zod-validator
    // еще + 1 балл если провалидируете выходные данные
    // и ошибки

    const { category, limit, offset } = c.req.query()

    if (!category) {
        c.status(404)
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
        
        c.status(500)
        return c.json({ message: "ERROR ON FETCH NEWS" })
    }
})

app.get('/news', async (c) => {
    // 1 балл
    // TODO проверять пришедший query-параметр на существование

    const { category, limit, offset } = c.req.query()

    if (!category) {
        return c.html(<p>Page not found</p>)
    }

    const news = await findNewsByCategory({
        category,
        limit: Number(limit),
        offset: Number(offset)
    })

    return c.html(<NewsPage news={news} />)
})

app.get('/', async (c) => {
    // 3 балла
    return c.html(<p>TODO: вывести список ссылок на категории</p>)
})

app.notFound(function notFound(c) {
    // 1 балл
    // TODO заменить на html
    return c.json({ status: 'NOT FOUND' })
})

export type App = typeof app.route