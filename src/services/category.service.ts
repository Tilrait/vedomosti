import { fetchInfo } from "../data-provider.js";
import * as types from "../types.js";

export async function findCategories() {
  const categoryHTML = await fetchInfo();

    
}

findCategories()