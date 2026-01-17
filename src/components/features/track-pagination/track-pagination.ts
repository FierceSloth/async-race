import { Component } from '@/common/component';
import type { IComponentChild } from '@/common/types/types';

import styles from './track-pagination.module.scss';

interface IProps extends IComponentChild {}

export class TrackPagination extends Component {
  private prevArrow: Component;
  private pageCounter: Component;
  private nextArrow: Component;

  constructor({ className = [] }: IProps) {
    super({ className: [styles.pagination, ...className] });

    this.prevArrow = new Component({ tag: 'button', className: styles.arrow, text: '<' });
    this.pageCounter = new Component({ className: styles.counter, text: '1 / 10' }); // ? temporary
    this.nextArrow = new Component({ tag: 'button', className: styles.arrow, text: '>' });

    this.appendChildren([this.prevArrow, this.pageCounter, this.nextArrow]);
  }

  public updatePageCounter(page: number, totalPage: number): void {
    this.pageCounter.setText(`${page.toString()} / ${totalPage.toString()}`);

    this.prevArrow.toggleClass(styles.disabled, page === 1);
    this.nextArrow.toggleClass(styles.disabled, page >= totalPage);

    if (page === 1) {
      this.prevArrow.setAttribute('disabled', 'true');
    } else {
      this.prevArrow.removeAttribute('disabled');
    }

    if (page >= totalPage) {
      this.nextArrow.setAttribute('disabled', 'true');
    } else {
      this.nextArrow.removeAttribute('disabled');
    }
  }
}
