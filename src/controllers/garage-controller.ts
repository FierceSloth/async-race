import { api } from '@/api/api';
import { gameEmitter } from '@/common/utils/emitter';
import type { ICar } from '@/common/types/types';
import type { GaragePage } from '@pages/garage-page/garage-page';

export class GarageController {
  private view: GaragePage;
  private currentPage = 1;

  constructor(view: GaragePage) {
    this.view = view;

    this.addControlsListeners();
    this.addTracksListeners();

    void this.renderView();
  }

  private addControlsListeners(): void {
    this.view.controls.createCarButton.addListener('click', () => {
      this.view.modal.open(async (carData) => {
        console.log(carData);
        // TODO: add api integration
        await this.renderView();
      });
    });
  }

  private addTracksListeners(): void {
    gameEmitter.on<ICar>('track:settings-button-click', (carData) => {
      console.log(carData);
      this.view.modal.open(async () => {
        // TODO: add api integration
        await this.renderView();
      }, carData);
    });
  }

  private async renderView(): Promise<void> {
    try {
      const carsResponse = await api.getCars(this.currentPage);
      const { cars, total } = carsResponse;

      this.view.trackList.renderList(cars);
      this.view.controls.updateCarCounter(total);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  }
}
