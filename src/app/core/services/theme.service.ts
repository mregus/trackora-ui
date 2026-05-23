import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'trackora-theme';

  theme = signal<ThemeMode>(
    (localStorage.getItem(this.storageKey) as ThemeMode) || 'light'
  );

  constructor() {
    this.applyTheme(this.theme());
  }

  toggleTheme(): void {
    const nextTheme: ThemeMode = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(nextTheme);
    localStorage.setItem(this.storageKey, nextTheme);
    this.applyTheme(nextTheme);
  }

  private applyTheme(theme: ThemeMode): void {
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }
}
