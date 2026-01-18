import type { Component } from '@/common/component';

// prettier-ignore
type AppEvents =
  | 'router:navigate'
  | 'router:page-changed';

// prettier-ignore
type GameEvents =
  | 'temporary'

export type EmitterEvents = AppEvents | GameEvents;

export interface IPage {
  render: () => void;
  destroy: () => void;
}

export interface IComponent {
  tag?: keyof HTMLElementTagNameMap;
  className?: string | string[];
  text?: string;
  attrs?: Record<string, string>;
}

export interface IComponentChild {
  className?: string[];
  children?: Component[];
}

// ============ Api =============

export interface ICar {
  name: string;
  color: string;
  id: number;
}

export interface IGetCarsResponse {
  cars: ICar[];
  total: number;
}
