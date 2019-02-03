import React from 'react';
import cx from 'classnames';

import Globals from '../../../utils/globals';
import ObservedImage from '../../ObservedImage';
import { enumerateItemState } from '../../../utils/destinyEnums';
import fallback from './fallback';
import weapon from './weapon';
import armour from './armour';
import emblem from './emblem';
import bounty from './bounty';
import mod from './mod';
import ghost from './ghost';
import sparrow from './sparrow';
import subclass from './subclass';
import ui from './ui';
import sandboxPerk from './sandboxPerk';

export default (profile, manifest, props) => {

  const itemComponents = profile.data ? profile.data.profile.itemComponents : false;

  if (!props.table) {
    props.table = 'DestinyInventoryItemDefinition';
  }

  let item;
  if (props.hash === '343') {
    item = {
      redacted: true
    };
  } else {
    item = manifest[props.table][props.hash];
  }

  if (itemComponents && props.itemInstanceId) {
    item.itemComponents = {
      state: props.itemState ? parseInt(props.itemState, 10) : false,
      instance: itemComponents.instances.data[props.itemInstanceId] ? itemComponents.instances.data[props.itemInstanceId] : false,
      sockets: itemComponents.sockets.data[props.itemInstanceId] ? itemComponents.sockets.data[props.itemInstanceId].sockets : false,
      perks: itemComponents.perks.data[props.itemInstanceId] ? itemComponents.perks.data[props.itemInstanceId].perks : false,
      stats: itemComponents.stats.data[props.itemInstanceId] ? itemComponents.stats.data[props.itemInstanceId].stats : false
    };
  }

  let kind = 'ui';
  let tier = 'basic';
  let black;

  if (item.itemType) {
    switch (item.itemType) {
      case 1:
        kind = 'ui';
        black = ui(manifest, item);
        break;
      case 3:
        kind = 'weapon';
        black = weapon(manifest, item);
        break;
      case 2:
        kind = 'armour';
        black = armour(manifest, item);
        break;
      case 14:
        kind = 'emblem';
        black = emblem(manifest, item);
        break;
      case 16:
        kind = 'ui sandbox-perk';
        black = subclass(manifest, item);
        break;
      case 19:
        kind = 'mod';
        black = mod(manifest, item);
        break;
      case 20:
        kind = 'bounty';
        black = ui(manifest, item);
        break;
      case 22:
        kind = 'sparrow';
        black = sparrow(manifest, item);
        break;
      case 24:
        kind = 'ghost';
        black = ghost(manifest, item);
        break;
      case 26:
        kind = 'bounty';
        black = bounty(manifest, item);
        break;
      default:
        kind = '';
        black = fallback(manifest, item);
    }
  }

  if (props.table === 'DestinySandboxPerkDefinition') {
    kind = 'ui name-only sandbox-perk';
    black = sandboxPerk(manifest, item);
  }

  if (item.inventory) {
    switch (item.inventory.tierType) {
      case 6:
        tier = 'exotic';
        break;
      case 5:
        tier = 'legendary';
        break;
      case 4:
        tier = 'rare';
        break;
      case 3:
        tier = 'uncommon';
        break;
      case 2:
        tier = 'basic';
        break;
      default:
        tier = 'basic';
    }
  }

  if (item.redacted) {
    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', 'common')}>
          <div className='header'>
            <div className='name'>Classified</div>
            <div>
              <div className='kind'>Insufficient clearance</div>
            </div>
          </div>
          <div className='black'>
            <div className='description'>
              <pre>Keep it clean.</pre>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    let itemState = enumerateItemState(parseInt(props.itemState, 10));
    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', kind, tier, { 'is-masterworked': itemState.masterworked })}>
          <div className='header'>
            {itemState.masterworked ? <ObservedImage className={cx('image', 'bg')} src={tier === 'exotic' ? `/static/images/extracts/flair/01A3-00001DDC.PNG` : `/static/images/extracts/flair/01A3-00001DDE.PNG`} /> : null}
            <div className='name'>{item.displayProperties.name}</div>
            <div>
              <div className='kind'>{item.itemTypeDisplayName}</div>
              {kind !== 'ui' && item.inventory ? <div className='rarity'>{item.inventory.tierTypeName}</div> : null}
            </div>
          </div>
          <div className='black'>{black}</div>
        </div>
      </>
    );
  }
};
