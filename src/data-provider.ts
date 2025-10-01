const VEDOMOSTI_BASE_URL = 'https://www.vedomosti.ru'

const VEDOMOSTI_INFO_ENDPOINT = '/info/rss'
const VEDOMOSTI_RUBRICS_ENDPOINT = '/rss/rubric'

export async function fetchInfo() {
    const infoUrl = VEDOMOSTI_BASE_URL + VEDOMOSTI_INFO_ENDPOINT

    try {
        const response = await fetch(infoUrl)
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const xmlText = await response.text()
        return xmlText
    } catch (error) {
        throw error
    }
}

export async function fetchNews(category: string) {
    const newsUrl = VEDOMOSTI_BASE_URL + VEDOMOSTI_RUBRICS_ENDPOINT + `/${category}`

    try {
        const response = await fetch(newsUrl)
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const xmlText = await response.text()
        return xmlText
    } catch (error) {
        throw error
    }
}