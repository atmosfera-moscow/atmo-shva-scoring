import { iMedalMeta, iPerson, iScoringMeta } from '@src/shared/types'
import { Icon24ChevronDown, Icon24ChevronUp, Icon24LogoVkColor } from '@vkontakte/icons'
import { Avatar, Badge, Counter, IconButton, InfoRow, SimpleCell, Subhead, Title } from '@vkontakte/vkui'
import { FC, ReactElement, useEffect, useState } from 'react'
// import { getMedals } from '../Medals'
import './index.css'

// const medalsImagesRow = getMedals(18, '0')
// const medalsImagesHistory = getMedals(20, '0')
const medalsImagesRow = {"das": ""}
const medalsImagesHistory = {}

export interface iPersonCardProps {
  person: iPerson
  isCardsCollapsed: boolean
  isCurPerson: boolean
  scoringMeta: iScoringMeta
  medalsMeta: iMedalMeta[]
}

export const PersonCard: FC<iPersonCardProps> = ({
  person,
  isCardsCollapsed,
  isCurPerson,
  scoringMeta,
  medalsMeta,
}) => {
  const [isCardCollapsed, setIsCardCollapsed] = useState<boolean>(isCardsCollapsed)
  useEffect(() => {
    setIsCardCollapsed(isCardsCollapsed)
  }, [isCardsCollapsed])


  const pMedalsMeta = medalsMeta.filter(
    (medalMeta) => person.medals.includes(medalMeta.key) && !medalMeta.disable
  )
  const getHeaderSubtitles = (): ReactElement | undefined => {
    const headerSubtitles = []
    if (person.badge) {
      headerSubtitles.push(`${person.badge} бейдж`)
    }
    if (person.team) {
      headerSubtitles.push(`${person.team} команда`)
    }
    if (person.sum || person.sum === 0) {
      let floor = Math.floor(person.sum) % 10
      let title = floor === 1 ? 'балл' : floor > 1 && floor < 5 ? 'балла' : 'баллов'
      headerSubtitles.push(`${person.sum} ${title}`)
    }
    if (headerSubtitles.length) {
      return <Subhead className="person-card__header-subtitle">{headerSubtitles.join(' • ')}</Subhead>
    }
  }
  // console.log({ person })

  const medalsRow = (
    <>
      {person.medals && person.medals.length > 0 && (
        <div className="person-card__header-medals">
          {pMedalsMeta.map((medalMeta) => (
            <>"medalsImagesRow[medalMeta.key]"</>
          ))}
        </div>
      )}
    </>
  )

  const medalsHistory = (
    <>
      {person.medals && person.medals.length > 0 && (
        <>
          <InfoRow header={''}>
            <b>Достижения:</b>
          </InfoRow>
          <div className="person-card__content-medals-list">
            {pMedalsMeta.map((medalMeta) => {
              const medalKey = medalMeta.key
              const { title_female, title_male, descr } = medalMeta
              const title = person.sex === 'Ж' ? title_female : title_male
              const image = "medalsImagesHistory[medalKey]"
              return (
                <div className="person-card__content-medals-medal" key={medalKey}>
                  <>
                    {image}
                    <span className="person-card__content-medals-medal-title">
                      {title} <span className="person-card__content-medals-medal-subtitle">{descr}</span>
                    </span>
                  </>
                </div>
              )
            })}
          </div>
        </>
      )}
    </>
  )

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
          <Title level="3">{`${person.name ? person.name + ' ' : ''}${person.surname ? person.surname : ''}`}</Title>
          {isCurPerson && <Subhead className="person-card__header-title-star">⭐</Subhead>}
          {person.excluded && (
            <Badge className="person-card__header-title-badge" mode="prominent" aria-label="Исключён" />
          )}
        </div>
        {getHeaderSubtitles()}
        {isCardCollapsed && medalsRow}
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

  const contentInfoKeys = Object.getOwnPropertyNames(person).filter((k) => scoringMeta[k] && scoringMeta[k].is_dynamic)
  // console.log({ contentInfoKeys })
  const contentInfo = (
    <>
      {person.excluded && (
        <div className="person-card__content-excluded">
          <InfoRow header={''}>
            <b>{person.sex === 'Ж' ? 'Исключена' : 'Исключён'}</b>
          </InfoRow>
          <Badge className="person-card__header-title-badge" mode="prominent" aria-label="Исключён" />
        </div>
      )}
      {medalsHistory}
      {contentInfoKeys
        .filter((key) => (person[key] || person[key] === 0) && scoringMeta[key].title_ru)
        .map((key) => {
          const value = person[key]
          const title_ru = scoringMeta[key].title_ru
          const max_score = scoringMeta[key].max_score
          const subLevel = key.split('_').length - 1

          if (value!.toString().length <= 10) {
            if (subLevel === 0) {
              return (
                <InfoRow key={key} header="">
                  <b>{`${title_ru}: ${value}${max_score ? ' из ' + max_score.toString() : ''}`}</b>
                </InfoRow>
              )
            } else {
              return (
                <InfoRow
                  key={key}
                  style={{ paddingLeft: `${(subLevel - 1) * 10}px` }}
                  className="infoRow-sub"
                  header=""
                >{`${subLevel > 1 ? '◦' : '•'} ${title_ru}: ${value}${
                  max_score ? ' из ' + max_score.toString() : ''
                }`}</InfoRow>
              )
            }
          }
          return (
            <InfoRow key={key} header={`${title_ru}:`}>
              {value}
            </InfoRow>
          )
        })}
    </>
  )

  const cardContent = (
    <div className="person-card__content">
      <div className="person-card__content-info">{contentInfo}</div>
      <div className="person-card__content-buttons">
        {person.vk_id && (
          <IconButton
            aria-label="vk link"
            onClick={(e) => handleClick(e)}
            href={`https://vk.com/id${person.vk_id}`}
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
