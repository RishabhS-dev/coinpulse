import { fetcher } from '@/lib/coingecko.actions'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Converter from '@/components/Converter'
import CandlestickChart from '@/components/CandlestickChart'

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params

  let coin: CoinMarketData | null = null
  let ohlcData: OHLCData[] = []

  try {
    const [marketRes, ohlc] = await Promise.all([
      fetcher<CoinMarketData[]>(`coins/markets`, {
        vs_currency: 'usd',
        ids: id,
      }),

      fetcher<OHLCData[]>(`coins/${id}/ohlc`, {
        vs_currency: 'usd',
        days: 1,
      }),
    ])

    coin = marketRes[0] ?? null
    ohlcData = ohlc
  } catch (err) {
    console.error('Failed to load coin:', id, err)
  }

  if (!coin) {
    return (
      <main className="p-10 text-center">
        <h2 className="text-xl font-bold">Invalid Coin</h2>
        <p className="mt-2 text-gray-400">
          Please go back and try another coin.
        </p>
        <Link href="/coins" className="text-blue-500 underline mt-4 block">
          Back to All Coins
        </Link>
      </main>
    )
  }

  return (
    <main id="coin-details-page">
      <section className="primary mb-10">
        <CandlestickChart data={ohlcData} coinId={id}>
          <div className="flex items-center gap-4">
            <Image
              src={coin.image}
              alt={coin.name}
              width={40}
              height={40}
            />
            <div>
              <h2 className="text-xl font-bold">{coin.name}</h2>
              <p className="text-gray-400">
                {formatCurrency(coin.current_price)}
              </p>
            </div>
          </div>
        </CandlestickChart>
      </section>

      <section className="secondary">
        <Converter
          symbol={coin.symbol}
          icon={coin.image}
          priceList={{ usd: coin.current_price }}
        />

        <div className="details mt-8">
          <h4 className="mb-4 font-semibold">Coin Details</h4>

          <ul className="details-grid">
            <li>
              <p className="text-sm text-gray-400">Market Cap</p>
              <p className="font-medium">
                {formatCurrency(coin.market_cap)}
              </p>
            </li>

            <li>
              <p className="text-sm text-gray-400">Rank</p>
              <p className="font-medium">#{coin.market_cap_rank}</p>
            </li>

            <li>
              <p className="text-sm text-gray-400">24h Change</p>
              <p className="font-medium">
                {coin.price_change_percentage_24h.toFixed(2)}%
              </p>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}

export default Page
