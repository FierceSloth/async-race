import { Component } from '@/common/component';
import { IconButton } from '@/components/ui/icon-button/icon-button';

import type { IComponentChild } from '@/common/types/types';
import styles from './garage-controls.module.scss';

import buttonCat from '@assets/svg/buttons/cat-button.svg';
import race from '@assets/svg/buttons/race.svg';
import reset from '@assets/svg/buttons/reset.svg';
import addCat from '@assets/svg/buttons/add-cat.svg';
import addCats from '@assets/svg/buttons/add-cats.svg';

interface IProps extends IComponentChild {}

const createCarAttributes = {
  imageSrc: buttonCat,
  subImageSrc: addCat,
};

const generateCarsAttributes = {
  imageSrc: buttonCat,
  subImageSrc: addCats,
};

const raceAttributes = {
  imageSrc: race,
};

const resetAttributes = {
  imageSrc: reset,
};

export class GarageControls extends Component {
  private totalCarsCounter: Component;
  private createCarButton: IconButton;
  private generateCarsButton: IconButton;
  private raceButton: IconButton;
  private resetButton: IconButton;

  constructor({ className = [] }: IProps) {
    super({ className: [styles.controls, ...className] });

    // ? ================ Buttons ================

    this.totalCarsCounter = new Component({
      className: styles.counter,
      text: '101',
    });

    this.createCarButton = new IconButton({
      className: [styles.iconButton],
      attrs: createCarAttributes,
    });

    this.generateCarsButton = new IconButton({
      className: [styles.iconButton],
      attrs: generateCarsAttributes,
    });

    this.raceButton = new IconButton({
      className: [styles.iconButton, styles.raceButton],
      attrs: raceAttributes,
    });

    this.resetButton = new IconButton({
      className: [styles.iconButton, styles.resetButton],
      attrs: resetAttributes,
    });

    // ? ============ Initialization =============

    this.addButtonsListeners();

    this.appendChildren([
      this.totalCarsCounter,
      this.createCarButton,
      this.generateCarsButton,
      this.raceButton,
      this.resetButton,
    ]);
  }

  // private updateCarCounter(count: string | number): void {
  //   this.totalCarsCounter.setText(count.toString());
  // }

  private addButtonsListeners(): void {
    // TODO: add listeners
  }
}
