export interface StarLayer {
  color: string;
  size: string;
  count: number;
  speed: number;
  direction: 'upwards' | 'downwards';
}

export const defaultStarLayers: StarLayer[] = [
  {
    color: '#FFF',
    speed: 100,
    count: 700,
    size: '1px',
    direction: 'upwards',
  },
  {
    color: '#FFF',
    speed: 150,
    count: 200,
    size: '2px',
    direction: 'upwards',
  },
  {
    color: '#FFF',
    speed: 200,
    count: 100,
    size: '3px',
    direction: 'upwards',
  },
];
