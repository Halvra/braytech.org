import React, { Component } from 'react';
import cx from 'classnames';
import moment from 'moment';
import 'moment-timezone';
import Moment from 'react-moment';
import { orderBy } from 'lodash/lodash';

import Spinner from '../../components/Spinner';
import ObservedImage from '../../components/ObservedImage';
import Tooltip from '../../components/Tooltip';
import { ProfileNavLink } from '../../components/ProfileLink';

import '../../components/PresentationNode.css';
import './styles.css';
import Items from './Items';
import { withNamespaces } from 'react-i18next';

class Vendors extends Component {
  constructor() {
    super();
    this.state = {
      vendors: []
    };
  }

  componentDidMount() {
    if (!this.props.response) {
      this.props.setPageDefault('light');
    }
    window.scrollTo(0, 0);

    const vendors = ['396892126', '3982706173', '1062861569', '1576276905', '3347378076', '672118013', '1265988377', '69482069', '3603221665', '2398407866', '1735426333', '863940356', '248695599', '3361454721', '895295461', '2190858386', '2917531897'];

    let fetches = vendors.map(vendor => {
      return fetch(`https://api.braytech.org/cache/json/vendors/${vendor}.json`, { cache: 'reload' })
        .then(response => {
          return response.json();
        })
        .then(fetch => {
          return fetch;
        });
    });

    Promise.all(fetches)
      .then(promises => {
        this.setState({
          vendors: promises
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentWillUnmount() {
    if (!this.props.response) {
      this.props.setPageDefault(false);
    }
  }

  render() {
    const { t } = this.props;
    let manifest = this.props.manifest;

    if (this.state.vendors.length === 0) {
      return (
        <div className='view' id='vendors'>
          <Spinner dark={!this.props.response ? true : false} />
        </div>
      );
    } else {
      let render;
      let vendorResponses = this.state.vendors.filter(response => response.ErrorCode === 1);

      let groups = [
        {
          name: 'daily',
          vendors: [1735426333, 672118013, 2398407866, 396892126, 3982706173, 1062861569, 1576276905, 3347378076, 69482069, 3603221665, 248695599, 2917531897],
          items: []
        },
        {
          name: 'weekly',
          vendors: [1265988377, 863940356, 3361454721, 2190858386, 895295461],
          items: []
        }
      ];

      let images = [
        {
          vendor: 69482069,
          file: '/static/images/extracts/npc/01A3-0000044D_SD.PNG'
        },
        {
          vendor: 3603221665,
          file: '/static/images/extracts/npc/01A3-0000038C_SD.PNG'
        },
        {
          vendor: 895295461,
          file: '/static/images/extracts/npc/01A3-0000038B_SD.PNG'
        },
        {
          vendor: 2190858386,
          file: '/static/images/extracts/items/037e-00001834.png'
        },
        {
          vendor: 1265988377,
          file: '/static/images/extracts/npc/01E3-00001308.PNG'
        }
      ];

      vendorResponses.forEach(response => {
        let vendor = response.Response;

        let definition = manifest.DestinyVendorDefinition[vendor.vendor.data.vendorHash];

        let isActive = (match, location) => {
          if (this.props.vendorHash === undefined && vendor.vendor.data.vendorHash === 863940356) {
            return true;
          } else if (match) {
            return true;
          } else {
            return false;
          }
        };

        if (groups[1].vendors.includes(vendor.vendor.data.vendorHash)) {
          groups[1].items.push({
            name: definition.displayProperties.name,
            reset: moment(vendor.vendor.data.nextRefreshDate).unix(),
            element: (
              <li key={vendor.vendor.data.vendorHash} className='linked'>
                <ProfileNavLink isActive={isActive} to={`/vendors/${vendor.vendor.data.vendorHash}`}>
                  {definition.displayProperties.name}
                </ProfileNavLink>
              </li>
            )
          });
        } else {
          groups[0].items.push({
            name: definition.displayProperties.name,
            reset: moment(vendor.vendor.data.nextRefreshDate).unix(),
            element: (
              <li key={vendor.vendor.data.vendorHash} className='linked'>
                <ProfileNavLink isActive={isActive} to={`/vendors/${vendor.vendor.data.vendorHash}`}>
                  {definition.displayProperties.name}
                </ProfileNavLink>
              </li>
            )
          });
        }
      });

      let vendor = this.props.vendorHash === undefined ? vendorResponses.filter(response => response.Response.vendor.data.vendorHash === 863940356)[0].Response : vendorResponses.filter(response => response.Response.vendor.data.vendorHash === parseInt(this.props.vendorHash, 10))[0].Response;

      let definition = manifest.DestinyVendorDefinition[vendor.vendor.data.vendorHash];

      let categorySkips = {
        1735426333: [3],
        3982706173: [4],
        672118013: [1],
        1265988377: [1],
        2398407866: [5],
        69482069: [4],
        396892126: [3],
        1576276905: [2],
        3603221665: [6],
        1062861569: [2],
        3361454721: [3, 21, 22, 2]
      };

      let categories = [];
      vendor.categories.data.categories.forEach(category => {
        if (categorySkips[definition.hash] && categorySkips[definition.hash].includes(category.displayCategoryIndex)) {
          return;
        }

        let categoryDefinition = definition.displayCategories[category.displayCategoryIndex];

        let sales = Object.keys(vendor.sales.data)
          .filter(key => category.itemIndexes.includes(parseInt(key, 10)))
          .map(index => vendor.sales.data[index]);

        categories.push({
          sales: sales.length,
          element: (
            <div key={definition.hash + '-' + category.displayCategoryIndex} className='category'>
              <div className='sub-header'>
                <div>{categoryDefinition.displayProperties.name}</div>
              </div>
              <ul className='items'>
                <Items manifest={manifest} sales={sales} />
              </ul>
            </div>
          )
        });

        if (vendor.vendor.data.vendorHash === 672118013) {
          let allMods = [];
          definition.itemList.forEach(item => {
            if (item.inventoryBucketHash === 3313201758 || item.inventoryBucketHash === 3313201758) {
              allMods.push(item.itemHash);
            }
          });
          categories.push({
            sales: 99,
            element: (
              <div key='610365472610365472' className='category'>
                <div className='sub-header'>
                  <div>All possible mods</div>
                </div>
                <ul className='items'>
                  <Items manifest={manifest} sales={allMods} />
                </ul>
              </div>
            )
          });
        }
      });

      render = (
        <>
          {images.filter(obj => obj.vendor === definition.hash)[0] ? <ObservedImage className='image bg' src={images.filter(obj => obj.vendor === definition.hash)[0].file} /> : null}
          <div className='displayProperties'>
            <div className='sub-name'>{definition.displayProperties.subtitle}</div>
            <div className='name'>{definition.displayProperties.name}</div>
            <div className='description'>{definition.displayProperties.description}</div>
          </div>
          <div className='sales'>{categories.map(obj => obj.element)}</div>
        </>
      );

      let dailyEnd = vendorResponses.filter(response => response.Response.vendor.data.vendorHash === 672118013)[0].Response.vendor.data.nextRefreshDate;
      let weeklyEnd = vendorResponses.filter(response => response.Response.vendor.data.vendorHash === 3361454721)[0].Response.vendor.data.nextRefreshDate;

      groups[0].items = orderBy(groups[0].items, [item => item.name], ['asc']);

      return (
        <>
          <div className={cx('view', { dark: !this.props.response })} id='vendors'>
            <div className='presentation-node vendors'>
              <div className='sub-header'>
                <div>{t('Weekly')}</div>
                <div>
                  <Moment tz='Europe/London' fromNow>
                    {weeklyEnd}
                  </Moment>
                </div>
              </div>
              <ul className='list secondary'>{groups[1].items.map(obj => obj.element)}</ul>
              <div className='sub-header'>
                <div>{t('Daily')}</div>
                <div>
                  <Moment tz='Europe/London' fromNow>
                    {dailyEnd}
                  </Moment>
                </div>
              </div>
              <ul className='list secondary'>{groups[0].items.map(obj => obj.element)}</ul>
            </div>
            <div className={cx('display', `vendor-${vendor.vendor.data.vendorHash}`)}>{render}</div>
          </div>
          <Tooltip manifest={this.props.manifest} route={this.props} />
        </>
      );
    }
  }
}

export default withNamespaces()(Vendors);
