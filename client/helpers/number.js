export function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

export function isNumber (num) {
  return !isNaN(num) && '' !== ('' + num).trim()
}

export function invert(num) {
  return num > 0 ? -num : Math.abs(num)
}
