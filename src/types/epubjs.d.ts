declare module "epubjs" {
  export interface NavItem {
    id: string;
    href: string;
    label: string;
    subitems?: NavItem[];
  }

  export interface Location {
    start: { cfi: string };
    end: { cfi: string };
  }

  export interface Rendition {
    display(target?: string): Promise<void>;
    next(): Promise<void>;
    prev(): Promise<void>;
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback: (...args: any[]) => void): void;
    themes: {
      register(name: string, styles: Record<string, any>): void;
      select(name: string): void;
      fontSize(size: string): void;
    };
    annotations: {
      highlight(
        cfiRange: string,
        data?: any,
        callback?: any,
        className?: string,
        styles?: Record<string, string>
      ): void;
      remove(cfiRange: string, type: string): void;
    };
    getRange(cfiRange: string): Range | null;
    destroy(): void;
  }

  export interface Book {
    renderTo(element: HTMLElement, options?: any): Rendition;
    loaded: {
      navigation: Promise<{ toc: NavItem[] }>;
    };
    ready: Promise<void>;
    locations: {
      generate(chars?: number): Promise<string[]>;
      length(): number;
      percentageFromCfi(cfi: string): number;
    };
    spine: any;
    load: any;
    destroy(): void;
  }

  export default function ePub(data: ArrayBuffer | string): Book;
}
