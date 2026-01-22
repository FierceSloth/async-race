import type { ICar, IGetCarsResponse } from '@app-types/types';
import { ERROR_STATUS_404, JSON_HEADERS, pageLimit } from '@constants/constants';

class Api {
  private readonly baseUrl = 'http://127.0.0.1:3000';

  private readonly garageUrl = `${this.baseUrl}/garage`;
  private readonly winnersUrl = `${this.baseUrl}/winners`;
  // private readonly engineUrl = `${this.baseUrl}/engine`;

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

  public async createCar(data: Omit<ICar, 'id'>): Promise<ICar | null> {
    try {
      const response = await fetch(`${this.garageUrl}`, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to create car`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching car:`, error);
      return null;
    }
  }

  public async updateCar(data: ICar): Promise<ICar | null> {
    try {
      const { id, color, name } = data;
      const response = await fetch(`${this.garageUrl}/${id}`, {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ color, name }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update car`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching car:`, error);
      return null;
    }
  }

  public async deleteCar(data: ICar): Promise<void> {
    try {
      const { id } = data;
      const garageResponse = await fetch(`${this.garageUrl}/${id}`, {
        method: 'DELETE',
        headers: JSON_HEADERS,
      });

      if (!garageResponse.ok) {
        throw new Error(`Failed to delete car ${id}`);
      }

      const winnersResponse = await fetch(`${this.winnersUrl}/${id}`, {
        method: 'DELETE',
        headers: JSON_HEADERS,
      });

      if (!winnersResponse.ok && winnersResponse.status !== ERROR_STATUS_404) {
        throw new Error(`Failed to delete winner car ${id}`);
      }
    } catch (error) {
      console.error(`Error fetching car:`, error);
    }
  }
}

export const api = new Api();
