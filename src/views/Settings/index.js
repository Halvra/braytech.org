import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import Checkbox from '../../components/Checkbox';
import Button from '../../components/Button';
import { getLanguageInfo } from '../../utils/languageInfo';

import './styles.css';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    let initLanguage = this.props.i18n.getCurrentLanguage();

    this.state = {
      language: {
        current: initLanguage,
        selected: initLanguage
      }
    };

    this.saveAndRestart = this.saveAndRestart.bind(this);
  }

  selectCollectibleDisplayState(state) {
    let currentState = this.props.collectibles;
    let newState = currentState;

    // if (state === 'showAll') {
    //   newState = {
    //     hideTriumphRecords: false,
    //     hideChecklistItems: false
    //   };
    // } else {
      newState = {
        hideTriumphRecords: state === 'hideTriumphRecords' ? !currentState.hideTriumphRecords : currentState.hideTriumphRecords,
        hideChecklistItems: state === 'hideChecklistItems' ? !currentState.hideChecklistItems : currentState.hideChecklistItems,
        hideInvisibleCollectibles: state === 'hideInvisibleCollectibles' ? !currentState.hideInvisibleCollectibles : currentState.hideInvisibleCollectibles
      };
    // }

    this.props.setCollectibleDisplayState(newState);
  }

  selectLanguage(lang) {
    let temp = this.state.language;
    temp.selected = lang;
    this.setState(temp);
  }

  saveAndRestart() {
    console.log(this);
    const { i18n } = this.props;
    i18n.setCurrentLanguage(this.state.language.selected);
    setTimeout(() => {
      window.location.reload();
    }, 50);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {}

  render() {
    const { t, availableLanguages } = this.props;

    const complete = ['en', 'de', 'pt-br']
    let languageButtons = availableLanguages.map(code => {
      let langInfo = getLanguageInfo(code);
      return (
        <li
          key={code}
          onClick={() => {
            this.selectLanguage(code);
          }}
        >
          <Checkbox linked checked={this.state.language.selected === code} text={langInfo.name || langInfo.code} />
        </li>
      );
    });

    let collectiblesButtons = (
      <>
        <li
          key='hideTriumphRecords'
          onClick={() => {
            this.selectCollectibleDisplayState('hideTriumphRecords');
          }}
        >
          <Checkbox linked checked={this.props.collectibles.hideTriumphRecords} text={t('Hide completed triumphs')} />
        </li>
        <li
          key='hideChecklistItems'
          onClick={() => {
            this.selectCollectibleDisplayState('hideChecklistItems');
          }}
        >
          <Checkbox linked checked={this.props.collectibles.hideChecklistItems} text={t('Hide completed checklist items')} />
        </li>
        <li
          key='hideInvisibleCollectibles'
          onClick={() => {
            this.selectCollectibleDisplayState('hideInvisibleCollectibles');
          }}
        >
          <Checkbox linked checked={this.props.collectibles.hideInvisibleCollectibles} text={t('Hide invisible Collection items')} />
        </li>
      </>
    );

    return (
      <div className={cx('view', this.props.theme.selected)} id='settings'>
        <div className='module theme'>
          <div className='sub-header sub'>
            <div>{t('Theme')}</div>
          </div>
          <div className='description'>{t('Set the theme')}</div>
          <ul className='list settings'>
            <li
              key='light'
              onClick={() => {
                this.props.setTheme('light-mode');
              }}
            >
              <Checkbox linked checked={this.props.theme.selected === 'light-mode'} text={t('Lights on')} />
            </li>
            <li
              key='dark'
              onClick={() => {
                this.props.setTheme('dark-mode');
              }}
            >
              <Checkbox linked checked={this.props.theme.selected === 'dark-mode'} text={t('Lights off')} />
            </li>
          </ul>
        </div>
        <div className='module refresh-service'>
          <div className='sub-header sub'>
            <div>{t('Refresh service')}</div>
          </div>
          <div className='description'>{t("Refresh the active profile's data every 30 seconds")}</div>
          <ul className='list settings'>
            <li
              key='enabled'
              onClick={() => {
                this.props.setRefreshServiceConfig({
                  config: {
                    enabled: true,
                    frequency: 30
                  }
                });
              }}
            >
              <Checkbox linked checked={this.props.refreshService.config.enabled} text={t('Enabled')} />
            </li>
            <li
              key='disabled'
              onClick={() => {
                this.props.setRefreshServiceConfig({
                  config: {
                    enabled: false,
                    frequency: 30
                  }
                });
              }}
            >
              <Checkbox linked checked={!this.props.refreshService.config.enabled} text={t('Disabled')} />
            </li>
          </ul>
        </div>
        <div className='module collectibles'>
          <div className='sub-header sub'>
            <div>{t('Collectibles')}</div>
          </div>
          <div className='description'>{t('Choose to hide redeemed triumph records or completed checklist items. This setting applies site-wide.')}</div>
          <ul className='list settings'>{collectiblesButtons}</ul>
        </div>
        <div className='module language'>
          <div className='sub-header sub'>
            <div>{t('Language')}</div>
          </div>
          <div className='description'>{t('Set manifest language')}</div>
          <ul className='list settings'>{languageButtons}</ul>
          <Button text={t('Save and restart')} invisible={this.state.language.current === this.state.language.selected} action={this.saveAndRestart} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile,
    theme: state.theme,
    collectibles: state.collectibles,
    refreshService: state.refreshService
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setTheme: value => {
      dispatch({ type: 'SET_THEME', payload: value });
    },
    setCollectibleDisplayState: value => {
      dispatch({ type: 'SET_COLLECTIBLES', payload: value });
    },
    setRefreshServiceConfig: value => {
      dispatch({ type: 'SET_REFRESH_OPTIONS', payload: value });
    }
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withNamespaces()
)(Settings);
