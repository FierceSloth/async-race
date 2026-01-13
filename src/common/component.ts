import type { IComponent } from '@app-types/types';

export class Component<T extends HTMLElement = HTMLElement> {
  public readonly node: T;

  constructor(
    { tag = 'div', className = '', text = '', attrs: attributes = {} }: IComponent,
    ...children: Component[]
  ) {
    const node = document.createElement(tag) as T;
    node.textContent = text;
    this.node = node;

    if (className) {
      if (Array.isArray(className)) {
        node.classList.add(...className);
      } else {
        node.className = className;
      }
    }

    Object.entries(attributes).forEach(([key, value]) => {
      node.setAttribute(key, value);
    });

    if (children.length > 0) {
      children.forEach((child) => {
        this.append(child);
      });
    }
  }

  public setText(text: string): this {
    this.node.textContent = text;
    return this;
  }

  public addClass(className: string): this {
    this.node.classList.add(className);
    return this;
  }

  public removeClass(className: string): this {
    this.node.classList.remove(className);
    return this;
  }

  public toggleClass(className: string, condition?: boolean): this {
    if (condition === undefined) {
      this.node.classList.toggle(className);
    } else {
      this.node.classList.toggle(className, condition);
    }
    return this;
  }

  public setAttribute(attribute: string, value: string): this {
    this.node.setAttribute(attribute, value);
    return this;
  }

  public removeAttribute(attribute: string): this {
    this.node.removeAttribute(attribute);
    return this;
  }

  public append(child: Component): this {
    this.node.append(child.node);
    return this;
  }

  public appendChildren(children: Component[]): this {
    children.forEach((child) => {
      this.append(child);
    });
    return this;
  }

  public destroyChildren(): void {
    this.node.replaceChildren();
  }

  /**
   * Adds an event listener with strict type checking.
   *
   * Note: Complex typing logic (Generics + Mapped Types) is used here.
   * This ensures that IDE autocomplete works correctly (e.g., inferring MouseEvent for 'click').
   *
   * ! Adapted this implementation from a ready-made solution, because my
   * ! knowledge is insufficient to typify it without using 'any' !!!.
   *
   * @param event - The name of the event (e.g., 'click').
   * @param listener - The callback function.
   * @param options - Standard addEventListener options.
   *
   */
  public addListener<K extends keyof HTMLElementEventMap>(
    event: K,
    listener: (this: T, event_: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): this {
    this.node.addEventListener(event, listener as unknown as EventListener, options);
    return this;
  }

  public removeListener<K extends keyof HTMLElementEventMap>(
    event: K,
    listener: (this: T, event_: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): this {
    this.node.removeEventListener(event, listener as unknown as EventListener, options);
    return this;
  }

  public destroy(): void {
    this.node.remove();
  }
}
