import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase/supabase.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async login() {
    const { data, error } = await this.supabaseService.signIn(
      this.email,
      this.password
    );

    if (error) {
      this.presentToast('Trompé: ' + error.message);
    } else {
      this.presentToast('Prêt à pomper ?!');
      this.router.navigate(['/']);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'secondary',
      position: 'top',
    });
    await toast.present();
  }
}
