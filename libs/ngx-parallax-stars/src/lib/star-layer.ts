export interface StarLayer {
  color: string;
  /**
   * Size of stars in px
   */
  size: number;
  /**
   * Amount of stars per 100x100 pixel
   */
  density: number;
  speed: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

export const defaultStarLayers: StarLayer[] = [
  {
    color: '#ffffff',
    speed: 10,
    density: 7,
    size: 1,
    direction: 'up',
  },
  {
    color: '#ffffff',
    speed: 15,
    density: 2,
    size: 2,
    direction: 'up',
  },
  {
    color: '#ffffff',
    speed: 20,
    density: 1,
    size: 3,
    direction: 'up',
  },
];
