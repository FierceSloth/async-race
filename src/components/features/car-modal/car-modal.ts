import { Component } from '@/common/component';
import { Car } from '@components/features/car/car';
import type { ICar, IComponentChild } from '@/common/types/types';

import { inputsValues, modalButtonMessages } from '@/common/constants/messages';
import { getRandomColor, getRandomName } from '@utils/random';
import styles from './car-modal.module.scss';

type ModalCallback = (carData: Omit<ICar, 'id'>) => void | Promise<void>;

interface IProps extends IComponentChild {}

export class CarModal extends Component {
  private nameInput: Component<HTMLInputElement>;
  private colorInput: Component<HTMLInputElement>;
  private previewCar: Car;
  private overlay: Component;

  private cancelButton: Component<HTMLButtonElement>;
  private acceptButton: Component<HTMLButtonElement>;

  private onSubmit: ModalCallback | null = null;

  constructor({ className = [] }: IProps) {
    super({ className: [styles.overlay, ...className] });
    this.overlay = this;

    this.previewCar = new Car({
      className: [styles.previewCar],
      carAttrs: {
        name: inputsValues.defaultName,
        color: inputsValues.defaultColor,
      },
    });

    this.nameInput = this.createInput(styles.nameInput, {
      type: 'text',
      placeholder: inputsValues.namePlaceholder,
    });
    this.colorInput = this.createInput(styles.colorInput, {
      type: 'color',
      value: inputsValues.defaultColor,
    });

    const inputsContainer = new Component({ className: styles.inputsContainer }, this.nameInput, this.colorInput);

    this.cancelButton = this.createButton(modalButtonMessages.cancel, styles.cancelButton);
    this.acceptButton = this.createButton(modalButtonMessages.accept, styles.acceptButton);

    const buttonsContainer = new Component(
      { className: styles.buttonsContainer },
      this.cancelButton,
      this.acceptButton
    );

    const modal = new Component({ className: styles.modal }, this.previewCar, inputsContainer, buttonsContainer);

    this.addAllListeners();

    this.append(modal);
  }

  public open(callback: ModalCallback, carData?: ICar): void {
    this.onSubmit = callback;

    if (carData) {
      this.nameInput.node.value = carData.name;
      this.colorInput.node.value = carData.color;
      this.previewCar.updateCar(carData.color, carData.name);
    } else {
      const randomColor = getRandomColor();
      const randomName = getRandomName();

      this.nameInput.node.value = randomName;
      this.colorInput.node.value = randomColor;
      this.previewCar.updateCar(randomColor, randomName);
    }

    const timeMs = 10;
    document.body.append(this.node);
    setTimeout(() => this.addClass(styles.visible), timeMs);
  }

  public close(): void {
    const animationDuration = 300;
    this.removeClass(styles.visible);

    setTimeout(() => {
      this.node.remove();
    }, animationDuration);
  }

  private addAllListeners(): void {
    this.nameInput.addListener('input', () => {
      this.previewCar.updateName(this.nameInput.node.value || getRandomName());
    });
    this.colorInput.addListener('input', () => {
      this.previewCar.updateColor(this.colorInput.node.value);
    });

    this.cancelButton.addListener('click', () => {
      this.close();
    });
    this.acceptButton.addListener('click', () => {
      if (this.onSubmit) {
        void this.onSubmit({
          name: this.nameInput.node.value,
          color: this.colorInput.node.value,
        });
      }
      this.close();
    });

    this.addListener('click', (event) => {
      if (event.target === this.overlay.node) this.close();
    });
  }

  private createButton(text: string, className: string): Component<HTMLButtonElement> {
    return new Component<HTMLButtonElement>({ tag: 'button', className: [styles.button, className], text: text });
  }

  private createInput(className: string, attribute: Record<string, string>): Component<HTMLInputElement> {
    return new Component<HTMLInputElement>({
      tag: 'input',
      className: [styles.input, className],
      attrs: attribute,
    });
  }
}
