import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { withNamespaces } from 'react-i18next';

import Globals from '../../utils/globals';
import ObservedImage from '../../components/ObservedImage';

import { getSockets } from '../../utils/destinyItems';

import './Inspect.css';

class Inspect extends React.Component {
  render() {
    const { t, manifest, profile } = this.props;

    console.log(this);

    let hash = this.props.match.params.secondary;
    let definition = manifest.DestinyInventoryItemDefinition[hash];

    let tier;
    switch (definition.inventory.tierType) {
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

    let properties = getSockets(manifest, definition);
    console.log(properties);

    let sockets = [];
    definition.sockets.socketCategories.forEach(category => {
      let definition = manifest.DestinySocketCategoryDefinition[category.socketCategoryHash];

      sockets.push(
        <div key={category.socketCategoryHash} className={cx('category', { 'is-perks': category.socketCategoryHash === 4241085061, 'is-mods': category.socketCategoryHash === 2685412949 })}>
          <div className='sub-header sub'>
            <div>{definition.displayProperties.name}</div>
          </div>
          <div className='sockets'>
            {properties.sockets
              .filter(socket => socket.categoryHash === category.socketCategoryHash)
              .map((socket, index) => {
                if (socket.plugs.length > 0) {
                  return (
                    <div key={index} className='socket'>
                      {socket.plugs.map(plug => plug.element)}
                    </div>
                  );
                } else if (socket.singleInitialItem) {
                  return (
                    <div key={index} className='socket'>
                      {socket.singleInitialItem.element}
                    </div>
                  );
                } else {
                  return null;
                }
              })}
          </div>
        </div>
      );
    });

    let backLinkPath = this.props.location.state && this.props.location.state.from ? this.props.location.state.from : '/collections';

    return (
      <>
        <div className='bg' />
        <div className={cx('rarity', tier)} />
        <div className='properties'>
          <div className='display'>
            <ObservedImage className='image icon' src={`${Globals.url.bungie}${definition.displayProperties.icon}`} />
            <div className='group'>
              <div className='name'>{definition.displayProperties.name}</div>
              <div className='itemTypeDisplayName'>{definition.itemTypeDisplayName}</div>
            </div>
            <div className='description'>{definition.displayProperties.description}</div>
          </div>
          <div className='sockets'>{sockets}</div>
        </div>
        <div className='sticky-nav'>
          <div />
          <ul>
            <li>
              <Link to={backLinkPath}>
                <i className='uniF094' />
                {t('Back')}
              </Link>
            </li>
          </ul>
        </div>
      </>
    );
  }
}

export default withNamespaces()(Inspect);
