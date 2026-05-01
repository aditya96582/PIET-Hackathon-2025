class NavigationStore {
  private static instance: NavigationStore;
  private currentPage: string = '/';
  private pageData: Record<string, any> = {};
  private scrollPositions: Record<string, number> = {};

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): NavigationStore {
    if (!NavigationStore.instance) {
      NavigationStore.instance = new NavigationStore();
    }
    return NavigationStore.instance;
  }

  savePage(path: string, data?: any, scrollPosition?: number) {
    this.currentPage = path;
    if (data) {
      this.pageData[path] = data;
    }
    if (scrollPosition !== undefined) {
      this.scrollPositions[path] = scrollPosition;
    }
    this.saveToStorage();
  }

  getPageData(path: string): any {
    return this.pageData[path] || null;
  }

  getScrollPosition(path: string): number {
    return this.scrollPositions[path] || 0;
  }

  getCurrentPage(): string {
    return this.currentPage;
  }

  private saveToStorage() {
    try {
      localStorage.setItem('kisan-sathi-navigation', JSON.stringify({
        currentPage: this.currentPage,
        pageData: this.pageData,
        scrollPositions: this.scrollPositions
      }));
    } catch (error) {
      console.warn('Failed to save navigation state:', error);
    }
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('kisan-sathi-navigation');
      if (saved) {
        const data = JSON.parse(saved);
        this.currentPage = data.currentPage || '/';
        this.pageData = data.pageData || {};
        this.scrollPositions = data.scrollPositions || {};
      }
    } catch (error) {
      console.warn('Failed to load navigation state:', error);
    }
  }
}

export const navigationStore = NavigationStore.getInstance();

export const useNavigationPersistence = (path: string) => {
  const savePage = (data?: any) => {
    const scrollPosition = window.scrollY;
    navigationStore.savePage(path, data, scrollPosition);
  };

  const restorePage = () => {
    const data = navigationStore.getPageData(path);
    const scrollPosition = navigationStore.getScrollPosition(path);
    
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 100);

    return data;
  };

  return { savePage, restorePage };
};