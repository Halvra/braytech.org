import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { isProfileRoute } from '../../utils/globals';

import './styles.css';

import HeaderStandard from '../HeaderStandard';
import HeaderProfile from '../HeaderProfile';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    const { t } = this.props;
    let views = [
      {
        name: t('Clan'),
        desc: t('Activity and statistics'),
        slug: '/clan',
        exact: false
      },
      {
        name: t('Collections'),
        desc: t('Items your Guardian has acquired'),
        slug: '/collections',
        exact: false
      },
      {
        name: t('Triumphs'),
        desc: t("Records of your Guardian's achievements"),
        slug: '/triumphs',
        exact: false
      },
      // {
      //   name: t('Character'),
      //   desc: t('Character (dev only)'),
      //   slug: '/character',
      //   exact: true,
      //   dev: true
      // },
      {
        name: t('Account'),
        desc: t("Bird's eye view of your overall progress"),
        slug: '/account',
        exact: true
      },
      {
        name: t('Checklists'),
        desc: t('Made a list, check it twice'),
        slug: '/checklists',
        exact: true
      },
      {
        name: t('This Week'),
        desc: t('Prestigious records and valued items up for grabs this week'),
        slug: '/this-week',
        exact: true
      },
      {
        name: t('Vendors'),
        desc: t("Tracking what's in stock across the Jovians"),
        slug: '/vendors',
        exact: false
      },
      {
        name: t('Resources'),
        desc: t('Assorted Destiny-related resources'),
        slug: '/resources',
        exact: false
      },
      {
        name: <span className='destiny-settings' />,
        desc: 'Theme, language, collectible display state',
        slug: '/settings',
        exact: true
      }
    ];

    views = process.env.NODE_ENV !== 'development' ? views.filter(view => !view.dev) : views;

    if (this.props.profile.data && this.props.profile.characterId && isProfileRoute(this.props.route.location.pathname, true)) {
      return <HeaderProfile {...this.props} views={views} />;
    } else {
      return <HeaderStandard {...this.props} views={views} isIndex={this.props.route.location.pathname === '/' ? true : false} />;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile,
    refreshService: state.refreshService,
    theme: state.theme
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Header);
