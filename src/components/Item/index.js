import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../components/ObservedImage';
import { enumerateCollectibleState, enumerateItemState } from '../../utils/destinyEnums';

import './styles.css';

class Item extends React.Component {
  render() {
    const { manifest, data, profile } = this.props;

    let hash = data.itemHash;
    let itemDefinition = manifest.DestinyInventoryItemDefinition[hash];

    let costs = [];
    if (data.costs) {
      data.costs.forEach(cost => {
        let currencyDefinition = manifest.DestinyInventoryItemDefinition[cost.itemHash];
        costs.push(
          <li key={currencyDefinition.hash} className='item tooltip' data-itemhash={currencyDefinition.hash}>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${currencyDefinition.displayProperties.icon}`} />
            <div className='value'>{cost.quantity}</div>
          </li>
        );
      });
    }

    let state = 0;
    if (profile.data && !data.itemInstanceId) {
      let hash = itemDefinition.collectibleHash ? itemDefinition.collectibleHash : false;
      if (hash) {
        let characterId = profile.characterId;
        let characterCollectibles = profile.data.profile.characterCollectibles.data;
        let profileCollectibles = profile.data.profile.profileCollectibles.data;

        let scope = profileCollectibles.collectibles[hash] ? profileCollectibles.collectibles[hash] : characterCollectibles[characterId].collectibles[hash];
        if (scope) {
          state = scope.state;
        }
      }
    }

    if (itemDefinition.redacted) {
      return (
        <>
          <ul className='list'>
            <li
              className={cx('item', 'tooltip', {
                'not-acquired': profile.data && enumerateCollectibleState(state).notAcquired,
                'is-masterworked': enumerateItemState(data.itemState).masterworked
              })}
              data-itemhash={itemDefinition.hash}
              data-iteminstanceid={data.itemInstanceId}
              data-itemstate={data.itemState}
            >
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
              {data.quantity > 1 ? <div className='quantity'>{data.quantity}</div> : null}
            </li>
          </ul>
          {costs.length > 0 ? <ul className='list costs'>{costs}</ul> : null}
        </>
      );
    } else {
      return (
        <>
          <ul className='list'>
            <li
              className={cx('item', 'tooltip', {
                'not-acquired': profile.data && enumerateCollectibleState(state).notAcquired,
                'is-masterworked': enumerateItemState(data.itemState).masterworked
              })}
              data-itemhash={itemDefinition.hash}
              data-iteminstanceid={data.itemInstanceId}
              data-itemstate={data.itemState}
            >
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${itemDefinition.displayProperties.icon}`} />
              {data.quantity > 1 ? <div className='quantity'>{data.quantity}</div> : null}
            </li>
          </ul>
          {costs.length > 0 ? <ul className='list costs'>{costs}</ul> : null}
        </>
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile,
    theme: state.theme
  };
}

export default connect(mapStateToProps)(Item);
