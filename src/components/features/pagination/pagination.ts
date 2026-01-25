import { Component } from '@/common/component';
import type { IComponentChild } from '@/common/types/types';

import styles from './pagination.module.scss';
import { gameEmitter } from '@/common/utils/emitter';

interface IProps extends IComponentChild {}

export class Pagination extends Component {
  public readonly prevArrow: Component;
  public readonly nextArrow: Component;
  private pageCounter: Component;

  constructor({ className = [] }: IProps) {
    super({ className: [styles.pagination, ...className] });

    this.prevArrow = new Component({ tag: 'button', className: styles.arrow, text: '<' });
    this.pageCounter = new Component({ className: styles.counter, text: '1 / 1' });
    this.nextArrow = new Component({ tag: 'button', className: styles.arrow, text: '>' });

    this.appendChildren([this.prevArrow, this.pageCounter, this.nextArrow]);

    gameEmitter.on<boolean>('ui:toggle-blocking', (isDisabled) => {
      this.toggleControlButtons(isDisabled);
    });
  }

  public updatePageCounter(page: number, totalPage: number): void {
    this.pageCounter.setText(`${page.toString()} / ${totalPage.toString()}`);

    const isPreviousDisabled = page <= 1;
    const isNextDisabled = page >= totalPage;

    this.prevArrow.setDisabled(isPreviousDisabled);
    this.nextArrow.setDisabled(isNextDisabled);
  }

  private toggleControlButtons(isDisabled: boolean): void {
    this.prevArrow.setDisabled(isDisabled);
    this.nextArrow.setDisabled(isDisabled);
  }
}
