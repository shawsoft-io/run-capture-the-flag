import { useState } from "react";
import { useDataFilter } from "@/context/DataFilterContext";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "react-responsive";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Drawer from "@/components/Drawer";

interface MonthYearPickerProps {
  minDate: Date;
  maxDate: Date;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ minDate, maxDate }) => {
  const { selectedMonth, selectedYear, setMonthYear } = useDataFilter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const years = Array.from(
    { length: maxDate.getFullYear() - minDate.getFullYear() + 1 },
    (_, i) => minDate.getFullYear() + i
  );

  const handleSelect = (value: string) => {
    if (value === "showAll") {
      setMonthYear(null, null);
    } else {
      const [month, year] = value.split("-").map(Number);
      setMonthYear(month, year);
    }
    setIsDrawerOpen(false);
  };

  const renderSelect = (
    <Select onValueChange={handleSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Select Month & Year" />
      </SelectTrigger>
      <SelectContent className="z-[5000]">
        {years.map((year) =>
          months.slice(0, year === maxDate.getFullYear() ? maxDate.getMonth() + 1 : 12)
            .map((month, index) => (
              <SelectItem key={`${index}-${year}`} value={`${index}-${year}`}>
                {month} {year}
              </SelectItem>
            ))
        )}
      </SelectContent>
    </Select>
  );

  return (
    <div>
      {isMobile ? (
        <>
          <Button onClick={() => setIsDrawerOpen(true)}>
            {selectedMonth !== null && selectedYear !== null ? `${months[selectedMonth]} ${selectedYear}` : "Select Date"}
          </Button>
          <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
            <div className="flex flex-col space-y-4 p-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Month & Year</h3>
              {renderSelect}
              <Button className="h-14 text-lg" onClick={() => handleSelect("showAll")}>Show All</Button>
            </div>
          </Drawer>
        </>
      ) : (
        <div className="flex space-x-4 items-center">
          {renderSelect}
          <Button className="bg-white text-gray-600 hover:bg-gray-100" onClick={() => handleSelect("showAll")}>
            Show All
          </Button>
        </div>
      )}
    </div>
  );
};

export default MonthYearPicker;