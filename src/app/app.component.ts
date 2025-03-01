import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LoadingService } from './services/loading/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private loadingService: LoadingService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    // await this.loadingService.showLoading({ duration: 2000 });

    // this.platform.ready().then(async () => {
    //   // Put your initialization logic here
    //   // For example, loading config, checking auth, etc.
    //   try {
    //     await this.performInitialSetup();
    //   } catch (error) {
    //     console.error('Initialization error:', error);
    //   } finally {
    //     await this.loadingService.hideLoading();
    //   }
    // });
  }

  private async performInitialSetup() {
    // Simulate some async initialization tasks
  }
}
