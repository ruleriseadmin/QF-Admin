import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, DateRange } from "react-day-picker"
import { useState,useEffect } from "react"
import { startOfDay, subDays } from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"


function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onSelect,
  ...props
}) {
  const selectedDate = props?.selected  // Type assertion

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  const [fromDate,setFromDate] = useState( formatDate(selectedDate?.from) ?? null);
    const [toDate,setToDate] = useState( formatDate(selectedDate?.to) ?? null);
  const [selectedRange, setSelectedRange] = useState({
    from: fromDate,
    to: toDate ,
  });

  useEffect(() => {
    if (selectedRange.from) {
      setFromDate(formatDate(selectedRange.from));
    }
    if (selectedRange.to) {
      setToDate(formatDate(selectedRange.to));
    }
  }, [selectedRange]);
  
  const handleDateSelect = (date) => {
    if (!date) return;
  
    setSelectedRange({
      from: date.from || selectedRange.from,
      to: date.to || selectedRange.to,
    });
  
    onSelect?.(date);
  };

  
  
  
  
 

  return (
    <div className=" z-50 w-full h-auto  ">
         <div className="flex justify-between w-9/12 mx-auto items-center  mt-2 ">
  <input
    type="date"
    className="w-[150px] shadow-custom5 border border-solid h-[40px] px-4 py-2 rounded-[12px] bg-[#E0E0E0] "
    value={fromDate || ""}
    onChange={(e) => {
      const newFromDate = new Date(e.target.value);
      const newRange = {
        from: newFromDate,
        to: selectedDate.to
      };
      
      setFromDate(formatDate(newRange.from));
      setSelectedRange(newRange); // Update local state
      onSelect?.(newRange); // Call onSelect with the new range
    }}
  />
  <span>-</span>
  <input
    type="date"
    className=" w-[150px] shadow-custom5 border border-solid h-[40px] px-4 py-2 rounded-[12px] bg-[#E0E0E0]"
    value={toDate || ""}
    onChange={(e) => {
      const newToDate = new Date(e.target.value);
      const newRange = {
        from: selectedDate.from,
        to: newToDate,
      };
      setToDate(formatDate(newRange.to));
      setSelectedRange(newRange); // Update local state
      onSelect?.(newRange); // Call onSelect with the new range
    }}
  />
</div>
    

      <div className="flex justify-center gap-4 ">
      
        <div className="">
          <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            
            classNames={{
              months: "flex  sm:flex-row  space-y-2  gap-x-6  md:gap-x-4  lg:gap-x-4 sm:space-y-0",
              
              month: "space-y-2 ",
              caption: "flex justify-center pt-1 relative items-center w-full",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
              ),
              day_range_end: "day-range-end",
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside:
                "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
              ...classNames,
            }}
            components={{
              IconLeft: ({ className, ...props }) => (
                <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
              ),
              IconRight: ({ className, ...props }) => (
                <ChevronRight className={cn("h-4 w-4", className)} {...props} />
              ),
            }}
            mode="range" 
            onSelect={handleDateSelect}
            
            {...props}
          />
        </div>
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
