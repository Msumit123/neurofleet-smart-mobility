import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface LocationSearchInputProps {
  label: string;
  icon?: 'pin' | 'navigation';
  value: string;
  onChange: (value: string) => void;
  onSelect: (lat: number, lng: number, address: string) => void;
  placeholder?: string;
  className?: string;
}

export function LocationSearchInput({
  label,
  icon = 'pin',
  value,
  onChange,
  onSelect,
  placeholder,
  className,
}: LocationSearchInputProps) {
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (value.length < 3 || !showSuggestions) {
        if (!showSuggestions) return; // Don't clear if just hidden, but logic below handles fetching
        // If length < 3, clear suggestions
        if (value.length < 3) setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            value
          )}&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Failed to fetch suggestions', error);
      } finally {
        setIsLoading(false);
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [value]); // Depend only on value for fetching

  const handleSelect = (item: LocationResult) => {
    onChange(item.display_name);
    onSelect(parseFloat(item.lat), parseFloat(item.lon), item.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleFocus = () => {
    if (value.length >= 3) setShowSuggestions(true);
  };

  return (
    <div className={cn('space-y-2 relative', className)} ref={wrapperRef}>
      <Label>{label}</Label>
      <div className="relative">
        {icon === 'pin' ? (
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        ) : (
          <Navigation className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          className="pl-9"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={handleFocus}
        />
        {isLoading && (
          <div className="absolute right-3 top-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="p-2 hover:bg-muted cursor-pointer text-sm border-b border-border last:border-0"
              onClick={() => handleSelect(item)}
            >
              {item.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
