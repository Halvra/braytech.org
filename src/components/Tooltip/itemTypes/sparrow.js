import React from 'react';
import cx from 'classnames';

import { getSockets } from '../../../utils/destinyItems';

const sparrow = (manifest, item) => {
  let sockets = [];

  let sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;

  let description = item.displayProperties.description !== '' ? item.displayProperties.description : false;

  if (item.sockets) {
    sockets = getSockets(manifest, item, false, true, [1608119540]).sockets;
  }

  return (
    <>
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
      <div className={cx('sockets', { 'has-sockets': sockets.length > 0 })}>{sockets.length > 0 ? sockets.map(socket => socket.plugs.map(plug => plug.element)) : null}</div>
      {sourceString ? (
        <div className={cx('source', { 'no-border': !description })}>
          <p>{sourceString}</p>
        </div>
      ) : null}
    </>
  );
};

export default sparrow;
