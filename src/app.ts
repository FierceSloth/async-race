import { Component } from '@common/component';
import { Router } from '@/router/router';

export class App {
  public readonly container: Component;
  public readonly router: Router;

  constructor() {
    this.container = new Component({ attrs: { id: 'app' } });
    document.body.append(this.container.node);
    
    this.router = new Router(this);
  }

  public start(): void {
    this.router.listen();
  }

  public clearContainer(): void {
    this.container.destroyChildren();
  }
}
