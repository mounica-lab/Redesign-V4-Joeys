import { SWATCHES } from '../data.js';

export function FoodSwatch({ tone = 'warm', label, ratio = '4/3', className = '', style = {} }) {
  const [a, b] = SWATCHES[tone] || SWATCHES.warm;
  return (
    <div
      className={`food-swatch ${className}`}
      data-label={label}
      style={{ aspectRatio: ratio, '--swatch-a': a, '--swatch-b': b, borderRadius: 'inherit', ...style }}
    />
  );
}
