import { Component } from '@common/component';
import type { ICar, IComponentChild } from '@app-types/types';
import styles from './track-list.module.scss';
import { CarTrack } from '../car-track/car-track';

interface IProps extends IComponentChild {}

export class TrackList extends Component {
  public tracks = new Map<number, CarTrack>();

  constructor({ className = [] }: IProps) {
    super({ className: [styles.trackList, ...className] });
  }

  public renderList(cars: ICar[]): void {
    this.destroyChildren();
    this.tracks.clear();

    cars.forEach((option) => {
      const track = new CarTrack({ carAttrs: option });
      this.tracks.set(option.id, track);
      this.append(track);
    });
  }
}
