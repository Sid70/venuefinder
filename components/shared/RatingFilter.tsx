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

const RatingFilter = () => {
  const [ratings, setRatings] = useState<{ label: string, min: number | null, max: number | null }[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Fetch Ratings from wherever you get them
    const fetchedRatings = [
        { label: "All", min: null, max: null },
        { label: "Under 1★ and above 0★", min: 0.1, max: 0.9 },
        { label: "Between 1 and 2★", min: 1, max: 1.9 },
        { label: "Between 2 and 3★", min: 2, max: 2.9 },
        { label: "Between 3 and 4★", min: 3, max: 3.9 },
        { label: "Between 4 and 5★", min: 4, max: 4.9 },
        { label: "5★", min: 5, max: 5 },
    ];
    
    setRatings(fetchedRatings);
  }, []);

  const onSelectRating = (rating: string) => {
    let newUrl = '';

    if (rating && rating !== 'All' && rating ) {
      const selectedRating = ratings.find(p => p.label === rating);
      if (selectedRating) {
        const { min, max } = selectedRating;
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'rating',
          value: `${min}-${max}`
        });
      }
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ['rating']
      });
    }

    router.push(newUrl, { scroll: false });
  }

  return (
    <Select onValueChange={(value: string) => onSelectRating(value)}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Rating" />
      </SelectTrigger>
      <SelectContent>
        {ratings.map((rating) => (
          <SelectItem value={rating.label} key={rating.label} className="select-item p-regular-14">
            {rating.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default RatingFilter;
