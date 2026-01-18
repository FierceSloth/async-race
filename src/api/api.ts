import type { ICar, IGetCarsResponse } from '@app-types/types';
import { pageLimit } from '@constants/constants';

class Api {
  private readonly baseUrl = 'http://127.0.0.1:3000';

  private readonly garageUrl = `${this.baseUrl}/garage`;
  // private readonly engineUrl = `${this.baseUrl}/engine`;
  // private readonly winnersUrl = `${this.baseUrl}/winners`;

  private readonly pageLimit = pageLimit;

  public async getCars(page: number): Promise<IGetCarsResponse> {
    try {
      const response = await fetch(`${this.garageUrl}?_page=${page}&_limit=${this.pageLimit}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch cars: ${response.statusText}`);
      }

      const cars = await response.json();
      const totalCars = Number(response.headers.get('X-Total-Count')) || 0;

      return {
        cars,
        total: totalCars,
      };
    } catch (error) {
      console.error(`Error fetching cars:`, error);

      return {
        cars: [],
        total: 0,
      };
    }
  }

  public async getCar(id: number): Promise<ICar | null> {
    try {
      const response = await fetch(`${this.garageUrl}/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to get car`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching car ${id}:`, error);
      return null;
    }
  }
}

export const api = new Api();
