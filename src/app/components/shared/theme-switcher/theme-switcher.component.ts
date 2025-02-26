import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-theme-switcher',
  imports: [IonicModule],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent implements OnInit {
  isDarkMode: boolean = false;

  ngOnInit() {
    // Load saved theme if it exists, otherwise use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
    }
    this.applyTheme();

    // Listen for system theme changes (optional)
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          // Only update if user hasn't set a preference
          this.isDarkMode = e.matches;
          this.applyTheme();
        }
      });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('ion-palette-dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('ion-palette-dark');
    }
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }
}
