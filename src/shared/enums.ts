import { iSort } from './types'

export const ePersonsSort: { [k: string]: iSort } = {
  NAME: { key: 'name', order: 1 } as unknown as iSort,
  SURNAME: { key: 'surname', order: 1 } as unknown as iSort,
  PLACE: { key: 'place', order: 1 } as unknown as iSort,
  SUM: { key: 'sum', order: -1 } as unknown as iSort,
}

export enum eEduFormats {
  Offline = 'Оффлайн',
  Online = 'Онлайн',
}

export enum eLabelContentTypes {
  main = 'main',
  week = 'week',
}