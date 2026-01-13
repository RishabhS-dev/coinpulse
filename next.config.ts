import { clsx, type ClassValue } from "clsx";
import type { NextConfig } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]){
  return twMerge(clsx(inputs))
}

export function formatCurrency(value:number,
  currency:string='USD', locale:string='en-US' ){
  return new Intl.NumberFormat(locale, {
    style:'currency',
    currency:currency,
  }).format(value);
}



const nextConfig: NextConfig = {
  /* config options here */images:{
    remotePatterns:[{
      protocol: "https",
      hostname: "assets.coingecko.com"
    },
    {
      protocol: "https",
      hostname:"coin-images.coingecko.com",
    }
  ]

  }
};

export default nextConfig;
