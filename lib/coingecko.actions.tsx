'use server'

import qs from 'query-string'

const BASE_URL = process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3'

export async function fetcher<T>(
  endpoint: string,
  params?: Record<string, any>,
  revalidate = 300, // ✅ strong caching for free tier
): Promise<T> {
  const url = qs.stringifyUrl({
    url: `${BASE_URL}/${endpoint}`,
    query: params,
  })

  const response = await fetch(url, {
    next: { revalidate },
  })

  if (!response.ok) {
    const text = await response.text()
    console.error('CoinGecko Error URL:', url)
    console.error('CoinGecko Response:', text)
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}
