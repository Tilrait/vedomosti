import { fetchInfo, VEDOMOSTI_BASE_URL } from "../data-provider.js";
import { JSDOM } from "jsdom";

export async function findCategories(): Promise<
  Array<{ title: string; url: string; category: string }>
> {
  const categoryHTML = await fetchInfo();
  const dom = new JSDOM(categoryHTML);

  // https://www.vedomosti.ru/rss/rubric/...
  const anchors = Array.from(
    dom.window.document.querySelectorAll(
      `a[href^='${VEDOMOSTI_BASE_URL}/rss/rubric/']`
    )
  );

  const items = anchors
    .map((a) => {
      const href = a.getAttribute("href") ?? "";
      const url = href;
      const p = a.closest("p.box-paragraph__text");
      const title = p?.querySelector('strong')?.textContent?.trim() ?? ''
      const match = href.match(/\/rss\/rubric\/([^/]+)\.xml$/);
      const category = match?.[1] ?? "";
      return { url, title, category };
    })
    .filter((item) => item.category);
  console.log(items);
  return items;
}
