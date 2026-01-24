import type { Component } from '@/common/component';

// prettier-ignore
type AppEvents =
  | 'router:navigate'
  | 'router:page-changed';

// prettier-ignore
type GameEvents =
  | 'cars:total-cars-update'
  | 'ui:toggle-blocking'
  | 'track-list:render'

// prettier-ignore
type TrackHandlerEvent =
  | 'track:race-button-click'
  | 'track:reset-button-click'
  | 'track:settings-button-click'
  | 'track:remove-button-click'

export type EmitterEvents = AppEvents | GameEvents | TrackHandlerEvent;

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

export interface IImageAttributes {
  imageSrc: string;
  imageAlt?: string;
  subImageSrc?: string;
  subImageAlt?: string;
}

// ============ Api =============

export type EngineStatus = 'started' | 'stopped';

export interface ICar {
  name: string;
  color: string;
  id: number;
}

export interface IGetCarsResponse {
  cars: ICar[];
  total: number;
}

export interface IEngineResponse {
  velocity: number;
  distance: number;
}

export interface IEngineStatus {
  success: EngineStatus;
}
