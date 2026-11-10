export const shortestAngle = (angle) => ((angle + 180) % 360 + 360) % 360 - 180

// Efeito relativo ao movimento, não uma leitura de norte geográfico.
export function orientationSample(event, screenAngle = 0) {
  const alpha = Number.isFinite(event.alpha) ? event.alpha : null
  const beta = Number.isFinite(event.beta) ? event.beta : null
  const gamma = Number.isFinite(event.gamma) ? event.gamma : null
  if (alpha === null && beta === null && gamma === null) return null
  const radians = screenAngle * Math.PI / 180
  return {
    heading: alpha,
    tilt: (gamma ?? 0) * Math.cos(radians) + (beta ?? 0) * Math.sin(radians),
  }
}
