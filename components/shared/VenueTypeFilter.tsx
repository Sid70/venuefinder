"use client"

// Filter ( VenueType )
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAllVenueType } from "@/lib/actions/venuetype.actions";
import { IVenueType } from "@/lib/database/models/venuetype.model";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const venueTypeFilter = () => {
  const [venueTypes, setvenueType] = useState<IVenueType[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const getvenueTypes = async () => {
      const venueTypeList = await getAllVenueType();

      venueTypeList && setvenueType(venueTypeList as IVenueType[])

    }

    getvenueTypes();
  }, [])

  const onSelectvenueType = (venueType: string) => {
      let newUrl = '';

      if(venueType && venueType !== 'All') {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'venueType',
          value: venueType
        })
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['venueType']
        })
      }

      router.push(newUrl, { scroll: false });
  }

  return (
    <Select onValueChange={(value: string) => onSelectvenueType(value)}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Venue Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All" className="select-item p-regular-14">All</SelectItem>

        {venueTypes.map((venueType) => (
          <SelectItem value={venueType.name} key={venueType._id} className="select-item p-regular-14">
            {venueType.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default venueTypeFilter