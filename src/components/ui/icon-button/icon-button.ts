import { Component } from '@common/component';
import type { IComponentChild, IImageAttributes } from '@app-types/types';
import styles from './icon-button.module.scss';

interface IProps extends IComponentChild {
  onClick?: (event: MouseEvent) => void;
  attrs: IImageAttributes;
}

export class IconButton extends Component {
  public readonly image: Component;
  public readonly subImage: Component | undefined;

  constructor({ className = [], attrs, onClick }: IProps) {
    super({ tag: 'button', className: [styles.button, ...className] });

    const { imageSrc, imageAlt, subImageSrc, subImageAlt } = attrs;

    this.image = new Component({
      tag: 'img',
      className: styles.image,
      attrs: { src: imageSrc, alt: imageAlt || 'image' },
    });

    if (subImageSrc) {
      this.subImage = new Component({
        tag: 'img',
        className: styles.subImage,
        attrs: { src: subImageSrc, alt: subImageAlt || 'subImage' },
      });

      this.append(this.subImage);
    }

    if (onClick) {
      this.addListener('click', (event) => {
        onClick(event);
      });
    }

    this.append(this.image);
  }
}
