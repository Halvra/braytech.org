/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import Characters from '../../components/Characters';
import './styles.css';

class Profile extends React.Component {
  render() {
    const { t, profile, manifest, from } = this.props;

    const groups = profile.data.groups.results;

    const timePlayed = Math.floor(
      Object.keys(profile.data.profile.characters.data).reduce((sum, key) => {
        return sum + parseInt(profile.data.profile.characters.data[key].minutesPlayedTotal);
      }, 0) / 1440
    );

    return (
      <div className='user'>
        <div className='info'>
          <div className='displayName'>{profile.data.profile.profile.data.userInfo.displayName}</div>
          {groups.length === 1 && <div className='clan'>{groups[0].group.name}</div>}
          <div className='timePlayed'>
            {timePlayed} {t('days on the grind')}
          </div>{' '}
        </div>
        <Characters data={profile.data} manifest={manifest} location={{ ...from }} characterClick={this.props.onCharacterClick} />
      </div>
    );
  }
}

Profile.propTypes = {
  onCharacterClick: PropTypes.func.isRequired,
  from: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  manifest: PropTypes.object.isRequired
};

export default withNamespaces()(Profile);
