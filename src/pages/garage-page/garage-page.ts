import { Component } from '@common/component';
import { GarageControls } from '@components/features/garage-controls/garage-controls';
import { TrackList } from '@/components/features/track-list/track-list';
import { TrackPagination } from '@components/features/track-pagination/track-pagination';

import { pageMessages, titleMessages } from '@common/constants/messages';

import styles from './garage-page.module.scss';

export class GaragePage {
  private container: Component;

  private trackList: TrackList | undefined;
  private pagination: TrackPagination | undefined;

  constructor(container: Component) {
    this.container = container;
  }

  public render(): void {
    const mainTitle = new Component({ tag: 'h1', className: styles.mainTitle, text: titleMessages.title });

    const pageTitle = new Component({ tag: 'h2', className: styles.pageTitle, text: pageMessages.garage });
    const controls = new GarageControls({ className: [styles.controls] });
    const controlPanel = new Component({ className: styles.controlPanel }, controls, pageTitle);

    this.trackList = new TrackList({ className: [styles.trackList] });

    this.pagination = new TrackPagination({ className: [styles.pagination] });

    this.container.appendChildren([mainTitle, controlPanel, this.trackList, this.pagination]);

    void this.init();
  }

  public destroy(): void {}

  private async init(): Promise<void> {
    await this.trackList?.renderList(1);
  }
}
