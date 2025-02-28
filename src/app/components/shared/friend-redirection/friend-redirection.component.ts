import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-friend-redirection',
  imports: [IonicModule, RouterModule],
  templateUrl: './friend-redirection.component.html',
  styleUrl: './friend-redirection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendRedirectionComponent {}
