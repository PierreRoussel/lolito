import { PushupRecord } from '../services/pushups/pushup.model';

export function getPushUpNumber(matchRecord: PushupRecord): number {
  let totalNumber = matchRecord.deaths;
  if (!matchRecord.isWin) {
    totalNumber = totalNumber * (matchRecord.hasSurrender ? 3 : 2);
  } else {
    totalNumber = totalNumber * (matchRecord.hasSurrender ? 0.5 : 1);
  }

  if (matchRecord.hasPentakill)
    totalNumber = totalNumber - matchRecord.pentakillNumber * 5;
  return totalNumber > 0 ? totalNumber : 0;
}
