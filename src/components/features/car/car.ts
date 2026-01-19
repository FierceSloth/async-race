import { Component } from '@/common/component';
import type { ICar, IComponentChild } from '@/common/types/types';

import carSvg from '@/assets/svg/car.svg?raw';
import styles from './car.module.scss';

interface IProps extends IComponentChild {
  carAttrs: ICar;
}

/**
 * Non-obvious logic.
 * The component uses raw SVG, in which the colors in the styles are specified as var(--c-cat) for the main color and var(--c-edge) for the outline.
 * This SVG also contains a text component with the name of the machine, which we access via querySelector.
 */
export class Car extends Component {
  private textEl: Element | null = null;

  constructor({ className = [], carAttrs }: IProps) {
    super({ className: [styles.car, ...className] });

    const { color, name } = carAttrs;

    this.node.innerHTML = carSvg;
    this.textEl = this.node.querySelector('.car-name');

    this.updateCar(color, name);
  }

  public updateColor(color: string): void {
    this.node.style.setProperty('--c-cat', color);
    this.node.style.setProperty('--c-edge', `color-mix(in srgb, ${color}, black 30%)`);
  }

  public updateName(name: string): void {
    if (this.textEl) {
      this.textEl.textContent = name;
    }
  }

  public updateCar(color: string, name: string): void {
    this.updateName(name);
    this.updateColor(color);
  }
}
