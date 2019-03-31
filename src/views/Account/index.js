import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import ReactMarkdown from 'react-markdown';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';

import Globals from '../../utils/globals';
import ObservedImage from '../../components/ObservedImage';
import Collectibles from '../../components/Collectibles';
import Item from '../../components/Item';
import ProgressBar from '../../components/ProgressBar';
import * as utils from '../../utils/destinyUtils';
import manifest from '../../utils/manifest';

import './styles.css';

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t } = this.props;
    const characterId = this.props.member.characterId;

    const characters = this.props.member.data.profile.characters.data;
    const characterEquipment = this.props.member.data.profile.characterEquipment.data;
    const characterProgressions = this.props.member.data.profile.characterProgressions.data;
    const profileRecords = this.props.member.data.profile.profileRecords.data.records;
    const characterRecords = this.props.member.data.profile.characterRecords.data;

    const Characters = () => {
      let charactersEl = [];
      characters.forEach(character => {
        // console.log(character);

        let equipment = characterEquipment[character.characterId].items;
        equipment = equipment.map(item => ({
          ...manifest.DestinyInventoryItemDefinition[item.itemHash],
          ...item
        }));

        let loadout = {
          subclass: equipment.find(item => item.inventory.bucketTypeHash === 3284755031),
          kinetic: equipment.find(item => item.inventory.bucketTypeHash === 1498876634),
          energy: equipment.find(item => item.inventory.bucketTypeHash === 2465295065),
          power: equipment.find(item => item.inventory.bucketTypeHash === 953998645),
          helmet: equipment.find(item => item.inventory.bucketTypeHash === 3448274439),
          gloves: equipment.find(item => item.inventory.bucketTypeHash === 3551918588),
          chest: equipment.find(item => item.inventory.bucketTypeHash === 14239492),
          legs: equipment.find(item => item.inventory.bucketTypeHash === 20886954)
        };

        let wellRested = utils.isWellRested(this.props.member.data.profile.characterProgressions.data[character.characterId]);

        charactersEl.push(
          <div key={character.characterId} className='character'>
            <ul className={cx('list', 'character-bar', { 'has-title': character.titleRecordHash })}>
              <li>
                <ObservedImage
                  className={cx('image', 'emblem', {
                    missing: !character.emblemPath
                  })}
                  src={`https://www.bungie.net${character.emblemPath ? character.emblemPath : `/img/misc/missing_icon_d2.png`}`}
                />
                <div className='level'>{character.baseCharacterLevel}</div>
                <div className='class'>{utils.classHashToString(character.classHash, character.genderType)}</div>
                <div className='light'>{character.light}</div>
                <div className='wellRested'>{wellRested.wellRested ? <ObservedImage className='image icon tooltip' data-itemhash='1519921522' data-table='DestinySandboxPerkDefinition' src={Globals.url.bungie + manifest.DestinySandboxPerkDefinition[1519921522].displayProperties.icon} /> : null}</div>
                {character.titleRecordHash ? <div className='title'>{manifest.DestinyRecordDefinition[character.titleRecordHash].titleInfo.titlesByGenderHash[character.genderHash]}</div> : null}
              </li>
            </ul>
            <div className='summary'>
              <div className='timePlayed'>
                <div className='name'>Time played</div>
                <div className='value'>
                  {Math.floor(parseInt(character.minutesPlayedTotal) / 1440) < 2 ? (
                    <>
                      {Math.floor(parseInt(character.minutesPlayedTotal) / 1440)} {t('day')}
                    </>
                  ) : (
                    <>
                      {Math.floor(parseInt(character.minutesPlayedTotal) / 1440)} {t('days')}
                    </>
                  )}
                </div>
              </div>
              <div className='lastPlayed'>
                <div className='name'>Last played</div>
                <div className='value'>
                  <Moment fromNow>{character.dateLastPlayed}</Moment>
                </div>
              </div>
              <div className='loadout'>
                <div className='name'>Loadout</div>
                <div className='value'>
                  <ul className='list items'>
                    {Object.values(loadout).map(item => {
                      if (!item) {
                        return null;
                      } else if (item.itemType === 2 && item.inventory.tierType !== 6) {
                        return null;
                      } else {
                        return (
                          <li key={item.itemInstanceId} className={cx({ 'is-subclass': item.inventory.bucketTypeHash === 3284755031 })}>
                            <Item data={{ itemHash: item.hash, itemInstanceId: item.itemInstanceId, itemState: item.state }} />
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      });
      return charactersEl;
    };

    const RareCollectibles = () => {
      let checks = [
        4274523516, // Redrix's Claymore
        1111219481, // Redrix's Broadsword
        3260604718, // Luna's Howl
        3260604717, // Not Forgotten
        4047371119, // The Mountaintop

        3810740723, // Loaded Question
        4037097478, // Nightshade

        1666039008, // Breakneck
        1660030045, // Malfeasance
        3074058273, // The Last Word

        1660030044, // Wish-Ender

        199171386, // Sleeper Simulant
        199171387, // Worldline Zero

        3875807583, // Whisper of the Worm
        3142437750, // A Thousand Wings

        1469913803 // Harbinger's Echo
      ];

      return (
        <ul className='list collection-items'>
          <Collectibles selfLink {...this.props} hashes={checks} />
        </ul>
      );
    };

    const Strikes = () => {
      let strikes = [{ hash: 3749730895, score: 1039797865 }, { hash: 2737678546, score: 165166474 }, { hash: 3054774873, score: 2692332187 }, { hash: 1707190649, score: 3399168111 }, { hash: 56596211, score: 1526865549 }, { hash: 3145627334, score: 3951275509 }, { hash: 1336344009, score: 2836924866 }, { hash: 2782139949, score: 3340846443 }, { hash: 256005845, score: 2099501667 }, { hash: 319759693, score: 1060780635 }, { hash: 141268704, score: 1329556468 }, { hash: 794103965, score: 3450793480 }, { hash: 1889144800, score: 2282894388 }, { hash: 20431832, score: 3973165904 }];

      let list = strikes.map(strike => {
        let scoreDefinition = manifest.DestinyRecordDefinition[strike.score];
        let scoreRecord = characterRecords[characterId].records[strike.score];
        let strikeRecord = profileRecords[strike.hash];

        let score = scoreRecord.objectives.length === 1 ? scoreRecord.objectives[0].progress : 0;
        let completions = strikeRecord.objectives.length === 1 ? strikeRecord.objectives[0].progress : 0;

        return {
          value: score,
          element: (
            <li key={strike.hash} className={cx({ lowScore: score < 100000 })}>
              <div className='name'>{scoreDefinition.displayProperties.name}</div>
              <div className='completions'>{completions.toLocaleString()}</div>
              <div className='score'>{score.toLocaleString()}</div>
            </li>
          )
        };
      });

      list = orderBy(list, [score => score.value], ['desc']);

      return <ul className='list'>{list.map(item => item.element)}</ul>;
    };

    const Ranks = () => {
      let infamyDefinition = manifest.DestinyProgressionDefinition[2772425241];
      let infamyProgression = characterProgressions[characterId].progressions[2772425241];
      let infamyProgressTotal = Object.keys(infamyDefinition.steps).reduce((sum, key) => {
        return sum + infamyDefinition.steps[key].progressTotal;
      }, 0);
      let infamyResets = profileRecords[3901785488] ? profileRecords[3901785488].objectives[0].progress : 0;

      let valorDefinition = manifest.DestinyProgressionDefinition[3882308435];
      let valorProgression = characterProgressions[characterId].progressions[3882308435];
      let valorProgressTotal = Object.keys(valorDefinition.steps).reduce((sum, key) => {
        return sum + valorDefinition.steps[key].progressTotal;
      }, 0);
      let valorResets = profileRecords[559943871] ? profileRecords[559943871].objectives[0].progress : 0;

      let gloryDefinition = manifest.DestinyProgressionDefinition[2679551909];
      let gloryProgression = characterProgressions[characterId].progressions[2679551909];
      let gloryProgressTotal = Object.keys(gloryDefinition.steps).reduce((sum, key) => {
        return sum + gloryDefinition.steps[key].progressTotal;
      }, 0);

      let progression = {
        ranks: {
          text: t('Ranks'),
          noInteraction: true,
          values: {
            infamy: {
              definition: infamyDefinition,
              mode: 'Gambit',
              icon: 'destiny-gambit',
              text: t('Infamy'),
              color: '#25986e',
              total: infamyProgressTotal,
              step: infamyProgression,
              resets: infamyResets
            },
            valor: {
              definition: valorDefinition,
              mode: 'Quickplay',
              icon: 'destiny-faction_crucible_valor',
              text: t('Valor'),
              color: '#ed792c',
              total: valorProgressTotal,
              step: valorProgression,
              resets: valorResets
            },
            glory: {
              definition: gloryDefinition,
              mode: 'Competitive',
              icon: 'destiny-faction_crucible_glory',
              text: t('Glory'),
              color: '#b52422',
              total: gloryProgressTotal,
              step: gloryProgression,
              resets: false
            }
          }
        }
      };

      let ranks = [];

      for (const [key, value] of Object.entries(progression.ranks.values)) {
        ranks.push(
          <div className={cx('rank', key)} key={key}>
            <div className='mode'>
              <div className='icon'>
                <span className={value.icon} />
              </div>
              <div className='name'>{value.mode}</div>
              {value.resets ? <div className='resets'>{value.resets} resets</div> : null}
            </div>
            <div className='shallow'>
              <ReactMarkdown className='description rank' source={value.definition.displayProperties.description} />
              <ProgressBar
                classNames={{
                  disabled: value.step.currentProgress === value.total && key === 'glory'
                }}
                objectiveDefinition={{
                  progressDescription: `Next rank: ${value.step.currentProgress === value.total && value.step.stepIndex === value.definition.steps.length ? value.definition.steps[0].stepName : value.definition.steps[(value.step.stepIndex + 1) % value.definition.steps.length].stepName}`,
                  completionValue: value.step.nextLevelAt
                }}
                playerProgress={{
                  progress: value.step.progressToNextLevel,
                  objectiveHash: value.mode
                }}
                hideCheck
                chunky
              />
              <ProgressBar
                objectiveDefinition={{
                  progressDescription: value.text,
                  completionValue: value.total
                }}
                playerProgress={{
                  progress: value.step.currentProgress,
                  objectiveHash: value.mode
                }}
                hideCheck
                chunky
              />
            </div>
          </div>
        );
      }

      return ranks;
    };

    return (
      <div className={cx('view', this.props.theme.selected)} id='account'>
        <div className='module'>

        </div>
        <div className='module'>
          <div className='sub-header sub'>
            <div>{t('Characters')}</div>
          </div>
          <div className='content characters'>{Characters()}</div>
          <div className='sub-header sub'>
            <div>{t('Rare collectibles')}</div>
          </div>
          <div className='content collectibles'>{RareCollectibles()}</div>
          <div className='sub-header sub'>
            <div>{t('Strike high-scores')}</div>
            <div>{t('Season')} 4+</div>
          </div>
          <div className='content strikes'>{Strikes()}</div>
        </div>
        <div className='module'>
          <div className='sub-header sub'>
            <div>{t('Ranks')}</div>
          </div>
          <div className='content ranks'>{Ranks()}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    collectibles: state.collectibles,
    theme: state.theme,
    manifest: state.manifest
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Account);
