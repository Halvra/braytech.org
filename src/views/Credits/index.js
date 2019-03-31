import React from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import Spinner from '../../components/Spinner';
import ObservedImage from '../../components/ObservedImage';
import * as responseUtils from '../../utils/responseUtils';
import * as bungie from '../../utils/bungie';

import './styles.css';

class Credits extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      supporters: false
    };

    this.thanks = [
      {
        name: 'Vendal Thornheart',
        icon: 'bungie',
        description: 'Senior Software Engineer, Bungie. His efforts literally enable this web site, and similar, to function. Herein known as the Architect.'
      },
      {
        name: 'Michael Pearson',
        icon: 'destiny',
        description: 'Responsible for refactoring core components that have brought Braytech properly into 2019. He lives in a tree house.'
      },
      {
        name: 'Josh Hunt',
        icon: 'destiny-sets',
        description: 'Has served as an inpiration through his own API work on projects such as Destiny Sets and Friendgame, and has encouraged me to be better repeatedly.'
      },
      {
        name: 'Richard Deveraux',
        icon: 'patrol',
        description: "From what I understand, lowlines is a pioneer in all things Destiny and Destiny api stuff. His meticulous work helps power Braytech's checklists."
      },
      {
        name: 'Rob Jones',
        icon: 'dim',
        description: 'delphiactual prototyped the very popular This Week view. He seems pretty cool, too.'
      },
      {
        name: 'João Paulo Marquesini',
        icon: 'ghost',
        description: 'The very handsome developer of the Light Light app laid the foundations for a multilingual Braytech.'
      }
    ];

    this.supporters = [
      { // josh
        t: '2',
        i: '4611686018469271298'
      },
      { // chook
        t: '4',
        i: '4611686018467516892'
      },
      { // headbug-
        t: '2',
        i: '4611686018449350929'
      },
      { // quietbunny
        t: '1',
        i: '4611686018469277478'
      },
      { // inexAce#1932
        t: '4',
        i: '4611686018467367772'
      },
      { // destinybolty
        t: '1',
        i: '4611686018436742706'
      }
    ];
  }

  async getMembers(members) {
    return await Promise.all(
      members.map(async member => {
        try {
          let profile = await bungie.memberProfile(member.t, member.i, '100,200');
          member.profile = profile;

          if (!member.profile.characters.data) {
            return member;
          }
          member.profile = responseUtils.profileScrubber(member.profile);

          return member;
        } catch (e) {
          member.profile = false;
          return member;
        }
      })
    );
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  async componentDidMount() {
    window.scrollTo(0, 0);

    let memberResponses = await this.getMembers(this.shuffle(this.supporters));

    this.setState(p => {
      p.supporters = memberResponses;
      return p;
    });
  }

  render() {
    const { t } = this.props;

    return (
      <div className={cx('view', this.props.theme.selected)} id='credits'>
        <div className='module intro'>
          <div className='page-header'>
            <div className='name'>{t('Credits')}</div>
            <div className='description'>{t('The Architects and Guardians that make Braytech possible.')}</div>
          </div>
          <div className='text'>
            <p>Braytech's history spans the life of Destiny 2's release. There's been many changes in its trajectory, and it continues to soar. I, justrealmilk, have been aided in my journey by a handful of generous developers, designers, and friendly blueberries, to build this passion project out of the ground from rudimentary HTML and jQuery.</p>
            <p>Love for this game is as undying as the Light itself.</p>
          </div>
        </div>
        <div className='module thanks'>
          <div className='sub-header sub'>
            <div>{t('Special thanks')}</div>
          </div>
          <div className='persons'>
            {this.thanks.map((person, index) => {
              return (
                <div key={index} className='person'>
                  <div className='icon'>
                    <span className={`destiny-${person.icon}`} />
                  </div>
                  <div className='text'>
                    <strong>{person.name}</strong>
                    <p>{person.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className='sub-header sub'>
            <div>{t('Top ko-fi supporters')}</div>
          </div>
          <div className='tags'>
            {this.state.supporters ? (
              <ul className='list'>
                {this.state.supporters.map((m, index) => {
                  if (!m.profile) {
                    return null;
                  }
                  return (
                    <li key={index} className='linked'>
                      <div className='icon'>
                        <ObservedImage className={cx('image', 'emblem')} src={`https://www.bungie.net${m.profile.characters.data[0].emblemPath}`} />
                      </div>
                      <div className='displayName'>{m.profile.profile.data.userInfo.displayName}</div>
                      <Link to={`/${m.t}/${m.i}/${m.profile.characters.data[0].characterId}/legend`} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    theme: state.theme
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Credits);
