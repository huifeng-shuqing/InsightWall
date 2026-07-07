/** hex → rgba */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** CSS linear-gradient */
export function generateGradient(colors: string[], direction = 'to right'): string {
  return `linear-gradient(${direction}, ${colors.join(', ')})`;
}
