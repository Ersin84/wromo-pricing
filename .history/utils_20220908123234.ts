export function getWromoPrice(price: number, wromo: number): string {
  return Number(Math.round(price - (wromo * price) / 100)).toLocaleString(
    'en-US',
    { currency: 'USD' }
  )
}
