import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase/supabase.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  email: string = '';
  displayName: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async register() {
    if (this.password !== this.confirmPassword) {
      this.presentToast('Les MDP ne matchent pas !');
      return;
    }

    const { data, error } = await this.supabaseService.signUp({
      email: this.email,
      password: this.password,
      options: { data: { display_name: this.displayName } },
    });

    if (error) {
      this.presentToast('Enregistrement raté: ' + error.message);
    } else {
      this.presentToast('Bienvenue ! Confirme ton e-mail pour te connecter.');
      this.router.navigate(['/login']);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }
}
