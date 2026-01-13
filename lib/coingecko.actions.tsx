'use server'

import qs from 'query-string'

type QueryParams = Record<string, string | number | undefined>

const BASE_URL = process.env.COINGECKO_BASE_URL

if (!BASE_URL) {
  throw new Error('Missing COINGECKO_BASE_URL in .env.local')
}

/**
 * Public CoinGecko Fetcher (FREE PLAN SAFE)
 */
export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60
): Promise<T> {
  // remove accidental leading slash
  const safeEndpoint = endpoint.startsWith('/')
    ? endpoint.slice(1)
    : endpoint

  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${safeEndpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true }
  )

  const response = await fetch(url, {
    next: { revalidate },
  })

  if (!response.ok) {
    const text = await response.text()
    console.error('CoinGecko Error URL:', url)
    console.error('CoinGecko Response:', text)
    throw new Error(
      `API Error: ${response.status} ${response.statusText}`
    )
  }

  return response.json()
}

/**
 * PRO FEATURE DISABLED (Free plan)
 */
export async function getPools() {
  return null
}
