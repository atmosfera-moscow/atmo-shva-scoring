import { eModalIds, eFilterStats } from '@shared/enums';
import { iPerson, iStat, iStatRow } from '@shared/types';
import { ru } from 'convert-layout'
import _ from 'lodash'

export const searchPersons = (p: { persons: iPerson[]; value: string }): iPerson[] => {
  console.log('searchPersons called')
  let localPersons = p.persons
  if (p.value !== '') {
    // TODO: only for eng?
    p.value = ru.fromEn(p.value)
    p.value = p.value.toUpperCase()
    p.value = p.value.replace('Ё', 'Е')
    localPersons = localPersons.filter(
      (person) =>
        p.value === '' ||
        (person.nickname && person.nickname.toUpperCase().replace('Ё', 'Е').includes(p.value)) ||
        (person.name &&
          person.surname &&
          `${person.name} ${person.surname}`.toUpperCase().replace('Ё', 'Е').includes(p.value)) ||
        (person.name &&
          person.surname &&
          `${person.surname} ${person.name}`.toUpperCase().replace('Ё', 'Е').includes(p.value))
    )
  }
  return localPersons
}

export const sortPersons = (p: { persons: iPerson[]; key: string; order: 1 | -1 }): iPerson[] => {
  if (p.persons.length === 0) {
    return p.persons
  }
  if (p.persons.length > 1 && !_.get(p.persons[0], p.key)) {
    return p.persons
  }

  let localPersons = p.persons.sort((a, b) => {
    let fieldA, fieldB: string | number
    switch (p.key) {
      case 'name':
        fieldA = `${a.name} ${a.surname}`.toUpperCase()
        fieldB = `${b.name} ${b.surname}`.toUpperCase()
        break
      case 'surname':
        fieldA = `${a.surname} ${a.name}`.toUpperCase()
        fieldB = `${b.surname} ${b.name}`.toUpperCase()
        break
      default:
        fieldA = _.get(a, p.key) || ''
        fieldB = _.get(b, p.key) || ''
        fieldA = typeof fieldA == 'string' ? fieldA.toUpperCase() : fieldA
        fieldB = typeof fieldB == 'string' ? fieldB.toUpperCase() : fieldB
    }
    return fieldA < fieldB ? -1 * p.order : fieldA > fieldB ? 1 * p.order : 0
  })
  return localPersons
}

export const filterPersons = (p: { persons: iPerson[]; key: string; value: string | number | boolean }): iPerson[] => {
  if (p.persons.length === 0) {
    return p.persons
  }
  if (p.persons.length > 1 && !_.get(p.persons[0], p.key)) {
    return p.persons
  }

  if (typeof p.value === 'string' && p.value.includes(' | ')) {
    p.value = p.value.split(' | ')[1]
  }

  let localPersons = p.persons.filter((person) => {
    let field = _.get(person, p.key)
    if (field === undefined || field === null) {
      return false
    }

    if (typeof field === 'boolean' || typeof field === 'number') {
      return field === p.value
    }

    if (Array.isArray(field)) {
      field = field.join('')
    }

    const isIncludes = field.toString().trim().toUpperCase().includes(p.value.toString().trim().toUpperCase())
    return isIncludes
  })

  return localPersons
}

export const shiftCurPerson = (p: { persons: iPerson[]; curPerson: iPerson | undefined }): iPerson[] => {
  p.curPerson &&
    p.persons.includes(p.curPerson) &&
    p.persons.unshift(
      p.persons.splice(
        p.persons.findIndex((item) => item === p.curPerson),
        1
      )[0]
    )
  return p.persons
}

export function getModalId(value: string): eModalIds {
  const indexOfS = Object.values(eModalIds).indexOf(value as unknown as eModalIds)
  return Object.keys(eModalIds)[indexOfS] as unknown as eModalIds
}

export const getPeopleFilters = (p: { stats: iStat[] }): iStatRow[] => {
  let statRows: iStatRow[] = []
  p.stats.forEach((stat) => {
    if (eFilterStats.includes(stat.stat_id as unknown as eModalIds)) {
      stat.rows.forEach((row) => {
        statRows.push(row)
      })
    }
  })
  return statRows
}
