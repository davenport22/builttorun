export const ELEVATION_BOOST_MULTIPLIER = 1.10

export function calculateScoredDistance(
  distanceKm: number,
  elevationBoost: boolean
): number {
  return elevationBoost
    ? Number((distanceKm * ELEVATION_BOOST_MULTIPLIER).toFixed(2))
    : distanceKm
}

export function getElevationBonus(distanceKm: number): number {
  return Number((distanceKm * (ELEVATION_BOOST_MULTIPLIER - 1)).toFixed(2))
}
