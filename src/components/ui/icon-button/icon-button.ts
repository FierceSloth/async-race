import { Component } from '@common/component';
import type { IComponentChild } from '@app-types/types';
import styles from './button.module.scss';

type IProps = {
  onClick?: (event: MouseEvent) => void;
  attrs: IImageAttributes;
} & IComponentChild;

type IImageAttributes = {
  imageSrc: string;
  imageAlt: string;
  subImageSrc?: string;
  subImageAlt?: string;
};

export class IconButton extends Component {
  constructor({ className = [], attrs, onClick }: IProps) {
    super({ tag: 'button', className: [styles.button, ...className] });

    const { imageSrc, imageAlt, subImageSrc, subImageAlt } = attrs;

    const image = new Component({
      tag: 'img',
      className: styles.image,
      attrs: { src: imageSrc, alt: imageAlt },
    });

    if (subImageAlt && subImageSrc) {
      const subImage = new Component({
        tag: 'img',
        className: styles.subImage,
        attrs: { src: subImageSrc, alt: subImageAlt },
      });

      this.append(subImage);
    }

    if (onClick) {
      this.addListener('click', (event) => {
        onClick(event);
      });
    }

    this.append(image);
  }
}
