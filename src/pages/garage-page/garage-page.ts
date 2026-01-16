import type { Component } from '@common/component';

// import styles from './garage-page.module.scss';
// import catImg from '@assets/svg/car-cat.svg';

import { IconButton } from '../../components/ui/icon-button/icon-button';
import catButton from '@assets/svg/buttons/cat-button.svg';
import addCats from '@assets/svg/buttons/add-cats.svg';

export class GaragePage {
  private container: Component;

  constructor(container: Component) {
    this.container = container;
  }

  public render(): void {
    const buttonAttributes = {
      imageAlt: 'cat',
      imageSrc: catButton,
      subImageAlt: '+100',
      subImageSrc: addCats,
    };
    const button = new IconButton({ attrs: buttonAttributes });

    this.container.append(button);
  }

  public destroy(): void {}
}
