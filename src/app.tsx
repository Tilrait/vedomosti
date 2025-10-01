import { Hono } from "hono";
import { type FC } from "hono/jsx";
import { findNewsByCategory } from "./services/news.service.js";
import { findCategories } from "./services/category.service.js";
import * as types from "./types.js";

// 2 балла за программный парсинг категорий со страницы с информацией
const CATEGORIES = await findCategories();

const NewsPage: FC<{ news: types.NewsItem[] }> = (props) => {
  return (
    <body>
      <h1>News</h1>
      <main>
        {props.news.map((item) => (
          <article>
            <h3>{item.title}</h3>
            <button>Delete me</button>
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
  );
};

export const app = new Hono();

app.get("/api/categories", async function getNews(c) {
  // 2 балла
  // вывести JSON со списком категорий
  // (из CATEGORIES или иного источника данных)
  const result = CATEGORIES;

  return c.json({ result: result });
});

app.get("/api/news", async function getNews(c) {

  // еще + 1 балл если провалидируете выходные данные
  // и ошибки

  const { category, limit, offset } = c.req.query();

  if (!category) {
    c.status(400);
    return c.json({ message: "Не задана категория" });
  }

  if (!CATEGORIES.find(cat => cat.category === category )) {
    c.status(404);
    return c.json({ message: "Категория не найдена (нет в списке)" });
  }

  const validatedLimit = limit ? Number(limit) : undefined; // NaN, число, undefined
  const validatedOffset = offset ? Number(offset) : 0; // Число, NaN

  if (
    (validatedLimit !== undefined &&
      (Number.isNaN(validatedLimit) || validatedLimit < 0)) ||
    Number.isNaN(validatedOffset) ||
    validatedOffset < 0
  ) {
    c.status(400);
    return c.json({ message: "Не правильные параметры поиска" });
  }

  try {
    const result = await findNewsByCategory({
      category,
      limit: validatedLimit,
      offset: validatedOffset,
    });

    return c.json({ result });
  } catch (error) {
    console.error(error);

    c.status(500);
    return c.json({ message: "ERROR ON FETCH NEWS" });
  }
});

app.get("/news", async (c) => {

  const { category, limit, offset } = c.req.query();

  if (!category || !CATEGORIES.includes(category)) {
    return c.html(<p>Page not found</p>);
  }
//
  const validatedLimit = limit ? Number(limit) : undefined; // NaN, число, undefined
  const validatedOffset = offset ? Number(offset) : 0; // Число, NaN

  if (
    (validatedLimit !== undefined &&
      (Number.isNaN(validatedLimit) || validatedLimit < 0)) ||
    Number.isNaN(validatedOffset) ||
    validatedOffset < 0
  ) {
    return c.html(<p>Не правильные параметры</p>);
  }

  const news = await findNewsByCategory({
    category,
    limit: validatedLimit,
    offset: validatedOffset,
  });

  return c.html(<NewsPage news={news} />);
});

app.get("/", async (c) => {
  // 3 балла
  return c.html(<p>TODO: вывести список ссылок на категории</p>);
});

app.notFound(function notFound(c) {
  return c.html(<p>Не найдено</p>);
});

export type App = typeof app.route;
