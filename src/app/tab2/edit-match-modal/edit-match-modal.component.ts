import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { PushupRecord } from 'src/app/services/pushups/pushup.model';
import { CreateEditMatchRecordComponent } from '../../components/create-edit-match-record/create-edit-match-record.component';

@Component({
  selector: 'app-edit-match-modal',
  imports: [IonicModule, CreateEditMatchRecordComponent],
  templateUrl: './edit-match-modal.component.html',
  styleUrl: './edit-match-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditMatchModalComponent {
  @Input({ required: true }) match!: PushupRecord;

  constructor(private modalController: ModalController) {}

  save(args: PushupRecord) {
    this.modalController.dismiss(args);
  }

  cancel() {
    this.modalController.dismiss();
  }
}
