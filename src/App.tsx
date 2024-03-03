import { ViewNotLoaded } from '@views/ViewNotLoaded'
import bridge, { AppearanceType } from '@vkontakte/vk-bridge'
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  Root,
  SplitCol,
  SplitLayout,
  useAdaptivityConditionalRender,
} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import { FC, useEffect, useState } from 'react'
import { getApiMedals, getApiParticipants } from './shared/api/espocrm'
import { checkIsAtmoMember } from './shared/api/vkbridge'
import { eViewIds } from './shared/enums'
import { ExtendedUserInfo, iConfig, iPerson, iScoringInfo } from './shared/types'
import { ViewBlock } from './views/ViewBlock'
import { ViewLoader } from './views/ViewLoader'
import { ViewMain } from './views/ViewMain'
import { ViewModerator } from './views/ViewModerator'

const App: FC = () => {
  const [appearance, setAppearance] = useState<AppearanceType>('dark')
  const [activeView, setActiveView] = useState<eViewIds>(eViewIds.Loader)

  const [scoringInfo, setScoringInfo] = useState<iScoringInfo>()
  const [fetchedUser, setFetchedUser] = useState<ExtendedUserInfo>()
  const [config, setConfig] = useState<iConfig>()
  const [curPerson, setCurPerson] = useState<iPerson>()

  // const { sizeX } = useAdaptivityConditionalRender()

  useEffect(() => {
    bridge.subscribe((res) => {
      if (res.detail.type === 'VKWebAppUpdateConfig') {
        setAppearance(res.detail.data.appearance)
      }
    })

    async function fetchData() {
      console.log(new Date().toTimeString(), 'App.fetchData hook called')
      try {
        let fetchedUserToSet = {
          ...(await bridge.send('VKWebAppGetUserInfo')),
          isAtmoMember: false,
          isAppModerator: false,
          isAppAdmin: false,
          isShvaParticipant: false,
        }

        if (!fetchedUserToSet) {
          console.log(new Date().toTimeString(), 'Access denied 1')
          setActiveView(eViewIds.Block)
          return
        }
        console.log(new Date().toTimeString(), 'Access allowed 1')
        await getApiMedals()
        await getApiParticipants(
        const [persons, scoringInfoToSet, configToSet] = undefined

        console.log(new Date().toTimeString(), 'getGsheetsData processed')
        // console.log({ scoringInfoToSet })

        const isShvaParticipant = persons.map((p) => p.vk_id).includes(fetchedUserToSet.id)
        const isAtmoMember = await checkIsAtmoMember(fetchedUserToSet.id)
        const isAppModerator = configToSet?.moderators.includes(fetchedUserToSet.id) || false
        const isAppAdmin = configToSet?.admins.includes(fetchedUserToSet.id) || false
        fetchedUserToSet = { ...fetchedUserToSet, isShvaParticipant, isAtmoMember, isAppModerator, isAppAdmin }
        console.log(fetchedUserToSet)

        if (!scoringInfoToSet || !(isAtmoMember || isShvaParticipant)) {
          console.log(new Date().toTimeString(), 'Access denied 2')
          setActiveView(eViewIds.Block)
          return
        }
        console.log(new Date().toTimeString(), 'Access allowed 1')

        let curPersonToSet = persons.filter((person) => person.vk_id === fetchedUserToSet?.id)[0] || undefined

        setConfig(configToSet)
        setFetchedUser(fetchedUserToSet)
        setCurPerson(curPersonToSet)
        setScoringInfo(scoringInfoToSet)

        console.log(new Date().toTimeString(), 'App.fetchData hook processed')
        if (fetchedUserToSet.isAppAdmin) {
          console.log('Mode admin')
          setActiveView(eViewIds.Moderator)
        } else {
          console.log('Mode user')
          setActiveView(eViewIds.Main)
        }
      } catch (error) {
        console.log(new Date().toTimeString(), 'App.fetchData hook error', error)
        setActiveView(eViewIds.NotLoaded)
      }
    }

    fetchData()
  }, [])

  return (
    <ConfigProvider appearance={appearance}>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout>
            <SplitCol>
              <Root activeView={activeView}>
                <ViewBlock id={eViewIds.Block} />
                <ViewNotLoaded id={eViewIds.NotLoaded} />
                <ViewLoader id={eViewIds.Loader} />
                <ViewModerator
                  setActiveView={setActiveView}
                  id={eViewIds.Moderator}
                  fetchedUser={fetchedUser}
                  scoringInfo={scoringInfo!}
                />
                <ViewMain
                  id={eViewIds.Main}
                  fetchedUser={fetchedUser}
                  curPerson={curPerson}
                  scoringInfo={scoringInfo!}
                />
              </Root>
            </SplitCol>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  )
}

export default App
