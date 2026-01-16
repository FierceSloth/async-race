import { Router } from '@/router/router';
import { Card } from './components/layout/card/card';
import { Component } from './common/component';

export class App {
  public readonly container: Component;
  public readonly router: Router;

  constructor() {
    const card = new Card({ className: ['card'] });
    this.container = card.contentContainer;

    const pageContainer = new Component({ className: ['pageContainer'] }, card);
    document.body.append(pageContainer.node);

    this.router = new Router(this);
  }

  public start(): void {
    this.router.listen();
  }

  public clearContainer(): void {
    this.container.destroyChildren();
  }
}
