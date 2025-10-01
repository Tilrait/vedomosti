import { fetchInfo } from "../data-provider.js";
import * as types from "../types.js";
import { JSDOM } from "jsdom"

export async function findCategories() {
    const categoryHTML = await fetchInfo();
    const dom = new JSDOM(categoryHTML);
    const aElems = dom.window.document.querySelectorAll("a[href^='/']");
    const categories = Array.from(aElems).filter(link => {
        const href = link.href;
        return /^\/[^\/]+$/.test(href)
    })
        .map(link => ({
            title: link.textContent.trim(),
            category: link.href.replace('/', "")
        }))
    return categories
}