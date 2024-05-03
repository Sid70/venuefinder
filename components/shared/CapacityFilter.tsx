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

const CapacityFilter = () => {
  const [capacities, setCapacity] = useState<{ label: string, min: number | null, max: number | null }[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Fetch capacity from wherever you get them
    const fetchedcapacity = [
        { label: "All", min: null, max: null },
        { label: "Under 100 Guests", min: 0, max: 100 },
        { label: "101 - 200 Guests", min: 101, max: 200 },
        { label: "201 - 300 Guests", min: 201, max: 300 },
        { label: "301 - 500 Guests", min: 301, max: 500 },
        { label: "501 - 1000 Guests", min: 501, max: 1000 },
        { label: "1000+ Guests", min: 1001, max: 999999 }
    ];
    
    setCapacity(fetchedcapacity);
  }, []);

  const onSelectCapacity = (capacity: string) => {
    let newUrl = '';

    if (capacity && capacity !== 'All') {
      const selectedCapacity = capacities.find(c => c.label === capacity);
      if (selectedCapacity) {
        const { min, max } = selectedCapacity;
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'capacity',
          value: `${min}-${max}`
        });
      }
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ['capacity']
      });
    }

    router.push(newUrl, { scroll: false });
  }

  return (
    <Select onValueChange={(value: string) => onSelectCapacity(value)}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Capacity" />
      </SelectTrigger>
      <SelectContent>
        {capacities.map((capacity) => (
          <SelectItem value={capacity.label} key={capacity.label} className="select-item p-regular-14">
            {capacity.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default CapacityFilter;
