export function getRandomInRange(min: number, max: number): number {
  const range = max - min + 1
  const randomBuffer = new Uint32Array(1)
  crypto.getRandomValues(randomBuffer)

  const randomValue = randomBuffer[0]
  if (!randomValue) {
    return min
  }

  // Convert to float between 0 and 1
  const randomNumber = randomValue / (2 ** 32)
  return Math.floor(randomNumber * range) + min
}

export function getMinusOrPlus(): number {
  // -1 or 1
  return getRandomInRange(0, 1) === 1 ? 1 : -1
}
