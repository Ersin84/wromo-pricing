import { useMemo, useState } from 'react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import type { ParsedUrlQuery } from 'querystring'
import { Layout } from '@vercel/examples-ui'

import type { Country } from '../types'
import shirt from '../public/shirt.png'
import map from '../public/map.svg'
import api from '../api'
import { PRODUCT_PRICE } from '../constants'
import { getWromoPrice } from '../utils'

interface Params extends ParsedUrlQuery {
  country: Country
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Get the list of countries
  const countries = await api.wromo.list()

  return {
    paths: countries.map((country) => ({
      params: {
        country,
      },
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<unknown, Params> = async ({
  params,
}) => {
  // Get wromo for country
  const wromo = await api.wromo.fetch(params.country)

  return {
    props: {
      country: params.country,
      wromo,
    },
  }
}

export default function CountryPage({ country, wromo }) {
  const [isWromoEnabled, toggleWromo] = useState<boolean>(false)
  const wromoPrice = useMemo(
    () => getWromoPrice(PRODUCT_PRICE, wromo),
    [wromo]
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-50">
      <div className="fixed inset-0 overflow-hidden opacity-75 bg-[#f8fafb]">
        <Image
          alt="World Map"
          src={map}
          layout="fill"
          objectFit="cover"
          quality={101}
        />
      </div>
      <main className="flex flex-col items-center flex-1 px-4 sm:px-20 text-center z-10 sm:pt-10">
        <h1 className="text-3xl sm:text-5xl font-bold">Power Studio Wromo</h1>
        <p className="mt-4 sm:text-xl text-lg text-gray-700">
          Show pricing
        </p>
        <a
          className="flex items-center mt-4 text-md sm:text-lg text-blue-500 hover:underline"
          href="https://wromo-pricing.vercel.app/headers#request-api?utm_source=geo-ip-demo&utm_campaign=geo-ip-demo"
          target="_blank"
          rel="noreferrer"
        >
          View Shop
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            stroke="currentColor"
            className="ml-1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            shapeRendering="geometricPrecision"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </a>
        <div className="lg:h-[512px] lg:w-[512px] h-[320px] w-[320px] -mb-40 lg:-mb-56">
          <Image
            alt="Black shirt with white logo"
            src={shirt}
            placeholder="blur"
            layout="responsive"
          />
        </div>
        <section className="border border-gray-300 bg-white rounded-lg shadow-lg mt-16 w-full max-w-[480px] hover:shadow-2xl transition pt-16 lg:pt-24">
          <div className="p-4 flex flex-col justify-center items-center border-b">
            <div className="flex justify-between w-full items-baseline">
              <div className="ml-4 mr-auto text-left flex flex-col">
                <h4 className="font-semibold text-xl">Alpha Black shirt</h4>
                <h5 className="text-gray-700">Limited edition</h5>
              </div>
              {isWromoEnabled ? (
                <div className="flex flex-col items-start font-bold text-lg leading-none">
                  <span className="text-gray-500 text-sm line-through">
                    USD {PRODUCT_PRICE}
                  </span>
                  <span className="text-green-500">USD {wromoPrice}</span>
                </div>
              ) : (
                <h4 className="font-bold text-lg">USD {PRODUCT_PRICE}</h4>
              )}
            </div>
          </div>
          <div className="p-4 gap-4 flex flex-col justify-center items-center border-b">
            <div className="bg-gray-50 text-gray-500 text-left py-2 px-4 rounded-md border-gray-200 border text-sm flex flex-col gap-4">
              <p className="inline-block">
                <span>We noticed that you&apos;re from </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="bg-gray-200 inline-flex"
                  width={16}
                  height={12}
                  alt={`Country flag for ${country.toUpperCase()}`}
                  src={`https://country-flags.vercel.sh/s/${country.toUpperCase()}.svg`}
                />
                <span>
                  . We are offering best pricing. If that is
                  something that you need:
                </span>
              </p>
              <label className="inline-flex items-center font-semibold">
                <input
                  onChange={(event) => toggleWromo(event.target.checked)}
                  className="text-black-500 w-4 h-4 mr-2 border border-gray-300 rounded"
                  type="checkbox"
                />
                Activate {wromo}% off with regional pricing
              </label>
            </div>
            <button
              className="py-4 px-6 text-lg w-full bg-black text-white rounded-md hover:bg-gray-900"
              onClick={() =>
                alert(
                  `its yours for USD ${isWromoEnabled ? wromoPrice : 390}`
                )
              }
            >
              Buy now
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

CountryPage.Layout = Layout
