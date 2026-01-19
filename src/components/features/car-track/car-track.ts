import { Component } from '@common/component';
import { IconButton } from '@/components/ui/icon-button/icon-button';
import type { ICar, IComponentChild, IImageAttributes } from '@app-types/types';

import buttonCat from '@assets/svg/buttons/cat-button.svg';
import raceIcon from '@assets/svg/buttons/race.svg';
import resetIcon from '@assets/svg/buttons/reset.svg';
import settingsLabel from '@assets/svg/buttons/settings-cat.svg';
import deleteLabel from '@assets/svg/buttons/delete-cat.svg';
import finishIcon from '@assets/svg/fish.svg';
import carIcon from '@assets/svg/car-cat.svg';

import styles from './car-track.module.scss';

interface IProps extends IComponentChild {
  carAttrs: ICar;
}

const buttonAttributes = {
  race: { imageSrc: raceIcon },
  reset: { imageSrc: resetIcon },
  settings: {
    imageSrc: buttonCat,
    subImageSrc: settingsLabel,
  },
  remove: {
    imageSrc: buttonCat,
    subImageSrc: deleteLabel,
  },
} as const;

export class CarTrack extends Component {
  private car: Component;
  private finishFlag: Component;

  private raceButton: IconButton;
  private resetButton: IconButton;
  private settingsButton: IconButton;
  private removeButton: IconButton;

  private carName: Component;

  constructor({ className = [], carAttrs }: IProps) {
    super({ className: [styles.carTrack, ...className] });

    const { name } = carAttrs;

    // ? ================ Car Name ==================

    this.carName = new Component({ className: styles.carName, text: name });

    // ? =============== Controls ===================

    this.raceButton = this.createButton(buttonAttributes.race);
    this.resetButton = this.createButton(buttonAttributes.reset);
    this.settingsButton = this.createButton(buttonAttributes.settings);
    this.removeButton = this.createButton(buttonAttributes.remove);

    this.raceButton.addClass(styles.raceButton);
    this.resetButton.addClass(styles.resetButton);

    // ? =============== Track Road =================

    this.car = new Component({
      tag: 'img',
      className: styles.car,
      attrs: { alt: 'car', src: carIcon },
    }); // TODO: add this component

    this.finishFlag = new Component({
      tag: 'img',
      className: styles.finishImg,
      attrs: { alt: 'finish fish', src: finishIcon },
    });

    // ? ============ Containers ===============

    const roadLane = new Component({ className: styles.roadLane }, this.car, this.finishFlag);
    const controls = new Component(
      { className: styles.controls },
      this.raceButton,
      this.resetButton,
      this.settingsButton,
      this.removeButton
    );
    const trackLayout = new Component({ className: styles.trackLayout }, controls, roadLane);

    this.appendChildren([this.carName, trackLayout]);
  }

  private createButton(attributes: IImageAttributes): IconButton {
    const iconButton = new IconButton({
      className: [styles.button],
      attrs: attributes,
    });

    iconButton.image.addClass(styles.iconImage);
    if (iconButton.subImage) iconButton.subImage.addClass(styles.iconSubImage);

    return iconButton;
  }
}
