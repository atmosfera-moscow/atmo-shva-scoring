import { iPerson } from '@shared/types'
import { ru } from 'convert-layout'

export const searchPersons = (p: { persons: iPerson[]; value: string }): iPerson[] => {
  console.log('searchPersons called')
  let localPersons = p.persons
  if (p.value !== '') {
    // TODO: only for eng?
    p.value = ru.fromEn(p.value)
    p.value = p.value.toUpperCase()
    p.value = p.value.replaceAll('Ё', 'Е')
    localPersons = localPersons.filter(
      (person) =>
        p.value === '' ||
        (person.firstName &&
          person.lastName &&
          `${person.firstName} ${person.lastName}`.toUpperCase().replaceAll('Ё', 'Е').includes(p.value)) ||
        (person.firstName &&
          person.lastName &&
          `${person.lastName} ${person.firstName}`.toUpperCase().replaceAll('Ё', 'Е').includes(p.value)) ||
        (person.firstName && !person.lastName && `${person.firstName}`.toUpperCase().replaceAll('Ё', 'Е').includes(p.value)) ||
        (!person.firstName && person.lastName && `${person.lastName}`.toUpperCase().replaceAll('Ё', 'Е').includes(p.value)) ||
        (person.badge && `${person.badge}`.includes(p.value))
    )
  }
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
