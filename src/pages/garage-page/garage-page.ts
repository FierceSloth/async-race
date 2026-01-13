import type { Component } from '@common/component';

// import styles from './garage-page.module.scss';

export class GaragePage {
  private container: Component;

  constructor(container: Component) {
    this.container = container;
  }

  public render(): void {
    this.container.node.innerHTML = '<h1> Garage Page </h1>';
  }

  // public destroy(): void {
  // }
}
