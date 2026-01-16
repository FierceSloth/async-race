import { GarageControls } from '@/components/features/garage-controls/garage-controls';
import type { Component } from '@common/component';

import styles from './garage-page.module.scss';

export class GaragePage {
  private container: Component;

  constructor(container: Component) {
    this.container = container;
  }

  public render(): void {
    const controls = new GarageControls({ className: [styles.controls] });

    this.container.append(controls);
  }

  public destroy(): void {}
}
