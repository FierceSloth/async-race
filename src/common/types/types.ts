import type { Component } from '@/common/component';

// prettier-ignore
type AppEvents =
  | 'router:navigate'
  | 'router:page-changed';

// prettier-ignore
type GameEvents =
  | 'temporary'

export type EmitterEvents = AppEvents | GameEvents;

export type IPage = {
  render: () => void;
  destroy: () => void;
};

export type IComponent = {
  tag?: keyof HTMLElementTagNameMap;
  className?: string | string[];
  text?: string;
  attrs?: Record<string, string>;
};

export type IComponentChild = {
  className?: string[];
  children?: Component[];
};
