// src/app/services/loading.service.ts
import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) {}

  async showLoading({
    message,
    duration,
  }: {
    message?: string;
    duration?: number;
  }) {
    if (this.loading) {
      await this.loading.dismiss();
    }

    this.loading = await this.loadingController.create({
      message,
      duration,
      spinner: "bubbles",
      cssClass: "custom-loading",
    });

    await this.loading.present();
  }

  async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
