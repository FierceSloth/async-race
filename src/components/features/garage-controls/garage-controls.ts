import { Component } from '@/common/component';
import { IconButton } from '@/components/ui/icon-button/icon-button';

import type { IComponentChild, IImageAttributes } from '@/common/types/types';
import styles from './garage-controls.module.scss';

import buttonCat from '@assets/svg/buttons/cat-button.svg';
import race from '@assets/svg/buttons/race.svg';
import reset from '@assets/svg/buttons/reset.svg';
import addCat from '@assets/svg/buttons/add-cat.svg';
import addCats from '@assets/svg/buttons/add-cats.svg';
import { gameEmitter } from '@/common/utils/emitter';

interface IProps extends IComponentChild {}

const buttonAttributes = {
  race: { imageSrc: race },
  reset: { imageSrc: reset },
  create: {
    imageSrc: buttonCat,
    subImageSrc: addCat,
  },
  generate: {
    imageSrc: buttonCat,
    subImageSrc: addCats,
  },
} as const;

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
      text: '4', // ? temporary
    });

    this.createCarButton = this.createButton(buttonAttributes.create);
    this.generateCarsButton = this.createButton(buttonAttributes.generate);
    this.raceButton = this.createButton(buttonAttributes.race);
    this.resetButton = this.createButton(buttonAttributes.reset);

    this.raceButton.addClass(styles.raceButton);
    this.resetButton.addClass(styles.resetButton);

    // ? ============ Emitter =============

    gameEmitter.on<number>('cars:total-cars-update', (total) => {
      this.updateCarCounter(total);
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

  private createButton(attributes: IImageAttributes): IconButton {
    return new IconButton({
      className: [styles.iconButton],
      attrs: attributes,
    });
  }

  private updateCarCounter(count: string | number): void {
    this.totalCarsCounter.setText(count.toString());
  }

  private addButtonsListeners(): void {
    // TODO: add listeners
  }
}
