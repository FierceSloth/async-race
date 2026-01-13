import { PagePath } from '@enums/enums';
import { GamePage } from '@pages/game-page/game-page';
import { LoginPage } from '@pages/login-page/login-page';
import { MainPage } from '@pages/main-page/main-page';
import { StatisticsPage } from '@pages/statistics-page/statistics-page';
import { NotFound } from '@pages/not-found-page/not-found';
import { dataManager } from '@/common/utils/data-manager';
import { appEmitter } from '@/common/utils/emitter';
import type { IPage } from '@/common/types/interfaces';
import type { App } from '@/app';

export class Router {
  private pages: Record<string, IPage>;
  private app: App;
  private currentPath = '';

  private basePath: string;

  constructor(app: App) {
    this.pages = {
      [PagePath.LOGIN]: new LoginPage(app.container),
      [PagePath.MAIN]: new MainPage(app.container),
      [PagePath.GAME]: new GamePage(app.container),
      [PagePath.STATISTICS]: new StatisticsPage(app.container),
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

    if (!path || path === '') {
      path = '/';
    }

    const isLogged = dataManager.getUser().name !== '' && dataManager.getUser().surname !== '';

    if (!isLogged && path !== PagePath.LOGIN) {
      this.navigate(PagePath.LOGIN);
      return;
    }

    if (isLogged && path === PagePath.LOGIN) {
      this.navigate(PagePath.MAIN);
      return;
    }

    const isRoundDone = dataManager.getLastResults() !== null;

    if (path === PagePath.STATISTICS && !isRoundDone) {
      this.navigate(PagePath.GAME);
      return;
    }

    if (this.currentPath === path) return;

    this.currentPath = path;
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
