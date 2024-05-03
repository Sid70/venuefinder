"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const PriceFilter = () => {
  const [prices, setPrices] = useState<{ label: string, min: number | null, max: number | null }[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Fetch prices from wherever you get them
    const fetchedPrices = [
        { label: "All", min: null, max: null },
        { label: "Under $1000", min: 1, max: 999 },
        { label: "$1000 - $2000", min: 1000, max: 1999 },
        { label: "$2000 - $5000", min: 2000, max: 4999 },
        { label: "$5000 - $10000", min: 5000, max: 9999 },
        { label: "$10000 Above", min: 10000, max: 999999 }
    ];
    
    setPrices(fetchedPrices);
  }, []);

  const onSelectPrice = (price: string) => {
    let newUrl = '';

    if (price && price !== 'All') {
      const selectedPrice = prices.find(p => p.label === price);
      if (selectedPrice) {
        const { min, max } = selectedPrice;
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'price',
          value: `${min}-${max}`
        });
      }
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ['price']
      });
    }

    router.push(newUrl, { scroll: false });
  }

  return (
    <Select onValueChange={(value: string) => onSelectPrice(value)}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Price" />
      </SelectTrigger>
      <SelectContent>
        {prices.map((price) => (
          <SelectItem value={price.label} key={price.label} className="select-item p-regular-14">
            {price.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default PriceFilter;
