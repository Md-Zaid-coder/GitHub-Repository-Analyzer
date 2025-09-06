class CacheService {
  private dbName = 'github-analyzer-cache';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('repositories')) {
          const repoStore = db.createObjectStore('repositories', { keyPath: 'fullName' });
          repoStore.createIndex('lastUpdated', 'lastUpdated');
        }

        if (!db.objectStoreNames.contains('analysis')) {
          const analysisStore = db.createObjectStore('analysis', { keyPath: 'fullName' });
          analysisStore.createIndex('lastUpdated', 'lastUpdated');
        }

        if (!db.objectStoreNames.contains('insights')) {
          const insightsStore = db.createObjectStore('insights', { keyPath: 'fullName' });
          insightsStore.createIndex('lastUpdated', 'lastUpdated');
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  async cacheRepository(fullName: string, data: any): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['repositories'], 'readwrite');
    const store = transaction.objectStore('repositories');

    const cacheEntry = {
      fullName,
      data,
      lastUpdated: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    return new Promise((resolve, reject) => {
      const request = store.put(cacheEntry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedRepository(fullName: string): Promise<any | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['repositories'], 'readonly');
    const store = transaction.objectStore('repositories');

    return new Promise((resolve, reject) => {
      const request = store.get(fullName);
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.expiresAt > Date.now()) {
          resolve(result.data);
        } else {
          // Clean up expired entry
          if (result) {
            this.deleteCachedRepository(fullName);
          }
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async cacheAnalysis(fullName: string, data: any): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['analysis'], 'readwrite');
    const store = transaction.objectStore('analysis');

    const cacheEntry = {
      fullName,
      data,
      lastUpdated: Date.now(),
      expiresAt: Date.now() + (12 * 60 * 60 * 1000) // 12 hours
    };

    return new Promise((resolve, reject) => {
      const request = store.put(cacheEntry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedAnalysis(fullName: string): Promise<any | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['analysis'], 'readonly');
    const store = transaction.objectStore('analysis');

    return new Promise((resolve, reject) => {
      const request = store.get(fullName);
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.expiresAt > Date.now()) {
          resolve(result.data);
        } else {
          if (result) {
            this.deleteCachedAnalysis(fullName);
          }
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async cacheInsights(fullName: string, data: any): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['insights'], 'readwrite');
    const store = transaction.objectStore('insights');

    const cacheEntry = {
      fullName,
      data,
      lastUpdated: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours (AI insights don't change often)
    };

    return new Promise((resolve, reject) => {
      const request = store.put(cacheEntry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedInsights(fullName: string): Promise<any | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['insights'], 'readonly');
    const store = transaction.objectStore('insights');

    return new Promise((resolve, reject) => {
      const request = store.get(fullName);
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.expiresAt > Date.now()) {
          resolve(result.data);
        } else {
          if (result) {
            this.deleteCachedInsights(fullName);
          }
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async deleteCachedRepository(fullName: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['repositories'], 'readwrite');
    const store = transaction.objectStore('repositories');
    store.delete(fullName);
  }

  private async deleteCachedAnalysis(fullName: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['analysis'], 'readwrite');
    const store = transaction.objectStore('analysis');
    store.delete(fullName);
  }

  private async deleteCachedInsights(fullName: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['insights'], 'readwrite');
    const store = transaction.objectStore('insights');
    store.delete(fullName);
  }

  async clearAllCache(): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['repositories', 'analysis', 'insights'], 'readwrite');
    
    transaction.objectStore('repositories').clear();
    transaction.objectStore('analysis').clear();
    transaction.objectStore('insights').clear();
  }

  async getCacheSize(): Promise<{ repositories: number; analysis: number; insights: number }> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['repositories', 'analysis', 'insights'], 'readonly');

    const [repoCount, analysisCount, insightsCount] = await Promise.all([
      this.getStoreCount(transaction.objectStore('repositories')),
      this.getStoreCount(transaction.objectStore('analysis')),
      this.getStoreCount(transaction.objectStore('insights'))
    ]);

    return {
      repositories: repoCount,
      analysis: analysisCount,
      insights: insightsCount
    };
  }

  private getStoreCount(store: IDBObjectStore): Promise<number> {
    return new Promise((resolve, reject) => {
      const request = store.count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Service Worker Cache API integration
  async cacheStaticAssets(): Promise<void> {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        const cache = await caches.open('github-analyzer-static-v1');
        await cache.addAll([
          '/',
          '/static/css/main.css',
          '/static/js/main.js',
          '/manifest.json'
        ]);
      } catch (error) {
        console.warn('Failed to cache static assets:', error);
      }
    }
  }

  // Background sync for fresh data
  async fetchAndCacheInBackground(fullName: string, fetchFn: () => Promise<any>, cacheKey: 'repository' | 'analysis' | 'insights'): Promise<void> {
    try {
      const freshData = await fetchFn();
      
      switch (cacheKey) {
        case 'repository':
          await this.cacheRepository(fullName, freshData);
          break;
        case 'analysis':
          await this.cacheAnalysis(fullName, freshData);
          break;
        case 'insights':
          await this.cacheInsights(fullName, freshData);
          break;
      }
    } catch (error) {
      console.warn(`Background fetch failed for ${fullName} (${cacheKey}):`, error);
    }
  }
}

export const cacheService = new CacheService();
