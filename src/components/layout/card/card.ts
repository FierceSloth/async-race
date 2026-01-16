import { Component } from '@/common/component';
import type { IComponentChild } from '@/common/types/types';

import styles from './card.module.scss';
import { appEmitter } from '@/common/utils/emitter';
import { DefaultPath, PagePath } from '@/common/enums/enums';
import { navigateMessages } from '@/common/constants/messages';

type IProps = {} & IComponentChild;

export class Card extends Component {
  public readonly contentContainer: Component;

  private garageButton: Component;
  private winnersButton: Component;

  constructor({ className = [], children = [] }: IProps) {
    super({ className: [styles.cardWrapper] });

    this.contentContainer = new Component({ className: [styles.card, ...className] }, ...children);

    this.garageButton = new Component({
      tag: 'button',
      className: styles.button,
      text: navigateMessages.garageButton,
    });
    this.winnersButton = new Component({
      tag: 'button',
      className: styles.button,
      text: navigateMessages.winnerButton,
    });
    const navigateMenu = new Component({ tag: 'nav', className: styles.nav }, this.garageButton, this.winnersButton);

    this.garageButton.addListener('click', () => {
      appEmitter.emit('router:navigate', PagePath.GARAGE);
    });
    this.winnersButton.addListener('click', () => {
      appEmitter.emit('router:navigate', PagePath.WINNERS);
    });

    appEmitter.on<PagePath | DefaultPath>('router:page-changed', (path) => this.updateActiveButton(path));

    this.appendChildren([navigateMenu, this.contentContainer]);
  }

  private updateActiveButton(path: PagePath | DefaultPath): void {
    this.garageButton.removeClass(styles.active);
    this.winnersButton.removeClass(styles.active);

    if (path === PagePath.GARAGE || path === DefaultPath.SLASH) {
      this.garageButton.addClass(styles.active);
    } else if (path === PagePath.WINNERS) {
      this.winnersButton.addClass(styles.active);
    }
  }
}
