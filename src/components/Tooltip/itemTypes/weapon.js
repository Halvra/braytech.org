import React from 'react';
import cx from 'classnames';

import ObservedImage from '../../ObservedImage';
import { damageTypeToString, ammoTypeToString } from '../../../utils/destinyUtils';
import { getSockets, getOrnaments } from '../../../utils/destinyItems';

const weapon = (manifest, item) => {
  let { stats, sockets, killTracker } = getSockets(manifest, item, false, false, true);
  // let ornaments = getOrnaments(manifest, item.hash);

  let sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;

  let intrinsic = sockets.find(socket => socket.singleInitialItem ? socket.singleInitialItem.definition.itemCategoryHashes.includes(2237038328) : false);
      intrinsic = intrinsic ? manifest.DestinySandboxPerkDefinition[intrinsic.singleInitialItem.definition.perks[0].perkHash] : false;

  let powerLevel = '630';
      powerLevel = item.itemComponents && item.itemComponents.instance ? item.itemComponents.instance.primaryStat.value : powerLevel;

  let damageTypeHash = item.damageTypeHashes[0];
      damageTypeHash = item.itemComponents && item.itemComponents.instance ? item.itemComponents.instance.damageTypeHash : damageTypeHash;

  return (
    <>
      <div className='damage weapon'>
        <div className={cx('power', damageTypeToString(damageTypeHash).toLowerCase())}>
          <div className={cx('icon', damageTypeToString(damageTypeHash).toLowerCase())} />
          <div className='text'>{powerLevel}</div>
        </div>
        <div className='slot'>
          <div className={cx('icon', ammoTypeToString(item.equippingBlock.ammoType).toLowerCase())} />
          <div className='text'>{ammoTypeToString(item.equippingBlock.ammoType)}</div>
        </div>
      </div>
      {sourceString && !item.itemComponents && !killTracker ? (
        <div className='source'>
          <p>{sourceString}</p>
        </div>
      ) : null}
      {killTracker ? (
        <div className='kill-tracker'>
          <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${killTracker.objectiveDefinition.displayProperties.icon}`} />
          <div className='text'>
            <div className='description'>{killTracker.objectiveDefinition.progressDescription}</div>
            <div className='value'>{killTracker.progress.progress}</div>
          </div>
        </div>
      ) : null}
      <div className='stats'>{stats.map(stat => stat.element)}</div>
      <div className={cx('sockets', { 'has-sockets': sockets.length > 0 })}>
        {intrinsic ? (
          <div className='plug intrinsic'>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${intrinsic.displayProperties.icon}`} />
            <div className='text'>
              <div className='name'>{intrinsic.displayProperties.name}</div>
              <div className='description'>{intrinsic.displayProperties.description}</div>
            </div>
          </div>
        ) : null}
        {sockets.length > 0
          ? sockets
              .map(socket => socket.plugs.filter(plug => !plug.definition.itemCategoryHashes.includes(2237038328)).filter(plug => plug.definition.plug.plugCategoryHash !== 2947756142).map(plug => plug.element))
          : null}
      </div>
    </>
  );
};

// {ornaments.length > 0
//   ? ornaments.map(ornament => ornament.element)
//   : null}

export default weapon;
