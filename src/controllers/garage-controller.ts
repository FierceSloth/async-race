import { api } from '@api/api';
import { gameEmitter } from '@utils/emitter';
import type { ICar } from '@app-types/types';
import type { GaragePage } from '@pages/garage-page/garage-page';
import { getRandomColor, getRandomName } from '@utils/random';
import { DEFAULT_CARS } from '@constants/cat-car-brands';
import { CARS_TO_GENERATE, carsLimit, STORAGE_KEY } from '@constants/constants';

const returnAnimationDuration = 1000;

export class GarageController {
  private view: GaragePage;
  private currentPage: number;
  private animations = new Map<number, number>();
  private activeCars = new Set<number>();

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
  //? ========================================================================== */
  //*                               View Methods                                 */
  //? ========================================================================== */

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

  //? ========================================================================== */
  //*                          Listeners Initialization                          */
  //? ========================================================================== */

  private addControlsListeners(): void {
    this.view.controls.createCarButton.addListener('click', () => {
      void this.createCarHandler();
    });

    this.view.controls.generateCarsButton.addListener('click', () => {
      void this.generateCarsHandler();
    });

    this.view.controls.resetButton.addListener('click', () => {
      void this.resetCarsHandler();
    });
  }

  private addTracksListeners(): void {
    gameEmitter.on<number>('track:race-button-click', (carId) => {
      void this.raceCarHandler(carId);
    });
    gameEmitter.on<number>('track:reset-button-click', (carId) => {
      void this.resetCarHandler(carId);
    });
    gameEmitter.on<ICar>('track:remove-button-click', (carData) => {
      void this.removeCarHandler(carData);
    });
    gameEmitter.on<ICar>('track:settings-button-click', (carData) => {
      void this.settingsCarHandler(carData);
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

  //? ========================================================================== */
  //*                              Listeners Handler                             */
  //? ========================================================================== */

  //? =========== Track Handlers ===================

  private async raceCarHandler(id: number): Promise<void> {
    const track = this.view.trackList.tracks.get(id);
    const controls = this.view.controls;
    if (!track) return;

    this.stopAnimation(id);
    this.activeCars.add(id);

    gameEmitter.emit('ui:toggle-blocking', true);
    track.setPending(true);
    controls.setPending(true);

    try {
      const response = await api.startEngine(id);
      track.setPending(false);
      track.setRunning(true);

      controls.setPending(false);

      const { distance, velocity } = response;
      const time = distance / velocity;

      this.animateCar(id, time);
      await api.driveEngine(id);
    } catch (error) {
      if (error instanceof Error && error.message === 'Car has been broken down') {
        this.stopAnimation(id);
      } else {
        console.error(error);
      }
    }
  }

  private async resetCarHandler(id: number): Promise<void> {
    const track = this.view.trackList.tracks.get(id);
    if (!track) return;

    this.stopAnimation(id);
    this.activeCars.delete(id);

    track.setPending(true);

    setTimeout(() => {
      if (this.activeCars.size === 0) {
        gameEmitter.emit('ui:toggle-blocking', false);
      }

      track.setPending(false);
      track.setRunning(false);
    }, returnAnimationDuration);

    this.animateReturn(id);
    await api.stopEngine(id);
  }

  private async removeCarHandler(carData: ICar): Promise<void> {
    await api.deleteCar(carData);
    await this.renderView();
  }

  private settingsCarHandler(carData: ICar): void {
    this.view.modal.open(async (newCarData) => {
      await api.updateCar({
        id: carData.id,
        ...newCarData,
      });
      await this.renderView();
    }, carData);
  }

  //? ========== Main Control Handlers =============

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

  private async resetCarsHandler(): Promise<void> {
    const controls = this.view.controls;
    controls.setPending(true);

    const promises = [...this.activeCars].map((carId: number) => {
      return this.resetCarHandler(carId);
    });

    await Promise.all(promises);
  }

  private createCarHandler(): void {
    this.view.modal.open(async (carData) => {
      await api.createCar(carData);
      await this.renderView();
    });
  }

  // ? ========== Pagination Handlers =============

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

  //? ========================================================================== */
  //*                                Utils Methods                               */
  //? ========================================================================== */

  private animateCar(carId: number, duration: number): void {
    const carElement = document.querySelector<HTMLElement>(`#car-${carId}`);
    const trackElement = carElement?.parentElement;
    if (!carElement || !trackElement) return;

    let start: null | number = null;

    const trackWidth = trackElement.clientWidth || window.innerWidth;

    const carWidth = carElement.clientWidth;

    const distanceToDrive = trackWidth - carWidth;

    const step = (timestamp: number): void => {
      if (!start) start = timestamp;

      const progressPercent = Math.min((timestamp - start) / duration, 1);
      const px = progressPercent * distanceToDrive;

      if (carElement) carElement.style.transform = `translateX(${px}px)`;

      if (progressPercent < 1) {
        const requestId = requestAnimationFrame(step);
        this.animations.set(carId, requestId);
      } else {
        this.animations.delete(carId);
      }
    };

    const requestId = requestAnimationFrame(step);
    this.animations.set(carId, requestId);
  }

  private animateReturn(carId: number): void {
    const carElement = document.querySelector<HTMLElement>(`#car-${carId}`);
    if (!carElement) return;

    this.stopAnimation(carId);

    const currentStyle = getComputedStyle(carElement);
    const matrix = new DOMMatrix(currentStyle.transform);
    const currentTranslateX = matrix.m41;

    if (currentTranslateX <= 0) return;

    let start: number | null = null;

    const step = (timestamp: number): void => {
      if (!start) start = timestamp;
      const progressPercent = (timestamp - start) / returnAnimationDuration;

      const newTranslateX = currentTranslateX * (1 - progressPercent);

      if (progressPercent < 1) {
        carElement.style.transform = `translateX(${newTranslateX}px)`;

        const requestId = requestAnimationFrame(step);
        this.animations.set(carId, requestId);
      } else {
        carElement.style.transform = 'translateX(0px)';
        this.animations.delete(carId);
      }
    };

    const requestId = requestAnimationFrame(step);
    this.animations.set(carId, requestId);
  }

  private stopAnimation(carId: number): void {
    const requestId = this.animations.get(carId);
    if (requestId) {
      cancelAnimationFrame(requestId);
      this.animations.delete(carId);
    }
  }
}
