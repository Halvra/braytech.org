import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../components/ObservedImage';
import ProgressBar from '../../components/ProgressBar';
import { classHashToString } from '../../utils/destinyUtils';

import './styles.css';

class HeaderProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNavOpen: false,
      lastUpdate: false,
      updateFlash: false,
    };

    this.updateFlash = false;
  }

  TriggerClickHandler = () => {
    if (!this.state.mobileNavOpen) {
      this.setState({ mobileNavOpen: true });
    } else {
      this.setState({ mobileNavOpen: false });
    }
  };

  NavlinkClickHandler = () => {
    if (this.state.mobileNavOpen) {
      this.setState({ mobileNavOpen: false });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.profile.data.updated !== this.props.profile.data.updated && this.state.lastUpdate !== this.props.profile.data.updated && !this.state.updateFlash) {
      this.setState({ lastUpdate: this.props.profile.data.updated, updateFlash: true })
    }
    if (this.state.updateFlash) {
      window.setTimeout(() => {
        this.setState({ updateFlash: false })
      }, 1000);
    }
  }

  render() {
    const manifest = this.props.manifest;

    let characterId = this.props.profile.characterId;
    let profile = this.props.profile.data.profile.profile.data;
    let characters = this.props.profile.data.profile.characters.data;
    let characterProgressions = this.props.profile.data.profile.characterProgressions.data;

    let character = characters.find(character => character.characterId === characterId);

    let capped = characterProgressions[character.characterId].progressions[1716568313].level === characterProgressions[character.characterId].progressions[1716568313].levelCap ? true : false;

    let emblemDefinition = manifest.DestinyInventoryItemDefinition[character.emblemHash];

    let progress = capped ? characterProgressions[character.characterId].progressions[2030054750].progressToNextLevel / characterProgressions[character.characterId].progressions[2030054750].nextLevelAt : characterProgressions[character.characterId].progressions[1716568313].progressToNextLevel / characterProgressions[character.characterId].progressions[1716568313].nextLevelAt;

    let viewsRender = (
      <div className='views'>
        <ul>
          {this.props.views.map(view => {
            let to = view.slug;
            return (
              <li key={view.slug}>
                <NavLink to={to} exact={view.exact} onClick={this.NavlinkClickHandler}>
                  {view.name}
                </NavLink>
                <div className='description'>{view.desc}</div>
              </li>
            );
          })}
        </ul>
      </div>
    );

    let viewsInline = false;
    if (this.props.viewport.width >= 1360) {
      viewsInline = true;
    }

    let mobileNav = (
      <div className='nav'>
        <ul>
          {this.props.views.map(view => {
            let to = view.slug;
            return (
              <li key={view.slug}>
                <NavLink to={to} exact={view.exact} onClick={this.NavlinkClickHandler}>
                  {view.name}
                </NavLink>
                <div className='description'>{view.desc}</div>
              </li>
            );
          })}
        </ul>
      </div>
    );

    return (
      <div id='header' className={cx('profile-header', this.props.theme.selected, { navOpen: this.state.mobileNavOpen })}>
        <div className='braytech'>
          <div className='logo'>
            <Link to='/'>
              <span className='destiny-clovis_bray_device' />
              Braytech
            </Link>
          </div>
          {!viewsInline ? (
            this.state.mobileNavOpen ? (
              <div className='trigger' onClick={this.TriggerClickHandler}>
                <i className='uniE106' />
                Exit
              </div>
            ) : (
              <div className='trigger' onClick={this.TriggerClickHandler}>
                <i className='uniEA55' />
                Views
              </div>
            )
          ) : null}
        </div>
        <div className='profile'>
          <div className={cx('background', { 'update-flash': this.state.updateFlash })}>
            <ObservedImage
              className={cx('image', 'emblem', {
                missing: emblemDefinition.redacted
              })}
              src={`https://www.bungie.net${emblemDefinition.secondarySpecial ? emblemDefinition.secondarySpecial : `/img/misc/missing_icon_d2.png`}`}
            />
          </div>
          <div className='ui'>
            <div className='characters'>
              <ul className='list'>
                <li>
                  <ObservedImage
                    className={cx('image', 'secondaryOverlay', {
                      missing: emblemDefinition.redacted
                    })}
                    src={`https://www.bungie.net${!emblemDefinition.redacted ? emblemDefinition.secondaryOverlay : `/img/misc/missing_icon_d2.png`}`}
                  />
                  <div className='displayName'>{profile.userInfo.displayName}</div>
                  <div className='basics'>
                    {character.baseCharacterLevel} / {classHashToString(character.classHash, this.props.manifest, character.genderType)} / <span className='light'>{character.light}</span>
                  </div>
                  <ProgressBar
                    classNames={{
                      capped: capped
                    }}
                    objectiveDefinition={{
                      completionValue: 1
                    }}
                    playerProgress={{
                      progress: progress
                    }}
                    hideCheck
                  />
                  <Link
                    to={{
                      pathname: '/character-select',
                      state: { from: this.props.route.location }
                    }}
                  />
                </li>
              </ul>
            </div>
            {viewsInline ? viewsRender : null}
          </div>
        </div>
        {this.state.mobileNavOpen ? mobileNav : null}
      </div>
    );
  }
}

export default HeaderProfile;
