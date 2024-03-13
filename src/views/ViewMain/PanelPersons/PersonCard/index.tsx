import { Icon24ChevronDown, Icon24ChevronUp, Icon24LogoVkColor } from '@vkontakte/icons'
import { Avatar, Badge, Counter, IconButton, InfoRow, SimpleCell, Subhead, Title } from '@vkontakte/vkui'
import { FC, ReactElement, useEffect, useState } from 'react'
import './index.css'
import { iPersonCardProps } from './types'
import { contentMainInfoKeys } from './consts'
import SVG from 'react-inlinesvg'

export const PersonCard: FC<iPersonCardProps> = ({
  person,
  isCardsCollapsed,
  isCurPerson,
  labels,
  medals,
  userInfo,
}) => {
  const [isCardCollapsed, setIsCardCollapsed] = useState<boolean>(isCardsCollapsed)
  useEffect(() => {
    setIsCardCollapsed(isCardsCollapsed)
  }, [isCardsCollapsed])

  const getHeaderSubtitles = (): ReactElement | undefined => {
    const headerSubtitles = []
    headerSubtitles.push(`${person.badge} бейдж`)
    if (person.shvaTeamNumber) {
      headerSubtitles.push(`${person.shvaTeamNumber} команда`)
    }
    if (person.totalScore !== undefined) {
      let floor = Math.floor(person.totalScore) % 10
      let title = floor === 1 ? 'балл' : floor > 1 && floor < 5 ? 'балла' : 'баллов'
      headerSubtitles.push(`${person.totalScore} ${title}`)
    }
    if (headerSubtitles.length) {
      return <Subhead className="person-card__header-subtitle">{headerSubtitles.join(' • ')}</Subhead>
    }
  }

  const getContentMainInfo = (): ReactElement | undefined => {
    const rows: ReactElement[] = []
    if (isCurPerson || userInfo.isAppModerator) {
      let key = 'message'
      let title = labels.find((l) => l.field === key)!.title
      let value = person[key]
      if (value) {
        rows.push(
          <InfoRow key={key} className="infoRow-sub" header={`${title}:`}>
            {value}
          </InfoRow>
        )
      }
    }
    contentMainInfoKeys.forEach((key) => {
      if (person[key]) {
        const title = labels.find((l) => l.field === key)!.title
        rows.push(
          <InfoRow key={key} className="infoRow-sub" header={`${title}:`}>
            {person[key]}
          </InfoRow>
        )
      }
    })

    return <>{rows}</>
  }
  const contentMainInfo = getContentMainInfo()

  const getContentSubInfo = (): ReactElement => {
    const localContentSubInfo: ReactElement[] = []
    labels.forEach((label) => {
      if (label.isContentSubInfoKey) {
        const key = label.field
        const limit = label.limit
        const value = person[key]
        let title = label.levelLast
        const level = label.level

        if (value) {
          if (level === 0) {
            localContentSubInfo.push(
              <InfoRow key={key} header="">
                <b>{`${title}: ${value}${limit ? ` из ${limit}` : ''}`}</b>
              </InfoRow>
            )
          } else {
            localContentSubInfo.push(
              <InfoRow key={key} style={{ paddingLeft: `${(level - 1) * 10}px` }} className="infoRow-sub" header="">
                {`${level > 1 ? '◦' : '•'} ${title}: ${value}${limit ? ` из ${limit}` : ''}`}
              </InfoRow>
            )
          }
        }
      }
    })
    return <>{localContentSubInfo}</>
  }
  const contentSubInfo = getContentSubInfo()

  const getMedalsRow = (): ReactElement | undefined => {
    if (!person.medals || !person.medals.length) {
      return undefined
    }
    const style = { width: 16, height: 16, padding: 3 }
    const medalsRowLocal: ReactElement[] = []
    person.medals.forEach((medalId) => {
      const medalInfo = medals.find((mi) => mi.id === medalId)
      if (medalInfo) {
        medalsRowLocal.push(<SVG src={medalInfo.iconSvg} style={style}></SVG>)
      }
    })
    return <div className="person-card__header-medals">{medalsRowLocal}</div>
  }
  const medalsRow = getMedalsRow()

  const getMedalsHistory = (): ReactElement | undefined => {
    if (!person.medals || !person.medals.length) {
      return undefined
    }
    const style = { width: 20, height: 20, padding: 3 }
    const medalsHistoryLocal: ReactElement[] = []
    person.medals.forEach((medalId) => {
      const medalInfo = medals.find((mi) => mi.id === medalId)
      if (medalInfo) {
        const title = person.vkSex === 'Ж' ? medalInfo.titleFemale : medalInfo.titleMale
        const image = medalInfo.iconSvg
        medalsHistoryLocal.push(
          <div className="person-card__content-medals-medal" key={medalId}>
            <>
              <SVG src={image} style={style}></SVG>
              <span className="person-card__content-medals-medal-title">
                {title} <span className="person-card__content-medals-medal-subtitle">{medalInfo.description}</span>
              </span>
            </>
          </div>
        )
      }
    })

    return (
      <>
        <InfoRow header={''}>
          <b>Достижения:</b>
        </InfoRow>
        <div className="person-card__content-medals-list">{medalsHistoryLocal}</div>
      </>
    )
  }
  const medalsHistory = getMedalsHistory()

  const cardHeader = (
    <div className="person-card__header-container">
      <Avatar className="person-card__header-photo" size={48} src={person.photo}>
        {person.place && (
          <Avatar.Badge background="stroke">
            <Counter size="s" mode="primary">
              {person.place}
            </Counter>
          </Avatar.Badge>
        )}
      </Avatar>
      <div className="person-card__header">
        <div className="person-card__header-title">
          <Title level="3">{`${person.firstName} ${person.lastName}`}</Title>
          {isCurPerson && <Subhead className="person-card__header-title-star">⭐</Subhead>}
          {person.excluded && (
            <Badge className="person-card__header-title-badge" mode="prominent" aria-label="Исключён" />
          )}
        </div>
        {getHeaderSubtitles()}
        {isCardCollapsed && medalsRow !== undefined && medalsRow}
      </div>
      {isCardCollapsed ? (
        <Icon24ChevronDown className="person-card__header-button-expand" />
      ) : (
        <Icon24ChevronUp className="person-card__header-button-collapse" />
      )}
    </div>
  )

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  const contentInfo = (
    <>
      {person.excluded && (
        <div className="person-card__content-excluded">
          <InfoRow header={''}>
            <b>{person.vkSex === 'Ж' ? 'Исключена' : 'Исключён'}</b>
          </InfoRow>
          <Badge className="person-card__header-title-badge" mode="prominent" aria-label="Исключён" />
        </div>
      )}
      {medalsHistory}
      {contentMainInfo}
      {contentSubInfo}
    </>
  )

  const cardContent = (
    <div className="person-card__content">
      <div className="person-card__content-info">{contentInfo}</div>
      <div className="person-card__content-buttons">
        {person.vkID && (
          <IconButton
            aria-label="vk link"
            onClick={(e) => handleClick(e)}
            href={`https://vk.com/id${person.vkID}`}
            target="_blank"
            rel="noreferrer"
            style={{ width: '24', height: '24', margin: '12' }}
          >
            <Icon24LogoVkColor />
          </IconButton>
        )}
      </div>
    </div>
  )

  return (
    <SimpleCell
      className="person-card"
      onClick={() => {
        setIsCardCollapsed(!isCardCollapsed)
      }}
    >
      {cardHeader}
      {!isCardCollapsed && cardContent}
    </SimpleCell>
  )
}
