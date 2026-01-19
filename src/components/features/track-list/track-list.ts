import { Component } from '@common/component';
import type { IComponentChild } from '@app-types/types';
import styles from './track-list.module.scss';
import { api } from '@api/api';
import { gameEmitter } from '@/common/utils/emitter';
import { CarTrack } from '../car-track/car-track';

interface IProps extends IComponentChild {}

export class TrackList extends Component {
  constructor({ className = [] }: IProps) {
    super({ className: [styles.trackList, ...className] });
  }

  public async renderList(page: number): Promise<void> {
    this.destroyChildren();

    try {
      const carsResponse = await api.getCars(page);

      const { cars, total } = carsResponse;

      gameEmitter.emit('cars:total-cars-update', total);

      cars.forEach((option) => {
        const track = new CarTrack({ carAttrs: option });
        this.append(track);
      });
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  }
}
