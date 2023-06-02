
// radial distance: r ≥ 0,
// polar angle: 0° ≤ θ ≤ 180° (π rad)
// azimuth : 0° ≤ φ < 360° (2π rad)
const generateRandomSphericalCoordinate = (radius: number, x1: number = 0, y1: number = 0, z1: number = 0) => {
  const polarAngle = Math.random() * 180
  const azimuthAngle = Math.random() * 360
  let xCoord = radius * Math.sin(polarAngle * Math.PI / 180) * Math.cos(azimuthAngle * Math.PI / 180) + x1
  let yCoord = radius * Math.sin(polarAngle * Math.PI / 180) * Math.sin(azimuthAngle * Math.PI / 180) + y1
  let zCoord = radius * Math.cos(polarAngle * Math.PI / 180) + z1
  return [xCoord, yCoord, zCoord]
}

export const randomSphericalCoordinates = (numPoints: number = 50, radius: number, x1: number = 0, y1: number = 0, z1: number = 0) => {
  let points = []
  for (let i = 0; i < numPoints; i++) {
    points.push(generateRandomSphericalCoordinate(radius, x1, y1, z1))
  }
  return points
}