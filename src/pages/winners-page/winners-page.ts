import type { Component } from '@common/component';

// import styles from './winners-page.module.scss';

export class WinnersPage {
  private container: Component;

  constructor(container: Component) {
    this.container = container;
  }

  public render(): void {
    this.container.node.innerHTML = '<h1> Winner Page </h1>';
  }

  public destroy(): void {}
}
