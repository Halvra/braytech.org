import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';

import manifest from '../../utils/manifest';
import * as utils from '../../utils/destinyUtils';
import ObservedImage from '../../components/ObservedImage';

class Characters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t, member } = this.props;
    const characters = member.data.profile.characters.data;
    const characterEquipment = member.data.profile.characterEquipment.data;
    const itemComponents = member.data.profile.itemComponents;

    let classTypes = { Titan: 0, Hunter: 1, Warlock: 2 };
    let damageTypes = { Arc: 2, Thermal: 3, Void: 4 };
    let identifiers = { First: 'FirstPath', Second: 'SecondPath', Third: 'ThirdPath' };

    const pathsCustomInfo = [
      {
        classType: classTypes.Titan,
        damageType: damageTypes.Arc,
        identifier: identifiers.First,
        art: '01A3-0000112B'
      },
      {
        classType: classTypes.Titan,
        damageType: damageTypes.Arc,
        identifier: identifiers.Second,
        art: '01A3-0000112B'
      },
      {
        classType: classTypes.Titan,
        damageType: damageTypes.Arc,
        identifier: identifiers.Third,
        art: '01E3-00001598'
      },
      {
        classType: classTypes.Titan,
        damageType: damageTypes.Thermal,
        identifier: identifiers.First,
        art: '01A3-0000116E'
      },
      {
        classType: classTypes.Titan,
        damageType: damageTypes.Thermal,
        identifier: identifiers.Second,
        art: '01A3-0000116E'
      },
      {
        classType: classTypes.Titan,
        damageType: damageTypes.Thermal,
        identifier: identifiers.Third,
        art: '01E3-0000159D'
      },
      {
        classType: classTypes.Titan,
        damageType: damageTypes.Void,
        identifier: identifiers.First,
        art: '01A3-00001179'
      },
      {
        classType: classTypes.Titan,
        damageType: damageTypes.Void,
        identifier: identifiers.Second,
        art: '01A3-00001179'
      },
      {
        classType: classTypes.Titan,
        damageType: damageTypes.Void,
        identifier: identifiers.Third,
        art: '01E3-0000159F'
      },
      {
        classType: classTypes.Hunter,
        damageType: damageTypes.Arc,
        identifier: identifiers.First,
        art: '01A3-000010B4'
      },
      {
        classType: classTypes.Hunter,
        damageType: damageTypes.Arc,
        identifier: identifiers.Second,
        art: '01A3-000010B4'
      },
      {
        classType: classTypes.Hunter,
        damageType: damageTypes.Arc,
        identifier: identifiers.Third,
        art: '01E3-00001593'
      },
      {
        classType: classTypes.Hunter,
        damageType: damageTypes.Thermal,
        identifier: identifiers.First,
        art: '01A3-000010F8'
      },
      {
        classType: classTypes.Hunter,
        damageType: damageTypes.Thermal,
        identifier: identifiers.Second,
        art: '01A3-000010F8'
      },
      {
        classType: classTypes.Hunter,
        damageType: damageTypes.Thermal,
        identifier: identifiers.Third,
        art: '01E3-00001595'
      },
      {
        classType: classTypes.Hunter,
        damageType: damageTypes.Void,
        identifier: identifiers.First,
        art: '01A3-00001107'
      },
      {
        classType: classTypes.Hunter,
        damageType: damageTypes.Void,
        identifier: identifiers.Second,
        art: '01A3-00001107'
      },
      {
        classType: classTypes.Hunter,
        damageType: damageTypes.Void,
        identifier: identifiers.Third,
        art: '01E3-00001596'
      },
      {
        classType: classTypes.Warlock,
        damageType: damageTypes.Arc,
        identifier: identifiers.First,
        art: '01A3-000011A1'
      },
      {
        classType: classTypes.Warlock,
        damageType: damageTypes.Arc,
        identifier: identifiers.Second,
        art: '01A3-000011A1'
      },
      {
        classType: classTypes.Warlock,
        damageType: damageTypes.Arc,
        identifier: identifiers.Third,
        art: '01E3-000015A1'
      },
      {
        classType: classTypes.Warlock,
        damageType: damageTypes.Thermal,
        identifier: identifiers.First,
        art: '01A3-000011F1'
      },
      {
        classType: classTypes.Warlock,
        damageType: damageTypes.Thermal,
        identifier: identifiers.Second,
        art: '01A3-000011F1'
      },
      {
        classType: classTypes.Warlock,
        damageType: damageTypes.Thermal,
        identifier: identifiers.Third,
        art: '01E3-000015A2'
      },
      {
        classType: classTypes.Warlock,
        damageType: damageTypes.Void,
        identifier: identifiers.First,
        art: '01A3-0000120D'
      },
      {
        classType: classTypes.Warlock,
        damageType: damageTypes.Void,
        identifier: identifiers.Second,
        art: '01A3-0000120D'
      },
      {
        classType: classTypes.Warlock,
        damageType: damageTypes.Void,
        identifier: identifiers.Third,
        art: '01E3-000015A5'
      }
    ];

    let chars = [];
    characters.forEach(character => {
      // console.log(character);

      let equipment = characterEquipment[character.characterId].items;
      equipment = equipment.map(item => ({
        ...manifest.DestinyInventoryItemDefinition[item.itemHash],
        ...item,
        itemComponents: {
          perks: itemComponents.perks.data[item.itemInstanceId] ? itemComponents.perks.data[item.itemInstanceId].perks : null,
          objectives: itemComponents.objectives.data[item.itemInstanceId] ? itemComponents.objectives.data[item.itemInstanceId].objectives : null
        }
      }));

      let subclass = equipment.find(item => item.inventory.bucketTypeHash === 3284755031);
      let talentGrid = itemComponents.talentGrids.data[subclass.itemInstanceId];
      let gridDef = manifest.DestinyTalentGridDefinition[talentGrid.talentGridHash];
      let talentPath = getSubclassPath(gridDef, talentGrid);
      let damageTypes = ['', '', 'arc', 'solar', 'void'];
      let damageType = subclass.talentGrid.hudDamageType;
      if(talentPath == null){
        talentPath = {displayProperties:{name:t("Unknown")}, identifier:'FirstPath'};
      }
      let pathCustom = pathsCustomInfo.find(p => p.classType === subclass.classType && p.damageType === damageType && p.identifier === talentPath.identifier);
      let path = {
        name: talentPath.displayProperties.name,
        element: damageTypes[subclass.talentGrid.hudDamageType],
        art: pathCustom.art
      };

      chars.push({
        element: (
          <div key={character.characterId} className='character'>
            <div className={cx('bg', path.element)}>
              <div className={cx('insignia', utils.classTypeToString(character.classType).toLowerCase())} />
              <div className='art'>
                <ObservedImage className='image' src={`/static/images/extracts/subclass-art/${path.art}.png`} />
                <div className='name'>
                  <div className='top' />
                  <div className='text'>{path.name}</div>
                  <div className='bottom' />
                </div>
              </div>
            </div>
            <div className='datum'>
              <div className='d'>
                <div className='v l'>{character.light}</div>
                <div className='n'>{t('power')}</div>
              </div>
              <div className='d'>
                <div className='v'>{manifest.DestinyClassDefinition[character.classHash].genderedClassNamesByGenderHash[character.genderHash]}</div>
                <div className='n'>{t('class')}</div>
              </div>
              <div className='d'>
                <div className='v'>{manifest.DestinyRaceDefinition[character.raceHash].genderedRaceNamesByGenderHash[character.genderHash]}</div>
                <div className='n'>{t('born')}</div>
              </div>
              <div className='d'>
                <div className='v'>{Math.floor(parseInt(character.minutesPlayedTotal) / 1440)}</div>
                <div className='n'>{Math.floor(parseInt(character.minutesPlayedTotal) / 1440) === 1 ? t('day played') : t('days played')}</div>
              </div>
            </div>
          </div>
        )
      });
    });

    return chars.map(c => c.element);
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

function getSubclassPath(gridDef, talentGrid) {
  let activatedNodes = talentGrid.nodes.filter(node => node.isActivated).map(node => node.nodeIndex);
  let selectedSkills = gridDef.nodeCategories.filter(category => {
    var overlapping = category.nodeHashes.filter(nodeHash => activatedNodes.indexOf(nodeHash) > -1);
    return overlapping.length > 0;
  });
  let subclassPath = selectedSkills.find(nodeDef => nodeDef.isLoreDriven);
  return subclassPath;
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Characters);
