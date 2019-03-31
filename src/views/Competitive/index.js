import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import orderBy from 'lodash/orderBy';

import * as bungie from '../../utils/bungie';
import getPGCR from '../../utils/getPGCR';

import manifest from '../../utils/manifest';
import ObservedImage from '../../components/ObservedImage';
import ProgressBar from '../../components/ProgressBar';
import Spinner from '../../components/Spinner';

import PGCR from './PGCR';

import './styles.css';

class Competitive extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      cacheState: {}
    };

    this.running = false;
  }

  cacheMachine = async mode => {
    const { member, PGCRcache } = this.props;

    let charactersIds = member.data.profile.characters.data.map(c => c.characterId);

    // console.log(charactersIds)

    let requests = charactersIds.map(async c => {
      let response = await bungie.activityHistory(member.membershipType, member.membershipId, c, 10, mode, 0);
      return response.activities || [];
    });

    let activities = await Promise.all(requests);
    activities = activities.flat();
    activities = orderBy(activities, [pgcr => pgcr.period], ['desc']);
    activities = activities.slice(0, 10);

    this.setState(p => {
      p.cacheState[mode] = activities.length;
      return p;
    });

    let PGCRs = activities.map(async activity => {
      if (PGCRcache[member.membershipId] && activity && !PGCRcache[member.membershipId].find(pgcr => pgcr.activityDetails.instanceId === activity.activityDetails.instanceId)) {
        return getPGCR(member.membershipId, activity.activityDetails.instanceId);
      } else if (!PGCRcache[member.membershipId] && activity) {
        return getPGCR(member.membershipId, activity.activityDetails.instanceId);
      } else {
        return true;
      }
    });

    return await Promise.all(PGCRs);
  };

  run = async () => {
    this.running = true;

    let modes = ['19', '63', '69', '70', '31'];
    let ignition = await modes.map(m => {
      return this.cacheMachine(m);
    });

    try {
      await Promise.all(ignition);
    } catch (e) {}

    this.setState(p => {
      p.loading = false;
      return p;
    });
    this.running = false;
  }

  componentDidMount() {
    this.run();
  }

  render() {
    const { t, member, PGCRcache } = this.props;
    const characterId = member.characterId;

    const characterProgressions = member.data.profile.characterProgressions.data;
    const profileRecords = member.data.profile.profileRecords.data.records;

    const valor = {
      defs: {
        rank: manifest.DestinyProgressionDefinition[3882308435],
        activity: manifest.DestinyActivityDefinition[2274172949]
      },
      progression: {
        data: characterProgressions[characterId].progressions[3882308435],
        total: 0,
        resets: profileRecords[559943871] ? profileRecords[559943871].objectives[0].progress : 0
      },
      modes: [71, 73, 43, 44, 31],
      PGCRs: []
    };

    valor.progression.total = Object.keys(valor.defs.rank.steps).reduce((sum, key) => {
      return sum + valor.defs.rank.steps[key].progressTotal;
    }, 0);

    const glory = {
      defs: {
        rank: manifest.DestinyProgressionDefinition[2679551909],
        activity: manifest.DestinyActivityDefinition[2947109551]
      },
      progression: {
        data: characterProgressions[characterId].progressions[2679551909],
        total: 0
      },
      modes: [37, 38, 72, 74],
      PGCRs: []
    };

    glory.progression.total = Object.keys(glory.defs.rank.steps).reduce((sum, key) => {
      return sum + glory.defs.rank.steps[key].progressTotal;
    }, 0);

    const infamy = {
      defs: {
        rank: manifest.DestinyProgressionDefinition[2772425241],
        activity: manifest.DestinyActivityDefinition[3577607128]
      },
      progression: {
        data: characterProgressions[characterId].progressions[2772425241],
        total: 0,
        resets: profileRecords[3901785488] ? profileRecords[3901785488].objectives[0].progress : 0
      },
      modes: [63],
      PGCRs: []
    };

    infamy.progression.total = Object.keys(infamy.defs.rank.steps).reduce((sum, key) => {
      return sum + infamy.defs.rank.steps[key].progressTotal;
    }, 0);

    if (PGCRcache[member.membershipId]) {
      valor.PGCRs = orderBy(PGCRcache[member.membershipId].filter(pgcr => valor.modes.includes(pgcr.activityDetails.mode)), [pgcr => pgcr.period], ['desc']);
      glory.PGCRs = orderBy(PGCRcache[member.membershipId].filter(pgcr => glory.modes.includes(pgcr.activityDetails.mode)), [pgcr => pgcr.period], ['desc']);
      infamy.PGCRs = orderBy(PGCRcache[member.membershipId].filter(pgcr => infamy.modes.includes(pgcr.activityDetails.mode)), [pgcr => pgcr.period], ['desc']);
    }

    return (
      <div className={cx('view')} id='competitive'>
        <div className='modes'>
          <div className='mode gambit'>
            <div className='display'>
              <div className='sub-header sub'>
                <div>{infamy.defs.activity.displayProperties.name}</div>
              </div>
              <div className='properties'>
                <div className='name'>{infamy.defs.rank.displayProperties.name}</div>
                <div className='resets'>{infamy.progression.resets} resets</div>
              </div>
              <div className='progress'>
                <ProgressBar
                  objectiveDefinition={{
                    progressDescription: `Next rank: ${infamy.defs.rank.currentProgress === infamy.progression.total && infamy.progression.data.stepIndex === infamy.defs.rank.steps.length ? valor.defs.rank.steps[0].stepName : infamy.defs.rank.steps[(infamy.progression.data.stepIndex + 1) % infamy.defs.rank.steps.length].stepName}`,
                    completionValue: infamy.progression.data.nextLevelAt
                  }}
                  playerProgress={{
                    progress: infamy.progression.data.progressToNextLevel,
                    objectiveHash: 'valor'
                  }}
                  hideCheck
                  chunky
                />
                <ProgressBar
                  objectiveDefinition={{
                    progressDescription: infamy.defs.rank.displayProperties.name,
                    completionValue: infamy.progression.total
                  }}
                  playerProgress={{
                    progress: infamy.progression.data.currentProgress,
                    objectiveHash: 'infamy'
                  }}
                  hideCheck
                  chunky
                />
              </div>
            </div>
            <div className='pgcr'>
              <div className='sub-header sub'>
                <div>Recent matches</div>
              </div>
              {infamy.PGCRs.length ? <PGCR data={infamy.PGCRs} limit='10' /> : <Spinner />}
            </div>
          </div>
          <div className='mode quickplay'>
            <div className='display'>
              <div className='sub-header sub'>
                <div>{valor.defs.activity.displayProperties.name}</div>
              </div>
              <div className='properties'>
                <div className='name'>{valor.defs.rank.displayProperties.name}</div>
                <div className='resets'>{valor.progression.resets} resets</div>
              </div>
              <div className='progress'>
                <ProgressBar
                  objectiveDefinition={{
                    progressDescription: `Next rank: ${valor.defs.rank.currentProgress === valor.progression.total && valor.progression.data.stepIndex === valor.defs.rank.steps.length ? valor.defs.rank.steps[0].stepName : valor.defs.rank.steps[(valor.progression.data.stepIndex + 1) % valor.defs.rank.steps.length].stepName}`,
                    completionValue: valor.progression.data.nextLevelAt
                  }}
                  playerProgress={{
                    progress: valor.progression.data.progressToNextLevel,
                    objectiveHash: 'valor'
                  }}
                  hideCheck
                  chunky
                />
                <ProgressBar
                  objectiveDefinition={{
                    progressDescription: valor.defs.rank.displayProperties.name,
                    completionValue: valor.progression.total
                  }}
                  playerProgress={{
                    progress: valor.progression.data.currentProgress,
                    objectiveHash: 'valor'
                  }}
                  hideCheck
                  chunky
                />
              </div>
            </div>
            <div className='pgcr'>
              <div className='sub-header sub'>
                <div>Recent matches</div>
              </div>
              {valor.PGCRs.length ? <PGCR data={valor.PGCRs} limit='10' /> : <Spinner />}
            </div>
          </div>
          <div className='mode competitive'>
            <div className='display'>
              <div className='sub-header sub'>
                <div>{glory.defs.activity.displayProperties.name}</div>
              </div>
              <div className='properties'>
                <div className='name'>{glory.defs.rank.displayProperties.name}</div>
              </div>
              <div className='progress'>
                <ProgressBar
                  objectiveDefinition={{
                    progressDescription: `Next rank: ${glory.defs.rank.currentProgress === glory.progression.total && glory.progression.data.stepIndex === glory.defs.rank.steps.length ? valor.defs.rank.steps[0].stepName : glory.defs.rank.steps[(glory.progression.data.stepIndex + 1) % glory.defs.rank.steps.length].stepName}`,
                    completionValue: glory.progression.data.nextLevelAt
                  }}
                  playerProgress={{
                    progress: glory.progression.data.progressToNextLevel,
                    objectiveHash: 'valor'
                  }}
                  hideCheck
                  chunky
                />
                <ProgressBar
                  objectiveDefinition={{
                    progressDescription: glory.defs.rank.displayProperties.name,
                    completionValue: glory.progression.total
                  }}
                  playerProgress={{
                    progress: glory.progression.data.currentProgress,
                    objectiveHash: 'glory'
                  }}
                  hideCheck
                  chunky
                />
              </div>
            </div>
            <div className='pgcr'>
              <div className='sub-header sub'>
                <div>Recent matches</div>
              </div>
              {glory.PGCRs.length ? <PGCR data={glory.PGCRs} limit='10' /> : <Spinner />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    PGCRcache: state.PGCRcache
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Competitive);
