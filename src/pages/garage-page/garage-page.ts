import { Component } from '@common/component';
import { GarageControls } from '@components/features/garage-controls/garage-controls';
import { TrackList } from '@/components/features/track-list/track-list';
import { TrackPagination } from '@components/features/track-pagination/track-pagination';
import { CarModal } from '@/components/features/car-modal/car-modal';

import { pageMessages, titleMessages } from '@common/constants/messages';

import styles from './garage-page.module.scss';
import { GarageController } from '@/controllers/garage-controller';

export class GaragePage {
  public controls!: GarageControls;
  public trackList!: TrackList;
  public pagination!: TrackPagination;

  public modal = new CarModal({});

  private container: Component;

  constructor(container: Component) {
    this.container = container;
  }

  public render(): void {
    const mainTitle = new Component({ tag: 'h1', className: styles.mainTitle, text: titleMessages.title });
    const pageTitle = new Component({ tag: 'h2', className: styles.pageTitle, text: pageMessages.garage });

    this.controls = new GarageControls({ className: [styles.controls] });

    const controlPanel = new Component({ className: styles.controlPanel }, this.controls, pageTitle);

    this.trackList = new TrackList({ className: [styles.trackList] });

    this.pagination = new TrackPagination({ className: [styles.pagination] });

    this.container.appendChildren([mainTitle, controlPanel, this.trackList, this.pagination]);

    new GarageController(this);
  }

  public destroy(): void {}
}
