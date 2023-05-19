export interface StarLayer {
  /**
   * Sets the color of the stars. All colors you can use in CSS should work e.g. white, #ffffff, rgb(255,255,255), hsl(0, 0%, 100%)
   */
  color: string;
  /**
   * Specifies the size of every star in px
   */
  size: number;
  /**
   * Specifies how many stars should be rendered per 100 by 100px area
   */
  density: number;
  /**
   * Sets the moving speed of the stars
   */
  speed: number;
  /**
   * Determines the moving direction. Possible values are: up, down, left, right
   */
  direction: 'up' | 'down' | 'left' | 'right';
  /**
   * Sets the amount of blur for every star
   */
  blur: number;
  /**
   * Sets the glow radius in px
   */
  glow: number;
  /**
   * Set to true to make the stars round instead of square
   */
  isRound: boolean;
}

/**
 * Default star layers that are rendered when no layers are provided to the ngx-parallax-stars component
 */
export const defaultStarLayers: StarLayer[] = [
  {
    color: '#ffffff',
    speed: 10,
    density: 7,
    size: 1,
    direction: 'up',
    blur: 5,
    glow: 1,
    isRound: false,
  },
  {
    color: '#ffffff',
    speed: 15,
    density: 2,
    size: 2,
    direction: 'up',
    blur: 1,
    glow: 2,
    isRound: false,
  },
  {
    color: '#ffffff',
    speed: 20,
    density: 1,
    size: 3,
    direction: 'up',
    blur: 0,
    glow: 5,
    isRound: false,
  },
];
