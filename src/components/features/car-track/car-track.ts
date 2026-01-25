import { Component } from '@common/component';
import { IconButton } from '@/components/ui/icon-button/icon-button';
import { Car } from '../car/car';
import type { ICar, IComponentChild, IImageAttributes } from '@app-types/types';

import buttonCat from '@assets/svg/buttons/cat-button.svg';
import raceIcon from '@assets/svg/buttons/race.svg';
import resetIcon from '@assets/svg/buttons/reset.svg';
import settingsLabel from '@assets/svg/buttons/settings-cat.svg';
import deleteLabel from '@assets/svg/buttons/delete-cat.svg';
import finishIcon from '@assets/svg/fish.svg';

import styles from './car-track.module.scss';
import { gameEmitter } from '@/common/utils/emitter';

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
  public car: Car;
  private finishFlag: Component;

  private raceButton: IconButton;
  private resetButton: IconButton;
  private settingsButton: IconButton;
  private removeButton: IconButton;

  private carName: Component;
  private carData: ICar;

  constructor({ className = [], carAttrs }: IProps) {
    super({ className: [styles.carTrack, ...className] });

    const { name } = carAttrs;

    //? ================ Car Name ==================

    this.carName = new Component({ className: styles.carName, text: name });
    this.carData = carAttrs;

    //? =============== Controls ===================

    this.raceButton = this.createButton(buttonAttributes.race);
    this.resetButton = this.createButton(buttonAttributes.reset);
    this.settingsButton = this.createButton(buttonAttributes.settings);
    this.removeButton = this.createButton(buttonAttributes.remove);

    this.raceButton.addClass(styles.raceButton);
    this.resetButton.addClass(styles.resetButton);

    //? =============== Track Road =================

    this.car = new Car({ className: [styles.car], carAttrs: carAttrs });

    this.finishFlag = new Component({
      tag: 'img',
      className: styles.finishImg,
      attrs: { alt: 'finish fish', src: finishIcon },
    });

    //? ============ Containers ===============

    const roadLane = new Component({ className: styles.roadLane }, this.car, this.finishFlag);
    const controls = new Component(
      { className: styles.controls },
      this.raceButton,
      this.resetButton,
      this.settingsButton,
      this.removeButton
    );
    const trackLayout = new Component({ className: styles.trackLayout }, controls, roadLane);

    this.addButtonListeners();

    this.appendChildren([this.carName, trackLayout]);

    gameEmitter.on<boolean>('ui:toggle-blocking', (isDisabled) => {
      this.toggleControlButtons(isDisabled);
    });
  }

  public getCarName(): string {
    return this.carData.name;
  }

  public setPending(isPending: boolean): void {
    this.raceButton.setDisabled(isPending);
    this.resetButton.setDisabled(isPending);
  }

  public setRunning(isRunning: boolean): void {
    this.raceButton.setDisabled(isRunning);
    this.resetButton.setDisabled(!isRunning);
  }

  private toggleControlButtons(isDisabled: boolean): void {
    this.settingsButton.setDisabled(isDisabled);
    this.removeButton.setDisabled(isDisabled);
  }

  private addButtonListeners(): void {
    this.raceButton.addListener('click', () => {
      gameEmitter.emit('track:race-button-click', this.carData.id);
    });
    this.resetButton.addListener('click', () => {
      gameEmitter.emit('track:reset-button-click', this.carData.id);
    });
    this.settingsButton.addListener('click', () => {
      gameEmitter.emit('track:settings-button-click', this.carData);
    });
    this.removeButton.addListener('click', () => {
      gameEmitter.emit('track:remove-button-click', this.carData);
    });

    this.resetButton.setDisabled(true);
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
