export interface StarLayer {
  color: string;
  size: string;
  /**
   * Amount of stars per 100x100 pixel
   */
  density: number;
  speed: number;
  direction: 'upwards' | 'downwards';
}

export const defaultStarLayers: StarLayer[] = [
  {
    color: '#FFF',
    speed: 100,
    density: 7,
    size: '1px',
    direction: 'upwards',
  },
  {
    color: '#FFF',
    speed: 150,
    density: 2,
    size: '2px',
    direction: 'upwards',
  },
  {
    color: '#FFF',
    speed: 200,
    density: 1,
    size: '3px',
    direction: 'upwards',
  },
];
