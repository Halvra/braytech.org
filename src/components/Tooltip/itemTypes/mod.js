import React from 'react';
import cx from 'classnames';

import ObservedImage from '../../ObservedImage';

const mod = (manifest, item) => {

  let plugs = [];
  item.perks.forEach(perk => {
    let plug = manifest.DestinySandboxPerkDefinition[perk.perkHash];
    plugs.push(
      <div key={plug.hash} className='plug trait'>
        <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${plug.displayProperties.icon}`} />
        <div className='text'>
          <div className='description'>{plug.displayProperties.description}</div>
        </div>
      </div>
    );
  });

  let stats = [];
  item.investmentStats.forEach(stat => {
    let definition = manifest.DestinyStatDefinition[stat.statTypeHash];
    stats.push(
      <div key={stat.hash} className='stat'>
        <div className='name'>{definition.displayProperties.name}</div>
        <div className='value int'>+{stat.value}</div>
      </div>
    );
  });

  return (
    <>
      {stats.length > 0 ? <div className='stats'>{stats}</div> : null}
      <div className={cx('sockets', { 'has-sockets': plugs.length > 0 })}>{plugs.length > 0 ? plugs : null}</div>
      {item.itemSubType === 21 ? <div className='description'>
        <pre>{item.displayProperties.description}</pre>
      </div> : null}
    </>
  );
};

export default mod;
