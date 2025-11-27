import { useState, useEffect } from 'react';
import { Input } from '~/components/ui/input';
import { formatPrice, parsePrice } from '~/lib/admin/validation';

interface PriceInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> {
  value?: number;
  onChange: (value: number) => void;
}

export function PriceInput({ value, onChange, ...props }: PriceInputProps) {
  // Local state to handle decimal input
  const [displayValue, setDisplayValue] = useState('');

  // Update display value when prop value changes (e.g. initial load or external update)
  useEffect(() => {
    if (value !== undefined && value !== null) {
      // Only update if the parsed current display value doesn't match the new value
      // This prevents cursor jumping/formatting issues while typing
      const currentParsed = parsePrice(displayValue);
      if (currentParsed !== value) {
        setDisplayValue(formatPrice(value));
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Allow empty string, numbers, and one decimal point
    if (newValue === '' || /^\d*\.?\d{0,2}$/.test(newValue)) {
      setDisplayValue(newValue);

      // Only trigger onChange if it's a valid number
      if (newValue !== '' && !isNaN(parseFloat(newValue))) {
        onChange(parsePrice(newValue));
      } else if (newValue === '') {
        onChange(0);
      }
    }
  };

  const handleBlur = () => {
    if (value !== undefined) {
      setDisplayValue(formatPrice(value));
    }
  };

  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}
