'use server'

import qs from 'query-string'

/**
 * IMPORTANT:
 * In .env.local use:
 *
 * COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
 * COINGECKO_API_KEY=your_key_here
 */

const BASE_URL = process.env.COINGECKO_BASE_URL
const API_KEY = process.env.COINGECKO_API_KEY

if (!BASE_URL) throw new Error('Could not get base url')
if (!API_KEY) throw new Error('Could not get api key')

/**
 * Generic fetcher for CoinGecko API
 */
export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60
): Promise<T> {
  // ✅ Remove accidental leading slash to avoid double //
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
    headers: {
      // ✅ Correct CoinGecko header
      'x-cg-pro-api-key': API_KEY,
      'Content-Type': 'application/json',
    } as Record<string, string>,
    next: { revalidate },
  })

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response
      .json()
      .catch(() => ({}))

    throw new Error(
      `API Error: ${response.status}: ${
        errorBody?.error || response.statusText
      }`
    )
  }

  return response.json()
}

/**
 * Get liquidity pool info
 */
export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null
): Promise<PoolData> {
  const fallback: PoolData = {
    id: '',
    address: '',
    name: '',
    network: '',
  }

  if (network && contractAddress) {
    try {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `onchain/networks/${network}/tokens/${contractAddress}/pools`
      )

      return poolData.data?.[0] ?? fallback
    } catch (error) {
      console.error(error)
      return fallback
    }
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>(
      'onchain/search/pools',
      { query: id }
    )

    return poolData.data?.[0] ?? fallback
  } catch {
    return fallback
  }
}
