import { Component } from '@/common/component';
import type { IComponentChild } from '@/common/types/types';

import styles from './pagination.module.scss';

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
  }

  public updatePageCounter(page: number, totalPage: number): void {
    this.pageCounter.setText(`${page.toString()} / ${totalPage.toString()}`);

    const isPreviousDisabled = page <= 1;
    const isNextDisabled = page >= totalPage;

    this.prevArrow.toggleClass(styles.disabled, isPreviousDisabled);
    this.nextArrow.toggleClass(styles.disabled, isNextDisabled);

    if (isPreviousDisabled) {
      this.prevArrow.setAttribute('disabled', 'true');
    } else {
      this.prevArrow.removeAttribute('disabled');
    }

    if (isNextDisabled) {
      this.nextArrow.setAttribute('disabled', 'true');
    } else {
      this.nextArrow.removeAttribute('disabled');
    }
  }
}
