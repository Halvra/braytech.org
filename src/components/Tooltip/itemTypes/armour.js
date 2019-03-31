import React from 'react';
import cx from 'classnames';

import ObservedImage from '../../ObservedImage';
import { getSockets } from '../../../utils/destinyItems';
import manifest from '../../../utils/manifest';

const armour = item => {
  let { stats, sockets } = getSockets(item, false, false, true);

  let sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;

  let intrinsic = sockets.find(socket => (socket.singleInitialItem ? socket.singleInitialItem.definition.itemCategoryHashes.includes(2237038328) : false));
  intrinsic = intrinsic ? manifest.DestinySandboxPerkDefinition[intrinsic.singleInitialItem.definition.perks[0].perkHash] : false;

  let powerLevel = '630';
  powerLevel = item.itemComponents ? item.itemComponents.instance.primaryStat.value : powerLevel;

  return (
    <>
      <div className='damage armour'>
        <div className={cx('power')}>
          <div className='text'>{powerLevel}</div>
          <div className='text'>{manifest.DestinyStatDefinition[3897883278].displayProperties.name}</div>
        </div>
      </div>
      {sourceString ? (
        <div className='source'>
          <p>{sourceString}</p>
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
        {sockets.length > 0 ? sockets.map(socket => socket.plugs.filter(plug => !plug.definition.itemCategoryHashes.includes(2237038328)).map(plug => plug.element)) : null}
      </div>
    </>
  );
};

export default armour;
