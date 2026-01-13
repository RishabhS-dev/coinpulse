import React from 'react'
import { fetcher } from '@/lib/coingecko.actions'
import { formatCurrency } from '@/lib/utils'
import Converter from '@/components/Converter'
import CandlestickChart from '@/components/CandlestickChart'

type PageProps = {
  params: {
    id: string
  }
}

const Page = async ({ params }: PageProps) => {
  const id = params.id   // ✅ DO NOT make this optional

  let coinData: CoinDetailsData
  let coinOHLCData: OHLCData[] = []

  try {
    ;[coinData, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>(`coins/${id}`, undefined, 300),
      fetcher<OHLCData[]>(`coins/${id}/ohlc`, {
        vs_currency: 'usd',
        days: 1,
      }, 300),
    ])
  } catch (error) {
    console.error('Failed to load coin:', error)

    return (
      <main className="p-10 text-center">
        <h2>Failed to load coin data</h2>
        <p>Please refresh or try again later.</p>
      </main>
    )
  }

  return (
    <main id="coin-details-page">
      <section className="primary">
        <CandlestickChart data={coinOHLCData} coinId={id}>
          <h2 className="text-xl font-bold">
            {coinData.name}
          </h2>
        </CandlestickChart>
      </section>

      <section className="secondary">
        <Converter
          symbol={coinData.symbol}
          icon={coinData.image.small}
          priceList={coinData.market_data.current_price}
        />

        <div className="mt-4">
          <p>
            Market Cap:{' '}
            {formatCurrency(
              coinData.market_data.market_cap.usd
            )}
          </p>
        </div>
      </section>
    </main>
  )
}

export default Page
