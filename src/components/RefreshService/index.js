import React from 'react';
import { connect } from 'react-redux';

import getProfile from '../../utils/getProfile';
import store from '../../utils/reduxStore';

const AUTO_REFRESH_INTERVAL = 30 * 1000;
const TIMEOUT = 60 * 60 * 1000;

class RefreshService extends React.Component {
  running = false;

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.profile.data !== this.props.profile.data || prevProps.refreshService.config.enabled !== this.props.refreshService.config.enabled) {
      if (prevProps.refreshService.config.enabled !== this.props.refreshService.config.enabled) {
        if (this.props.refreshService.config.enabled) {
          this.init();
        } else {
          this.quit();
        }
      } else {
        this.clearInterval();
        this.startInterval();
      }
    }
  }

  componentWillUnmount() {
    this.quit();
  }

  render() {
    return null;
  }

  init() {
    if (this.props.refreshService.config.enabled) {
      console.log('RefreshService: init');
      this.track();
      document.addEventListener('click', this.clickHandler);
      document.addEventListener('visibilitychange', this.visibilityHandler);

      this.startInterval();
    }
  }

  quit() {
    console.log('RefreshService: quit');
    document.removeEventListener('click', this.clickHandler);
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.clearInterval();
  }

  track() {
    this.lastActivityTimestamp = Date.now();
  }

  activeWithinTimespan(timespan) {
    return Date.now() - this.lastActivityTimestamp <= timespan;
  }

  startInterval() {
    // console.log('starting a timer');
    this.refreshAccountDataInterval = window.setInterval(this.service, AUTO_REFRESH_INTERVAL);
  }

  clearInterval() {
    window.clearInterval(this.refreshAccountDataInterval);
  }

  clickHandler = () => {
    this.track();
  };

  visibilityHandler = () => {
    if (document.hidden === false) {
      this.track();
      this.service();
    }
  };

  service = async () => {
    if (!this.activeWithinTimespan(TIMEOUT)) {
      return;
    }

    const profile = this.props.profile;
    try {
      const data = await getProfile(profile.membershipType, profile.membershipId);
      store.dispatch({
        type: 'PROFILE_LOADED',
        payload: data
      });
    } catch (error) {
      console.warn(`Error while refreshing profile, ignoring: ${error}`);
    }
  };
}

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile,
    refreshService: state.refreshService
  };
}

export default connect(mapStateToProps)(RefreshService);
