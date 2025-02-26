// src/app/services/pushup.service.ts
import { Injectable } from '@angular/core';
import { PushupRecord } from './pushup.model';
// import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class PushupService {
  private _storage: Storage | null = null;
  private readonly STORAGE_KEY = 'pushup_records';

  constructor() { // private storage: Storage
    this.init();
  }

  async init() {
    // const storage = await this.storage.create();
    // this._storage = storage;
  }

  async addRecord(record: PushupRecord) {
    const records = await this.getRecords();
    record.id = Date.now().toString();
    record.date = new Date();
    records.push(record);
    console.log('🚀 ~ record:', record);
    // await this._storage?.set(this.STORAGE_KEY, records);
    return record;
  }

  async getRecords(): Promise<PushupRecord[]> {
    // const records = await this._storage?.get(this.STORAGE_KEY);
    // return records || [];
    return [];
  }
}
