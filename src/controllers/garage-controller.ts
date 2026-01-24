import { api } from '@api/api';
import { gameEmitter } from '@utils/emitter';
import type { ICar } from '@app-types/types';
import type { GaragePage } from '@pages/garage-page/garage-page';
import { getRandomColor, getRandomName } from '@utils/random';
import { DEFAULT_CARS } from '@constants/cat-car-brands';
import { CARS_TO_GENERATE, carsLimit, STORAGE_KEY } from '@constants/constants';

export class GarageController {
  private view: GaragePage;
  private currentPage: number;

  constructor(view: GaragePage) {
    this.view = view;

    const savedPage = sessionStorage.getItem(STORAGE_KEY);
    this.currentPage = savedPage ? Number(savedPage) : 1;

    this.addControlsListeners();
    this.addTracksListeners();
    this.addPaginationsListeners();

    void this.renderView();
    void this.updateDefaultCars();
  }

  // ? =============== View Methods =======================

  private async renderView(): Promise<void> {
    sessionStorage.setItem(STORAGE_KEY, this.currentPage.toString());

    try {
      const carsResponse = await api.getCars(this.currentPage);
      const { cars, total } = carsResponse;
      const maxPage = Math.ceil(total / carsLimit);

      if (cars.length <= 0 && this.currentPage > 1) {
        this.currentPage -= 1;
        void this.renderView();
        return;
      }

      this.view.trackList.renderList(cars);
      this.view.controls.updateCarCounter(total);
      this.view.pagination.updatePageCounter(this.currentPage, maxPage || 1);
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

  // ? ============== Listener Methods ====================

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
      void this.removeCarHandler(carData);
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

  private addPaginationsListeners(): void {
    this.view.pagination.prevArrow.addListener('click', () => {
      void this.paginationPrevHandler();
    });
    this.view.pagination.nextArrow.addListener('click', () => {
      void this.paginationNextHandler();
    });
  }

  // ? ============== Listener Handler ====================

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

  private async removeCarHandler(carData: ICar): Promise<void> {
    await api.deleteCar(carData);
    await this.renderView();
  }

  private async paginationPrevHandler(): Promise<void> {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      await this.renderView();
    }
  }

  private async paginationNextHandler(): Promise<void> {
    this.currentPage += 1;
    await this.renderView();
  }
}
