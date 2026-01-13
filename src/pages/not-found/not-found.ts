import type { Component } from '@common/component';

// import styles from './not-found.scss';

export class NotFound {
  private container: Component;

  constructor(container: Component) {
    this.container = container;
  }

  public render(): void {
    this.container.node.innerHTML = '<h1> 404 Not Found </h1>';
  }

  // public destroy(): void {
  // }
}
