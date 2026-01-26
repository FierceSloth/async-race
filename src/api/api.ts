import { SortField, SortOrder } from '@/common/enums/enums';
import type {
  ICar,
  IEngineResponse,
  IEngineStatus,
  IGetCarsResponse,
  IWinner,
  IWinnersResponse,
} from '@app-types/types';
import { ERROR_STATUS_404, ERROR_STATUS_500, JSON_HEADERS, carsLimit } from '@constants/constants';

class Api {
  private readonly baseUrl = 'http://127.0.0.1:3000';

  private readonly garageUrl = `${this.baseUrl}/garage`;
  private readonly winnersUrl = `${this.baseUrl}/winners`;
  private readonly engineUrl = `${this.baseUrl}/engine`;

  private readonly carsLimit = carsLimit;

  public async getCars(page: number): Promise<IGetCarsResponse> {
    try {
      const response = await fetch(`${this.garageUrl}?_page=${page}&_limit=${this.carsLimit}`);

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
      throw error;
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

  public async startEngine(id: number): Promise<IEngineResponse> {
    const response = await fetch(`${this.engineUrl}?id=${id}&status=started`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error(`Failed to start engine for car ${id}`);
    }

    return response.json();
  }

  public async stopEngine(id: number): Promise<void> {
    const response = await fetch(`${this.engineUrl}?id=${id}&status=stopped`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error(`Failed to stop engine for car ${id}`);
    }
  }

  public async driveEngine(id: number): Promise<IEngineStatus> {
    const response = await fetch(`${this.engineUrl}?id=${id}&status=drive`, { method: 'PATCH' });
    if (response.status === ERROR_STATUS_500) {
      throw new Error('Car has been broken down');
    }

    if (!response.ok) {
      throw new Error(`Drive mode failed for car ${id}`);
    }
    return response.json();
  }

  public async getWinners(
    page: number,
    sort: SortField = SortField.ID,
    order: SortOrder = SortOrder.ASC
  ): Promise<IWinnersResponse> {
    try {
      const response = await fetch(
        `${this.winnersUrl}?_page=${page}&_limit=${this.carsLimit}&_sort=${sort}&_order=${order}`
      );

      const winners = await response.json();
      const total = Number(response.headers.get('X-Total-Count'));

      return { winners, total };
    } catch (error) {
      console.error(`Error fetching winners:`, error);

      return {
        winners: [],
        total: 0,
      };
    }
  }

  public async getWinner(id: number): Promise<IWinner | null> {
    try {
      const response = await fetch(`${this.winnersUrl}/${id}`);

      if (response.status === ERROR_STATUS_404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to get winner ${id}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching winner ${id}:`, error);
      return null;
    }
  }

  public async createWinner(data: IWinner): Promise<void> {
    try {
      const response = await fetch(`${this.winnersUrl}`, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to create winner`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching winner:`, error);
      return;
    }
  }

  public async updateWinner(id: number, body: { wins: number; time: number }): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/winners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(`Error fetching winner:`, error);
      return;
    }
  }

  public async deleteWinner(id: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/winners/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error(`Error fetching winner:`, error);
      return;
    }
  }
}

export const api = new Api();
