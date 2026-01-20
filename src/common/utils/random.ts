import { catCarData } from '@constants/cat-car-brands';

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArr<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getRandomName(): string {
  const brands = Object.keys(catCarData);
  const randomBrandKey = brands[getRandomInt(0, brands.length - 1)];

  const models = catCarData[randomBrandKey];
  const randomModel = models[getRandomInt(0, models.length - 1)];

  return `${randomBrandKey} ${randomModel}`;
}

export function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  const hexLength = 6;
  let color = '#';
  for (let i = 0; i < hexLength; i++) {
    color += letters[getRandomInt(0, letters.length - 1)];
  }
  return color;
}
