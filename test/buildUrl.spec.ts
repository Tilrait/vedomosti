import { expect, test } from 'vitest'
import { buildUrl } from "../src/lib.ts";

test('correct build urls without query parameters', () => {
    const input = { category: "business" }
    const expected = 'http://localhost:3000/business'
    expect(buildUrl(input)).toBe(expected)
})