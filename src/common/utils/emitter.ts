import type { EmitterEvents } from '@app-types/types';

type Listener<T = unknown> = (data: T) => void;

class EventEmitter {
  private events: Partial<Record<EmitterEvents, Listener[]>> = {};

  public on<T>(event: EmitterEvents, listener: Listener<T>): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener as Listener);
  }

  public off<T>(event: EmitterEvents, listener: Listener<T>): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((l) => l !== (listener as Listener));
  }

  public emit<T>(event: EmitterEvents, data: T): void {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => listener(data));
  }

  public clear(event: EmitterEvents | undefined): void {
    if (event) {
      this.events[event] = [];
    } else {
      this.events = {};
    }
  }
}

export const appEmitter = new EventEmitter();
export const gameEmitter = new EventEmitter();
