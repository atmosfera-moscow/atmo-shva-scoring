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
  Snackbar,
  Spacing,
  Spinner,
  Tabbar,
  TabbarItem,
  Text,
} from '@vkontakte/vkui'
import { ChangeEvent, FC, ReactElement, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import blockGif from '@assets/img/cat_wait.gif'
import { PersonCard } from '@views/ViewMain/PanelPersons/PersonCard'
import { eEduFormats } from '@src/shared/enums'
import { iPerson } from '@src/shared/types'
import { Icon28ComputerOutline, Icon28UsersOutline, Icon28WarningTriangleOutline } from '@vkontakte/icons'
import '../index.css'
import { iPersonsPanelProps } from '../types'
import { CHUNK_SIZE } from './consts'
import { searchPersons, shiftCurPerson } from './helpers'
import './index.css'

export const PanelPersons: FC<iPersonsPanelProps> = ({ userInfo, scoringInfo, setActivePanel, ...rest }) => {
  const { curPerson } = userInfo

  const [tabbarItemId, setTabbarItemId] = useState<eEduFormats>(curPerson?.eduFormat || eEduFormats.Offline)
  const [format, setFormat] = useState<eEduFormats>()
  const [isFormatEnabled, setIsFormatEnabled] = useState<boolean>(false)
  const [isNoScoreMode, setIsNoScoreMode] = useState<boolean>(false)
  const [searchString, setSearchString] = useState<string>('')
  const [isPersonsCardsCollapsed, setIsPersonsCardsCollapsed] = useState<boolean>(true)

  const [persons, setPersons] = useState<iPerson[]>([])
  const [shownPersons, setShownPersons] = useState<iPerson[]>([])
  const [scrolledPersons, setScrolledPersons] = useState<iPerson[]>([])
  const [hasPersonsToScroll, setHasPersonsToScroll] = useState<boolean>(true)
  const [scrollChunkNum, setScrollChunkNum] = useState<number>(1)
  const [snackbar, setSnackbar] = useState<ReactElement | null>(null)

  // tab switching
  useEffect(() => {
    console.log(new Date().toTimeString(), 'tabbarItemId hook called')
    let localIsFormatEnabled = false
    let localIsNoScoreMode = false
    switch (tabbarItemId) {
      case eEduFormats.Offline:
        // TODO: no dupl
        localIsFormatEnabled = scoringInfo.isOfflineEnabled
        localIsNoScoreMode = scoringInfo.isNoScoreOfflineMode
        setIsFormatEnabled(localIsFormatEnabled)
        setIsNoScoreMode(localIsNoScoreMode)
        setFormat(eEduFormats.Offline)
        setPersons(scoringInfo.offlinePersons)
        break
      case eEduFormats.Online:
        localIsFormatEnabled = scoringInfo.isOnlineEnabled
        localIsNoScoreMode = scoringInfo.isNoScoreOnlineMode
        setIsFormatEnabled(localIsFormatEnabled)
        setIsNoScoreMode(localIsNoScoreMode)
        setFormat(eEduFormats.Online)
        setPersons(scoringInfo.onlinePersons)
        break
    }
    setSearchString('')

    if (!localIsFormatEnabled && userInfo.isAppModerator) {
      setSnackbar(
        <div style={{ display: 'grid', padding: 32, gap: 32 }}>
          <Snackbar
            onClose={() => setSnackbar(null)}
            before={<Icon28WarningTriangleOutline fill="var(--vkui--color_accent_orange_peach)" />}
            subtitle="ты видишь его, так как являешься вожатым"
          >
            Рейтинг на обновлении
          </Snackbar>
        </div>
      )
    }
    if (localIsNoScoreMode) {
      setSnackbar(
        <div style={{ display: 'grid', padding: 32, gap: 32 }}>
          <Snackbar
            onClose={() => setSnackbar(null)}
            before={<Icon28WarningTriangleOutline fill="var(--vkui--color_accent_orange_peach)" />}
            subtitle="до объявления лидеров Инструктива"
          >
            Суммарные баллы скрыты
          </Snackbar>
        </div>
      )
    }

    console.log(new Date().toTimeString(), 'tabbarItemId hook ended')
  }, [
    tabbarItemId,
    scoringInfo.isOfflineEnabled,
    scoringInfo.isOnlineEnabled,
    scoringInfo.offlinePersons,
    scoringInfo.onlinePersons,
    userInfo.isAppModerator,
  ])

  // search
  useEffect(() => {
    console.log(new Date().toTimeString(), 'searchString  hook called')

    let localShownPersons = persons
    if (searchString !== '') {
      localShownPersons = searchPersons({ persons: localShownPersons, value: searchString })
    }
    resetShownPersons(localShownPersons)
    console.log(new Date().toTimeString(), 'searchString hook ended')
  }, [searchString, persons])

  const resetScrolledPersons = (localShownPersons: iPerson[] = shownPersons): void => {
    console.log('resetScrolledPersons called')
    window.scrollTo(0, 0)
    setScrollChunkNum(1)
    fetchDataToScroll(localShownPersons, 1)
  }
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
      // console.log({ localShownPersons })
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
    setSearchString(searchString)
  }

  const panelHeader = (
    <FixedLayout vertical="top">
      <PanelHeader delimiter="none">Участники ШВА</PanelHeader>
      <div className="persons-panel__header">
        <Search
          autoFocus
          className="persons-panel__header-search"
          placeholder="Имя, фамилия или бейдж"
          value={searchString}
          onChange={onSearchChange}
        />
        <div className="persons-panel__header-buttons">
          {isPersonsCardsCollapsed ? (
            <IconButton aria-label="expand button" onClick={() => setIsPersonsCardsCollapsed(!isPersonsCardsCollapsed)}>
              <IconExpand className="persons-panel__header-buttons-expand-svg" />
            </IconButton>
          ) : (
            <IconButton
              aria-label="collapse button"
              onClick={() => setIsPersonsCardsCollapsed(!isPersonsCardsCollapsed)}
            >
              <IconCollapse className="persons-panel__header-buttons-collapse-svg" />
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
            selected={tabbarItemId === eEduFormats.Offline}
            text={eEduFormats.Offline}
            onClick={() => setTabbarItemId(eEduFormats.Offline)}
          >
            <Icon28UsersOutline />
          </TabbarItem>

          <TabbarItem
            selected={tabbarItemId === eEduFormats.Online}
            text={eEduFormats.Online}
            onClick={() => setTabbarItemId(eEduFormats.Online)}
          >
            <Icon28ComputerOutline />
          </TabbarItem>
        </Tabbar>
      </FixedLayout>
    </>
  )

  const content = (
    <>
      <Group className="persons-panel__content">
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
                userInfo={userInfo}
                isCardsCollapsed={isPersonsCardsCollapsed}
                isNoScoreMode={isNoScoreMode}
                labels={scoringInfo.labels}
                medals={scoringInfo.medals}
              />
            ))}
          </InfiniteScroll>
        )}
      </Group>
      <Spacing size={60} />
      {panelFooter}
    </>
  )

  const updatingContent = (
    <div className="persons-panel__updating-content">
      <Text className="persons-panel__updating-content-text">Рейтинг на обновлении</Text>
      <img src={blockGif} alt="Access denied" className="persons-panel__updating-content-image" />
    </div>
  )

  return (
    <Panel {...rest}>
      {panelHeader}
      <Spacing size={100} />
      {isFormatEnabled || userInfo.isAppModerator ? content : updatingContent}
      {snackbar}
    </Panel>
  )
}
