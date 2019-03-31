import React from 'react';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import packageJSON from '../../../package.json';

import { ReactComponent as Spokes } from './svg/spokes.svg';
import { ReactComponent as Radii } from './svg/radii.svg';
import { ReactComponent as Center } from './svg/center.svg';
import { ReactComponent as Orbit1 } from './svg/orbit-1.svg';
import { ReactComponent as Orbit2 } from './svg/orbit-2.svg';
import { ReactComponent as Orbit3 } from './svg/orbit-3.svg';
import './styles.css';

const LOADING_STATE = {
  error: {
    message: 'Error. Please tweet justrealmilk!',
    className: 'error'
  },
  error_setUpManifest: {
    message: 'Error. I had trouble setting up the manifest data. You could try refreshing?',
    className: 'error'
  },
  checkManifest: {
    message: 'Checking manifest'
  },
  fetchManifest: {
    message: 'Downloading manifest'
  },
  setManifest: {
    message: 'Storing manifest'
  },
  loadingPreviousProfile: {
    message: 'Loading previous profile'
  },
  loadingProfile: {
    message: 'Loading profile'
  },
  else: {
    message: 'Booting up'
  }
};

function Loading({ t, state, theme }) {
  if (state.code) {
    const message = (LOADING_STATE[state.code] && LOADING_STATE[state.code].message) || LOADING_STATE.else.message;
    const className = (LOADING_STATE[state.code] && LOADING_STATE[state.code].className) || LOADING_STATE.else.className;

    return (
      <div className={cx('view', theme.selected)} id='loading'>
        <div className='bg'>
          <div className='spokes'>
            <Spokes />
          </div>
          <div className='radii'>
            <Radii />
          </div>
          <div className='center'>
            <Center />
          </div>
          <div className='orbit-1'>
            <Orbit1 />
          </div>
          <div className='orbit-2'>
            <Orbit2 />
          </div>
          <div className='orbit-3'>
            <Orbit3 />
          </div>
        </div>
        <div className='logo-feature'>
          <div className='device'>
            <span className='destiny-clovis_bray_device' />
          </div>
        </div>
        <div className='text'>
          <h4>Braytech {packageJSON.version}</h4>
          <div className={cx('status', className)}>
            <div className='message'>{t(message)}</div>
            {state.detail ? (
              <div className='detail'>
                <div className='name'>{state.detail.name}:</div>
                <div className='message'>{state.detail.message}</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default withNamespaces()(Loading);
