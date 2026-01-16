import { DefaultPath, PagePath } from '@enums/enums';

import { GaragePage } from '@pages/garage-page/garage-page';
import { WinnersPage } from '@pages/winners-page/winners-page';
import { NotFound } from '@pages/not-found/not-found';

import { appEmitter } from '@/common/utils/emitter';
import type { IPage } from '@app-types/types';
import type { App } from '@/app';

export class Router {
  private pages: Record<string, IPage>;
  private app: App;
  private currentPath = '';

  private basePath: string;

  constructor(app: App) {
    this.pages = {
      [PagePath.GARAGE]: new GaragePage(app.container),
      [PagePath.WINNERS]: new WinnersPage(app.container),
      [PagePath.NOT_FOUND]: new NotFound(app.container),
    };
    this.app = app;

    const base = import.meta.env.BASE_URL;
    this.basePath = base.endsWith('/') ? base.slice(0, -1) : base;

    appEmitter.on<PagePath>('router:navigate', (page) => {
      this.navigate(page);
    });
  }

  public route(): void {
    let path = globalThis.location.pathname;

    if (this.basePath && path.startsWith(this.basePath)) {
      path = path.replace(this.basePath, '');
    }

    if (path === (DefaultPath.EMPTY as string) || path === (DefaultPath.SLASH as string)) {
      this.navigate(PagePath.GARAGE);
      return;
    }

    if (this.currentPath === path) return;

    if (this.currentPath) {
      const previousPage = this.pages[this.currentPath];
      if (previousPage) {
        previousPage.destroy();
      }
    }

    this.currentPath = path;
    appEmitter.emit('router:page-changed', this.currentPath);

    const page = this.pages[path] || this.pages[PagePath.NOT_FOUND];

    this.app.clearContainer();
    page.render();
  }

  public navigate(path: string): void {
    const fullPath = this.basePath ? `${this.basePath}${path}` : path;
    globalThis.history.pushState({}, '', fullPath);
    this.route();
  }

  public listen(): void {
    globalThis.addEventListener('popstate', () => {
      this.route();
    });
    this.route();
  }
}
