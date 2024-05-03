import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { ILocation } from "@/lib/database/models/location.model"
  import { startTransition, useEffect, useState } from "react"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Input } from "../ui/input"
  import { createLocation, getAllLocations } from "@/lib/actions/location.actions"
  
  type DropdownProps = {
    value?: string
    onChangeHandler?: () => void
  }
  
  const LocationDropdown = ({ value, onChangeHandler }: DropdownProps) => {
    const [locations, setLocations] = useState<ILocation[]>([])
    const [newLocation, setNewLocation] = useState('');
  
    const handleAddLocation = () => {
      createLocation({
        locationName: newLocation.trim()
      })
        .then((location) => {
          setLocations((prevState) => [...prevState, location])
        })
    }
  
    useEffect(() => {
      const getLocations = async () => {
        const LocationList = await getAllLocations();
  
        LocationList && setLocations(LocationList as ILocation[])
      }
  
      getLocations();
    }, [])
  
    return (
      <Select onValueChange={onChangeHandler} defaultValue={value}>
        <SelectTrigger className="select-field">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          {locations.length > 0 && locations.map((Location) => (
            <SelectItem key={Location._id} value={Location._id} className="select-item p-regular-14">
              {Location.name}
            </SelectItem>
          ))}
  
          <AlertDialog>
            <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">Add new Location</AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>New Location</AlertDialogTitle>
                <AlertDialogDescription>
                  <Input type="text" placeholder="Location name" className="input-field mt-3" onChange={(e) => setNewLocation(e.target.value)} />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => startTransition(handleAddLocation)}>Add</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SelectContent>
      </Select>
    )
  }
  
  export default LocationDropdown