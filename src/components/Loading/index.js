import React from 'react';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';
import packageJSON from '../../../package.json';

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
  fetchProfile: {
    message: 'Loading previous profile'
  },
  else: {
    message: 'Booting up'
  }
};

function Loading({ t, state, theme }) {
  if (state.code) {
    const message = LOADING_STATE[state.code].message || LOADING_STATE.else.message;
    const className = LOADING_STATE[state.code].className || LOADING_STATE.else.className;

    return (
      <div className={cx('view', theme)} id='loading'>
        <div className='logo-feature'>
          <div className='device'>
            <span className='destiny-clovis_bray_device' />
          </div>
        </div>
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
    );
  } else {
    return null;
  }
}

export default withNamespaces()(Loading);
