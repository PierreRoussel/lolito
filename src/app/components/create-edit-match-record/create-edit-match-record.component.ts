import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PushupRecord } from 'src/app/services/pushups/pushup.model';
import { PushupService } from 'src/app/services/pushups/pushup.service';
import { getPushUpNumber } from 'src/app/utils/pushup-calculator.utils';

@Component({
  selector: 'app-create-edit-match-record',
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './create-edit-match-record.component.html',
  styleUrl: './create-edit-match-record.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditMatchRecordComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<PushupRecord>();
  @Input() match?: PushupRecord;

  newRecord: PushupRecord = {
    deaths: 0,
    isWin: false,
    hasPentakill: false,
    pentakillNumber: 0,
    date: new Date(),
    hasSurrender: false,
  };
  pushups: number | null = null;

  ngOnInit(): void {
    if (this.match)
      this.newRecord = {
        deaths: this.match.deaths,
        isWin: this.match.isWin,
        hasPentakill: this.match.hasPentakill,
        pentakillNumber: this.match.pentakillNumber,
        date: this.match.date,
        hasSurrender: this.match.hasSurrender,
      };
  }

  async saveMatch() {
    if (this.newRecord.deaths >= 0) {
      const pushUpNumber = Math.ceil(getPushUpNumber(this.newRecord));
      this.newRecord.pushupNumber = pushUpNumber;
      this.formSubmit.emit(this.newRecord);
    }
  }

  resetForm() {
    this.newRecord = {
      deaths: 0,
      date: new Date(),
      isWin: false,
      pentakillNumber: 0,
      hasPentakill: false,
      hasSurrender: false,
    };
  }

  onPentakillChange() {
    if (!this.newRecord.hasPentakill) {
      this.newRecord.pentakillNumber = 0;
    }
  }
}
