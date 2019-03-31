import React from 'react';
import cx from 'classnames';

import ObservedImage from '../../ObservedImage';
import { getSockets } from '../../../utils/destinyItems';
import manifest from '../../../utils/manifest';

const ghost = item => {
  let { sockets } = getSockets(item, false, false, true);

  let sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;

  let description = item.displayProperties.description !== '' ? item.displayProperties.description : false;

  let intrinsic = sockets.find(socket => (socket.singleInitialItem ? socket.singleInitialItem.definition.itemCategoryHashes.includes(2237038328) : false));
  intrinsic = intrinsic ? manifest.DestinySandboxPerkDefinition[intrinsic.singleInitialItem.definition.perks[0].perkHash] : false;

  return (
    <>
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
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
      {item.itemSubType === 21 ? (
        <div className='description'>
          <pre>{item.displayProperties.description}</pre>
        </div>
      ) : null}
      {sourceString ? (
        <div className='source'>
          <p>{sourceString}</p>
        </div>
      ) : null}
    </>
  );
};

export default ghost;
