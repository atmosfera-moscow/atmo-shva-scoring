import { iSort } from './types'

export const ePeopleSort: { [k: string]: iSort } = {
  NAME: { key: 'name', order: 1 } as unknown as iSort,
  SURNAME: { key: 'surname', order: 1 } as unknown as iSort,
  PLACE: { key: 'place', order: 1 } as unknown as iSort,
  SUM: { key: 'sum', order: -1 } as unknown as iSort,
}

export enum eViewIds {
  Block = 'block',
  NotLoaded = 'notloaded',
  Loader = 'loader',
  Main = 'main',
  Admin = 'admin',
}

export enum ePanelIds {
  People = 'people',
  Block = 'block',
  NotLoaded = 'notloaded',
  Loader = 'loader',
  Admin = 'admin',
}

export enum eTabbarItemIds {
  Offline = 'Оффлайн',
  Online = 'Онлайн',
}
