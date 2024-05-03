"use client"

// Filter ( location )
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAllLocations } from "@/lib/actions/location.actions";
import { ILocation } from "@/lib/database/models/location.model";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const LocationFilter = () => {
  const [locations, setLocation] = useState<ILocation[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const getlocations = async () => {
      const locationList = await getAllLocations();

      locationList && setLocation(locationList as ILocation[])
    }

    getlocations();
  }, [])

  const onSelectLocation = (location: string) => {
      let newUrl = '';

      if(location && location !== 'All') {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'location',
          value: location
        })
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['location']
        })
      }

      router.push(newUrl, { scroll: false });
  }

  return (
    <Select onValueChange={(value: string) => onSelectLocation(value)}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Location" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All" className="select-item p-regular-14">All</SelectItem>

        {locations.map((location) => (
          <SelectItem value={location.name} key={location._id} className="select-item p-regular-14">
            {location.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default LocationFilter