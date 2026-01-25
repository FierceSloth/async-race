import { Component } from '@/common/component';
import { Car } from '@components/features/car/car';
import type { ICar, IComponentChild } from '@/common/types/types';

import { inputsValues, winnerModalMessages } from '@/common/constants/messages';
import styles from './winner-modal.module.scss';

type ModalCallback = () => void | Promise<void>;
type WinnerData = ICar & { time: number };

interface IProps extends IComponentChild {}

export class WinnerModal extends Component {
  private previewCar: Car;
  private textEl: Component;

  private onClose: ModalCallback | null = null;

  constructor({ className = [] }: IProps) {
    super({ className: [styles.overlay, ...className] });

    this.previewCar = new Car({
      className: [styles.previewCar],
      carAttrs: {
        name: inputsValues.defaultName,
        color: inputsValues.defaultColor,
        id: 0,
      },
    });

    this.textEl = new Component({ className: styles.text });

    const modal = new Component({ className: styles.modal }, this.previewCar, this.textEl);

    this.addAllListeners();

    this.append(modal);
  }

  public open(callback?: ModalCallback, winnerData?: WinnerData): void {
    if (callback) this.onClose = callback;

    if (winnerData) {
      this.previewCar.resetBrokenState();

      this.previewCar.updateCar(winnerData.color, winnerData.name);
      this.textEl.setText(`🏆 Winner: ${winnerData.name} has been driven in ${winnerData.time}s!`);
    } else {
      this.previewCar.setBrokenState();
      this.textEl.setText(winnerModalMessages.noWinner);
    }

    const timeMs = 10;
    document.body.append(this.node);
    setTimeout(() => this.addClass(styles.open), timeMs);
  }

  public close(): void {
    const animationDuration = 300;
    this.removeClass(styles.open);

    if (this.onClose) void this.onClose();

    setTimeout(() => {
      this.node.remove();
    }, animationDuration);
  }

  private addAllListeners(): void {
    this.addListener('click', () => {
      this.close();
    });
  }
}
