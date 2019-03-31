import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../components/ObservedImage';

import './styles.css';

class Resources extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { t } = this.props;

    let tools = [
      {
        name: 'Clan Banner Builder',
        icon: 'clan_banner',
        description: "Collaborate with clan members on a new clan banner. Selecting different options instantly updates the page's URL, which allows you to easily share your customisations.",
        author: 'Braytech',
        link: '/resources/clan-banner-builder'
      },
      {
        name: 'Lowlidev (lowlines)',
        icon: 'patrol',
        description: "Some people draw fanart, make cool videos or fantastic cosplays, I like to write apps and dig around game data for fun. This is a space for some of the game projects I have created out of love for games.",
        author: 'Richard Deveraux',
        link: 'https://lowlidev.com.au/destiny'
      },
      {
        name: 'Destiny Sets',
        icon: 'destiny-sets',
        description: "Destiny items sorted",
        author: 'Josh Hunt',
        link: 'https://destinysets.com/'
      },
      {
        name: 'Destiny Sets data explorer',
        icon: 'destiny-sets',
        description: "Explore the Destiny manifest data",
        author: 'Josh Hunt',
        link: 'https://data.destinysets.com/'
      },
      {
        name: 'Friendgame.report',
        icon: 'destiny-sets',
        description: "Find the people you play with the most in Destiny 2",
        author: 'Josh Hunt',
        link: 'https://friendgame.report/'
      },
      {
        name: 'Clan.report',
        icon: 'destiny-sets',
        description: "View clan activity data, compare triumphs between Guardians",
        author: 'Josh Hunt',
        link: 'https://clan.report/'
      },
      {
        name: 'Destiny Raid Report',
        icon: 'raid',
        description: "Destiny raid stats and weekly progress. Look up raid stats for Destiny 2's Leviathan. Ever wondered how much time you wasted beating prestige Calus with challenge?",
        author: 'RedSox007 & BlazeBoss17',
        link: 'https://raid.report'
      },
      {
        name: 'Ishtar Collective',
        icon: 'ishtar',
        description: "Collect, organize and summarize any information that could be useful to the research being carried out by Ishtar Collective personnel",
        author: 'Ishtar Collective',
        link: 'https://www.ishtar-collective.net'
      }
    ];

    return (
      <div className={cx('view', this.props.theme.selected)} id='resources'>
        <div className='module intro'>
          <div className='page-header'>
            <div className='name'>{t('Resources')}</div>
            <div className='description'>{t("justrealmilk's curated list of tools and artists")}</div>
          </div>
          <div className='text'>
            <p>The bottom line is, I've been building Braytech for over a year now and I'm <em>still</em> discovering amazing community projects. This is an effort to chronicle the best and brightest.</p>
            <p>Additionally, who doesn't love the artists of Destiny? I'm curating hyperlinks to their portfolios.</p>
          </div>
        </div>
        <div className='module'>
          <div className='sub-header sub'>
            <div>{t('Tools')}</div>
          </div>
          <div className='tools'>
            {tools.map((tool, index) => {
              let jsx = (
                <>
                  <div className='icon'>
                    <span className={`destiny-${tool.icon}`} />
                  </div>
                  <div className='text'>
                    <strong>{tool.name}{tool.author !== 'Braytech' ? <span className="destiny-external" /> : null}</strong>
                    <p>{tool.author}</p>
                    <p>{tool.description}</p>
                  </div>
                </>
              );
              return (
                <div key={index} className='tool'>
                  {tool.author === 'Braytech' ? (
                    <Link to={tool.link} children={jsx} />
                  ) : (
                    <a href={tool.link} target='_blank' rel='noreferrer noopener'>
                      {jsx}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className='module'>
          <div className='sub-header sub'>
            <div>{t('Artists')}</div>
          </div>
          <div className='artists'>
            Coming soon
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
)(Resources);
