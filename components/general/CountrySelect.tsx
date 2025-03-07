import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FixedSizeList as List } from "react-window";
import useCountryList from "./MemoizedCountryList";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface CountrySelectProps {
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  label?: string;
  showWorldwide?: boolean;
  className?: string;
  error?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  onChange,
  value,
  placeholder = "Select Location",
  label = "Location",
  showWorldwide = true,
  className,
  error,
}) => {
  const memoizedCountryList = useCountryList();

  // for tracking only selected country, and memoize them
  const selectedCountry = useMemo(() => {
    if (value === "worldwide")
      return { name: "Worldwide / Remote", flagEmoji: "🌍" };
    return memoizedCountryList.find((country) => country.name === value);
  }, [value, memoizedCountryList]);

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const country = memoizedCountryList[index];

    return (
      <SelectItem
        key={country.code}
        value={country.name}
        style={style}
        onClick={() => onChange(country.name)}
        className="py-2 px-3 hover:bg-accent cursor-pointer"
      >
        <span>{country.flagEmoji}</span>
        <span className="pl-2">{country.name}</span>
      </SelectItem>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className={cn("w-full", error && "border-red-500")}>
          <SelectValue placeholder={placeholder}>
            {selectedCountry && (
              <div className="flex items-center">
                <span>{selectedCountry.flagEmoji}</span>
                <span className="pl-2">{selectedCountry.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="max-h-[400px]">
          {showWorldwide && (
            <SelectGroup>
              <SelectLabel className="px-3 text-sm font-semibold">
                Worldwide
              </SelectLabel>
              <SelectItem
                value="worldwide"
                className="py-2 px-3 hover:bg-accent cursor-pointer"
              >
                <span className="mr-2">🌍</span>
                <span className="text-sm">Worldwide / Remote</span>
              </SelectItem>
            </SelectGroup>
          )}

          <SelectGroup>
            <SelectLabel className="px-3 text-sm font-semibold">
              {label}
            </SelectLabel>
            <List
              height={280}
              itemCount={memoizedCountryList.length}
              itemSize={40} // Reduced item size
              width="100%"
              className="scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
            >
              {Row}
            </List>
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CountrySelect;
