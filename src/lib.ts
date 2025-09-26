import type { InputParams } from "./types.js";

const BASE_URL = 'http://localhost:3000'

export function buildUrl(params: InputParams) {
    const { category, limit, offset } = params

    const url = new URL(`${BASE_URL}/${category}`)

    const queryParams = new URLSearchParams()

    if (limit !== undefined && offset !== undefined) {
        queryParams.set('limit', String(limit))
        queryParams.set('offset', String(offset))
    }

    return `${url.toString()}${queryParams.toString()}`
}