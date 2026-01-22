import { api } from '@/api/api';
import { gameEmitter } from '@/common/utils/emitter';
import type { ICar } from '@/common/types/types';
import type { GaragePage } from '@pages/garage-page/garage-page';
import { getRandomColor, getRandomName } from '@/common/utils/random';
import { DEFAULT_CARS } from '@constants/cat-car-brands';
import { CARS_TO_GENERATE } from '@/common/constants/constants';

export class GarageController {
  private view: GaragePage;
  private currentPage = 1;

  constructor(view: GaragePage) {
    this.view = view;

    this.addControlsListeners();
    this.addTracksListeners();

    void this.renderView();
    void this.updateDefaultCars();
  }

  private addControlsListeners(): void {
    this.view.controls.createCarButton.addListener('click', () => {
      this.view.modal.open(async (carData) => {
        await api.createCar(carData);
        await this.renderView();
      });
    });

    this.view.controls.generateCarsButton.addListener('click', () => {
      void this.generateCarsHandler();
    });
  }

  private addTracksListeners(): void {
    gameEmitter.on<ICar>('track:remove-button-click', (carData) => {
      void (async (): Promise<void> => {
        await api.deleteCar(carData);
        await this.renderView();
      })();
    });
    gameEmitter.on<ICar>('track:settings-button-click', (carData) => {
      this.view.modal.open(async (newCarData) => {
        await api.updateCar({
          id: carData.id,
          ...newCarData,
        });
        await this.renderView();
      }, carData);
    });
  }

  private async generateCarsHandler(): Promise<void> {
    const promises = Array.from({ length: CARS_TO_GENERATE }, () => {
      return api.createCar({
        name: getRandomName(),
        color: getRandomColor(),
      });
    });

    try {
      await Promise.all(promises);
      await this.renderView();
    } catch (error) {
      console.error('Error generating cars:', error);
    }
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

  private async updateDefaultCars(): Promise<void> {
    const promises = Object.entries(DEFAULT_CARS).map(async ([idString, defaultName]) => {
      const id = Number(idString);

      try {
        const car = await api.getCar(id);

        if (!car || car.name !== defaultName) {
          return;
        }

        await api.updateCar({
          id: id,
          name: getRandomName(),
          color: getRandomColor(),
        });
      } catch (error) {
        console.error('Error update default car name:', error);
      }
    });

    await Promise.all(promises);
    await this.renderView();
  }
}
