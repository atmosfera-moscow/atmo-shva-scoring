import { ReactComponent as IconCollapse } from '@assets/img/collapse.svg'
import { ReactComponent as IconExpand } from '@assets/img/expand.svg'
import {
  FixedLayout,
  Footer,
  Group,
  IconButton,
  Panel,
  PanelHeader,
  Search,
  Spacing,
  Spinner,
  Tabbar,
  TabbarItem,
  Text,
} from '@vkontakte/vkui'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import blockGif from '@assets/img/cat_wait.gif'
import { PersonCard } from '@components/PersonCard'
import { ePeopleSort, eTabbarItemIds } from '@src/shared/enums'
import { iFormat, iPerson, iSort } from '@src/shared/types'
import { Icon28ComputerOutline, Icon28UsersOutline } from '@vkontakte/icons'
import '../../index.css'
import { iPeoplePanelProps } from '../types'
import { CHUNK_SIZE } from './consts'
import { searchPersons, shiftCurPerson, sortPersons } from './helpers'
import './index.css'

export const PanelPeople: FC<iPeoplePanelProps> = ({
  fetchedUser,
  curPerson,
  setActivePanel,
  scoringInfo,
  ...rest
}) => {
  const [tabbarItemId, setTabbarItemId] = useState<eTabbarItemIds>(curPerson?.eduFormat || eTabbarItemIds.Offline)
  const [format, setFormat] = useState<iFormat>()
  const [peopleSearch, setPeopleSearch] = useState<string>('')
  const [peopleSort, setPeopleSort] = useState<iSort | null>(ePeopleSort.SUM)
  const [isPeopleCardsCollapsed, setIsPeopleCardsCollapsed] = useState<boolean>(true)

  const [persons, setPersons] = useState<iPerson[]>([])
  const [shownPersons, setShownPersons] = useState<iPerson[]>([])
  const [scrolledPersons, setScrolledPersons] = useState<iPerson[]>([])
  const [hasPersonsToScroll, setHasPersonsToScroll] = useState<boolean>(true)
  const [scrollChunkNum, setScrollChunkNum] = useState<number>(1)

  useEffect(() => {
    console.log(new Date().toTimeString(), 'tabbarItemId hook called')
    const localFormat = tabbarItemId === eTabbarItemIds.Online
    //  ? scoringInfo.online : scoringInfo.offline
    setFormat(localFormat)
    // setPersons(localFormat.persons)
    setPeopleSearch('')
    console.log(new Date().toTimeString(), 'tabbarItemId hook ended')
  }, [tabbarItemId])

  useEffect(() => {
    console.log(new Date().toTimeString(), 'peopleSort, peopleSearch  hook called')
    if (!persons) {
      return
    }
    // console.log(persons.length, { tabbarItemId })
    let localShownPersons = persons
    // if (peopleSort) {
    //   localShownPersons = sortPersons({ persons: localShownPersons, ...peopleSort })
    // }
    if (peopleSearch !== '') {
      localShownPersons = searchPersons({ persons: localShownPersons, value: peopleSearch })
    }
    resetShownPersons(localShownPersons)
    console.log(new Date().toTimeString(), 'peopleSort, peopleSearch hook ended')
    // }, [peopleSort, peopleSearch, persons])
  }, [peopleSearch, persons])

  const resetShownPersons = (localShownPersons = persons): void => {
    localShownPersons = shiftCurPerson({ persons: localShownPersons, curPerson: curPerson })
    setShownPersons(localShownPersons)
    resetScrolledPersons(localShownPersons)
  }

  const fetchDataToScroll = (
    localShownPersons: iPerson[] = shownPersons,
    localScrollChunkNum: number = scrollChunkNum
  ): void => {
    console.log(new Date().toTimeString(), 'fetchDataToScroll called')
    if (localScrollChunkNum * CHUNK_SIZE >= localShownPersons.length - 1) {
      setScrolledPersons(localShownPersons)
      setHasPersonsToScroll(false)
      // console.log(localShownPersons)
    } else {
      const endIndex = localScrollChunkNum * CHUNK_SIZE
      setScrolledPersons(localShownPersons.slice(0, endIndex))
      setHasPersonsToScroll(true)
      // console.log(localShownPersons.slice(0, endIndex))
    }
    setScrollChunkNum(localScrollChunkNum + 1)
    console.log(new Date().toTimeString(), 'fetchDataToScroll ended')
  }

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchString = e.target.value || ''
    setPeopleSearch(searchString)
  }

  const resetScrolledPersons = (localShownPersons: iPerson[] = shownPersons): void => {
    console.log('resetScrolledPersons called')
    window.scrollTo(0, 0)
    setScrollChunkNum(1)
    fetchDataToScroll(localShownPersons, 1)
  }

  const panelHeader = (
    <FixedLayout vertical="top">
      <PanelHeader delimiter="none">Участники ШВА</PanelHeader>
      <div className="people-panel__header">
        <Search
          autoFocus
          className="people-panel__header-search"
          placeholder="Имя, фамилия или бейдж"
          value={peopleSearch}
          onChange={onSearchChange}
        />
        <div className="people-panel__header-buttons">
          {isPeopleCardsCollapsed ? (
            <IconButton aria-label="expand button" onClick={() => setIsPeopleCardsCollapsed(!isPeopleCardsCollapsed)}>
              <IconExpand className="people-panel__header-buttons-expand-svg" />
            </IconButton>
          ) : (
            <IconButton aria-label="collapse button" onClick={() => setIsPeopleCardsCollapsed(!isPeopleCardsCollapsed)}>
              <IconCollapse className="people-panel__header-buttons-collapse-svg" />
            </IconButton>
          )}
        </div>
      </div>
    </FixedLayout>
  )

  const panelFooter = (
    <>
      <FixedLayout vertical="bottom">
        <Footer>
          {shownPersons && shownPersons.length > 0
            ? `${
                shownPersons.length % 10 === 1
                  ? 'Найден ' + shownPersons.length.toString() + ' участник'
                  : shownPersons.length % 10 > 1 && shownPersons.length % 10 < 5
                    ? 'Найдено ' + shownPersons.length.toString() + ' участника'
                    : 'Найдено ' + shownPersons.length.toString() + ' участников'
              }`
            : 'Никого не найдено'}
        </Footer>

        <Tabbar plain={true}>
          <TabbarItem
            selected={tabbarItemId === eTabbarItemIds.Offline}
            text={eTabbarItemIds.Offline}
            onClick={() => setTabbarItemId(eTabbarItemIds.Offline)}
          >
            <Icon28UsersOutline />
          </TabbarItem>

          <TabbarItem
            selected={tabbarItemId === eTabbarItemIds.Online}
            text={eTabbarItemIds.Online}
            onClick={() => setTabbarItemId(eTabbarItemIds.Online)}
          >
            <Icon28ComputerOutline />
          </TabbarItem>
        </Tabbar>
      </FixedLayout>
    </>
  )

  const content = (
    <Group className="people-panel__content">
      {scrolledPersons && scrolledPersons.length > 0 && (
        <InfiniteScroll
          dataLength={scrolledPersons.length}
          next={fetchDataToScroll}
          hasMore={hasPersonsToScroll}
          loader={<Spinner size="small" style={{ margin: '20px 0' }} />}
        >
          {scrolledPersons.map((person, index) => (
            <PersonCard
              key={`${index} ${person.vkID}`}
              person={person}
              isCurPerson={person === curPerson}
              // scoringMeta={undefined}
              // medalsMeta={scoringInfo}
              isCardsCollapsed={isPeopleCardsCollapsed}
            />
          ))}
        </InfiniteScroll>
      )}
    </Group>
  )

  const updating = (
    <div className="people-panel__updating-content">
      <Text className="people-panel__updating-content-text">Рейтинг на обновлении</Text>
      <img src={blockGif} alt="Access denied" className="people-panel__updating-content-image" />
    </div>
  )

  return (
    <Panel {...rest}>
      {panelHeader}
      <Spacing size={100} />
      {(format) || fetchedUser?.isAppModerator ? content : updating}
      <Spacing size={60} />
      {panelFooter}
    </Panel>
  )
}
