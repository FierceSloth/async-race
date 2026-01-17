import { GarageControls } from '@/components/features/garage-controls/garage-controls';
import { pageMessages, titleMessages } from '@/common/constants/messages';
import { Component } from '@common/component';

import styles from './garage-page.module.scss';

export class GaragePage {
  private container: Component;

  constructor(container: Component) {
    this.container = container;
  }

  public render(): void {
    const mainTitle = new Component({ tag: 'h1', className: styles.mainTitle, text: titleMessages.title });

    const pageTitle = new Component({ tag: 'h2', className: styles.pageTitle, text: pageMessages.garage });
    const controls = new GarageControls({ className: [styles.controls] });
    const controlPanel = new Component({ className: styles.controlPanel }, controls, pageTitle);

    const trackList = new Component({ className: styles.trackList }); // TODO: add this component

    const trackPagination = new Component({ className: styles.trackPagination }); // TODO: add this component

    this.container.appendChildren([mainTitle, controlPanel, trackList, trackPagination]);
  }

  public destroy(): void {}
}
