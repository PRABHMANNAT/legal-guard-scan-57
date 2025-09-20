import { useState } from 'react';
import { Calendar, Filter, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface FilterBarProps {
  onFiltersChange?: (filters: any) => void;
  className?: string;
}

const FilterBar = ({ onFiltersChange, className }: FilterBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const marketplaces = ['Amazon', 'Flipkart', 'Myntra', 'Nykaa', 'Meesho'];
  const categories = ['Electronics', 'Fashion', 'Beauty', 'Home & Kitchen', 'Sports'];
  const brands = ['Samsung', 'Apple', 'Nike', 'Unilever', 'Nestle'];
  const statuses = ['Compliant', 'Warning', 'Non-Compliant', 'Critical'];

  const activeFilters = [
    searchQuery && { type: 'search', value: searchQuery, label: `Search: ${searchQuery}` },
    dateRange && { type: 'date', value: dateRange, label: 'Date Range' },
    selectedMarketplace !== 'all' && { type: 'marketplace', value: selectedMarketplace, label: selectedMarketplace },
    selectedCategory !== 'all' && { type: 'category', value: selectedCategory, label: selectedCategory },
    selectedBrand !== 'all' && { type: 'brand', value: selectedBrand, label: selectedBrand },
    selectedStatus !== 'all' && { type: 'status', value: selectedStatus, label: selectedStatus },
  ].filter(Boolean);

  const clearFilter = (filterType: string) => {
    switch (filterType) {
      case 'search':
        setSearchQuery('');
        break;
      case 'date':
        setDateRange(undefined);
        break;
      case 'marketplace':
        setSelectedMarketplace('all');
        break;
      case 'category':
        setSelectedCategory('all');
        break;
      case 'brand':
        setSelectedBrand('all');
        break;
      case 'status':
        setSelectedStatus('all');
        break;
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setDateRange(undefined);
    setSelectedMarketplace('all');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedStatus('all');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search URL/SKU/GTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[200px] justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                "Select date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Filter Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Marketplace</label>
                <Select value={selectedMarketplace} onValueChange={setSelectedMarketplace}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marketplace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Marketplaces</SelectItem>
                    {marketplaces.map((marketplace) => (
                      <SelectItem key={marketplace} value={marketplace}>
                        {marketplace}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Brand</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter: any, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {filter.label}
              <button
                onClick={() => clearFilter(filter.type)}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;