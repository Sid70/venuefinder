import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { IVenueType } from "@/lib/database/models/venuetype.model"
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
  import { createVenueType, getAllVenueType } from "@/lib/actions/venuetype.actions"
  
  type DropdownProps = {
    value?: string
    onChangeHandler?: () => void
  }
  
  const Dropdown = ({ value, onChangeHandler }: DropdownProps) => {
    const [venueType, setVenueType] = useState<IVenueType[]>([])
    const [newVenueType, setNewVenueType] = useState('');
  
    const handleAddVenueType = () => {
      createVenueType({
        venueTypeName: newVenueType.trim()
      })
        .then((VenueType) => {
          setVenueType((prevState) => [...prevState, VenueType])
        })
    }
  
    useEffect(() => {
      const getvenueType = async () => {
        const VenueTypeList = await getAllVenueType();
  
        VenueTypeList && setVenueType(VenueTypeList as IVenueType[])
      }
  
      getvenueType();
    }, [])
  
    return (
      <Select onValueChange={onChangeHandler} defaultValue={value}>
        <SelectTrigger className="select-field">
          <SelectValue placeholder="Venue Type" />
        </SelectTrigger>
        <SelectContent>
          {venueType.length > 0 && venueType.map((VenueType) => (
            <SelectItem key={VenueType._id} value={VenueType._id} className="select-item p-regular-14">
              {VenueType.name}
            </SelectItem>
          ))}
  
          <AlertDialog>
            <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">Add new venue type</AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>New venue type</AlertDialogTitle>
                <AlertDialogDescription>
                  <Input type="text" placeholder="venue type name" className="input-field mt-3" onChange={(e) => setNewVenueType(e.target.value)} />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => startTransition(handleAddVenueType)}>Add</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SelectContent>
      </Select>
    )
  }
  
  export default Dropdown