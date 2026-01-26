import { pageMessages } from '@/common/constants/messages';
import { Component } from '@common/component';

import styles from './winners-page.module.scss';
import { Pagination } from '@/components/features/pagination/pagination';
import { WinnerModal } from '@/components/features/winner-modal/winner-modal';

export class WinnersPage {
  private container: Component;
  private pagination!: Pagination;

  constructor(container: Component) {
    this.container = container;
  }

  public render(): void {
    const mainTitle = new Component({ tag: 'h1', className: styles.mainTitle, text: pageMessages.winner });

    this.pagination = new Pagination({ className: [styles.pagination] });
    this.pagination.updatePageCounter(1, 1); // ? stub implementation

    const modal = new WinnerModal({ className: [styles.modal] });
    modal.open(
      () => {},
      undefined,
      'Winner page is not implemented and most likely won’t be added due to tight deadlines 🏗️🚧⏳'
    ); /// ? stub implementation

    this.container.appendChildren([mainTitle, this.pagination]);
  }

  public destroy(): void {}
}
