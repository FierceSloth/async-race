import { Card } from '@/components/ui/card/card';
import { Component } from '@common/component';

import styles from './garage-page.module.scss';
// import catImg from '@assets/svg/car-cat.svg';

export class GaragePage {
  private container: Component;

  constructor(container: Component) {
    this.container = container;
  }

  public render(): void {
    const card = new Card({ className: [styles.card] });

    // for (let i = 0; i < 5; i += 1) {
    //   const cat = new Component({ tag: 'img', className: styles.cat, attrs: { src: catImg } });
    //   card.append(cat);
    // }

    const pageContainer = new Component({ className: [styles.garageContainer, 'pageContainer'] }, card);
    this.container.append(pageContainer);
  }

  public destroy(): void {}
}
