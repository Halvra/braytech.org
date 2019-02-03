import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import './Core.css';
import './App.css';
import './components/PresentationNode.css';

import './utils/i18n';
import { isProfileRoute, themeOverride } from './utils/globals';
import dexie from './utils/dexie';
import * as bungie from './utils/bungie';
import GoogleAnalytics from './components/GoogleAnalytics';
import getProfile from './utils/getProfile';
import store from './utils/reduxStore';

import Loading from './components/Loading';
import Header from './components/Header';
import Tooltip from './components/Tooltip';
import Footer from './components/Footer';
import NotificationApp from './components/NotificationApp';
import NotificationProgress from './components/NotificationProgress';
import RefreshService from './components/RefreshService';

import Index from './views/Index';
import CharacterSelect from './views/CharacterSelect';
import Clan from './views/Clan';
import Collections from './views/Collections';
import Triumphs from './views/Triumphs';
import Checklists from './views/Checklists';
import Account from './views/Account';
// import Character from './views/Character';
import ThisWeek from './views/ThisWeek';
import Vendors from './views/Vendors';
import Read from './views/Read';
import Settings from './views/Settings';
import Pride from './views/Pride';
import Credits from './views/Credits';
import Resources from './views/Resources';
import ClanBannerBuilder from './views/Resources/ClanBannerBuilder';
import GodRolls from './views/Resources/GodRolls';

// Print timings of promises to console (and performance logger)
// if we're running in development mode.
async function timed(name, promise) {
  if (process.env.NODE_ENV === 'development') console.time(name);
  const result = await promise;
  if (process.env.NODE_ENV === 'development') console.timeEnd(name);
  return result;
}

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      status: {
        code: false,
        detail: false
      }
    };

    this.manifest = {};
    this.currentLanguage = props.i18n.getCurrentLanguage();

    // We do these as early as possible - we don't want to wait
    // for the component to mount before starting the web
    // requests
    this.startupRequests = {
      storedManifest: timed(
        'storedManifest',
        dexie
          .table('manifest')
          .toCollection()
          .first()
      ),
      manifestIndex: timed('getManifestIndex', bungie.manifestIndex()),
      bungieSettings: timed('getSettings', bungie.settings())
    };

    const profile = props.profile;

    if (profile && profile.membershipId && profile.membershipType) {
      this.startupRequests.profile = timed('getProfile', getProfile(profile.membershipType, profile.membershipId));
    }
  }

  updateViewport = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.setState({
      viewport: {
        width,
        height
      }
    });
  };

  async componentDidMount() {
    this.updateViewport();
    window.addEventListener('resize', this.updateViewport);

    try {
      await timed('setUpManifest', this.setUpManifest());
    } catch (error) {
      console.log(error);
      this.setState({ status: { code: 'error_setUpManifest', detail: error } });
    }
  }

  async setUpManifest() {
    this.setState({ status: { code: 'checkManifest' } });
    const storedManifest = await this.startupRequests.storedManifest;
    const manifestIndex = await this.startupRequests.manifestIndex;

    const currentVersion = manifestIndex.jsonWorldContentPaths[this.currentLanguage];

    if (!storedManifest || currentVersion !== storedManifest.version) {
      // Manifest missing from IndexedDB or doesn't match the current version -
      // download a new one and store it.
      this.manifest = await this.downloadNewManifest(currentVersion);
    } else {
      this.manifest = storedManifest.value;
    }

    this.manifest.settings = await this.startupRequests.bungieSettings;
    this.availableLanguages = Object.keys(manifestIndex.jsonWorldContentPaths);

    if (this.startupRequests.profile) {
      try {
        this.setState({ status: { code: 'fetchProfile' } });
        const data = await this.startupRequests.profile;
        store.dispatch({
          type: 'PROFILE_LOADED',
          payload: data
        });
      } catch (error) {
        // Ignore it if we can't load the profile on app boot - the user will just
        // need to select a new profile
        console.log(error);
      }
    }

    this.setState({ status: { code: 'ready' } });
  }

  async downloadNewManifest(version) {
    this.setState({ status: { code: 'fetchManifest' } });
    const manifest = await timed('downloadManifest', bungie.manifest(version));

    this.setState({ status: { code: 'setManifest' } });
    try {
      await timed('clearTable', dexie.table('manifest').clear());
      await timed('storeManifest', dexie.table('manifest').add({ version: version, value: manifest }));
    } catch(error) {
      // Can't write a manifest if we're in private mode in safari
      console.warn(`Error while trying to store the manifest in indexeddb: ${error}`)
    }
    return manifest;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateViewport);
  }

  render() {
    if (!window.ga) {
      GoogleAnalytics.init();
    }

    if (this.state.status.code !== 'ready') {
      return <Loading state={this.state.status} theme={this.props.theme.selected} />;
    } else {
      if (this.props.profile.data && this.props.profile.characterId) {
        return (
          <Router>
            <Route
              render={route => (
                <div className={cx('wrapper', themeOverride(route.location.pathname) ? themeOverride(route.location.pathname) : this.props.theme.selected, { 'profile-route': isProfileRoute(route.location.pathname, true) })}>
                  <Route path='/' render={route => <NotificationApp updateAvailable={this.props.updateAvailable} />} />
                  <Route path='/' render={route => <NotificationProgress manifest={this.manifest} />} />
                  {/* Don't run the refresh service if we're currently selecting a character, as the refresh will cause the profile to continually reload itself */}
                  {route.location.pathname !== '/character-select' && <RefreshService {...this.props} />}
                  <Route path='/' render={route => <Tooltip {...route} manifest={this.manifest} />} />
                  <GoogleAnalytics.RouteTracker />
                  <div className='main'>
                    <Route path='/' render={route => <Header route={route} {...this.state} {...this.props} themeOverride={themeOverride(route.location.pathname)} manifest={this.manifest} />} />
                    <Switch>
                      <Route path='/character-select' render={route => <CharacterSelect location={route.location} viewport={this.state.viewport} manifest={this.manifest} />} />
                      <Route path='/account' exact render={route => <Account manifest={this.manifest} />} />
                      <Route path='/clan/:view?/:subView?' exact render={route => <Clan manifest={this.manifest} view={route.match.params.view} subView={route.match.params.subView} />} />
                      {/* <Route path='/character' exact render={() => <Character viewport={this.state.viewport} manifest={this.manifest} />} /> */}
                      <Route path='/checklists' exact render={() => <Checklists viewport={this.state.viewport} manifest={this.manifest} />} />
                      <Route path='/collections/:primary?/:secondary?/:tertiary?/:quaternary?' render={route => <Collections {...route} manifest={this.manifest} />} />
                      <Route path='/triumphs/:primary?/:secondary?/:tertiary?/:quaternary?' render={route => <Triumphs {...route} manifest={this.manifest} />} />
                      <Route path='/this-week' exact render={() => <ThisWeek manifest={this.manifest} />} />
                      <Route path='/vendors/:hash?' exact render={route => <Vendors {...route} manifest={this.manifest} />} />
                      <Route path='/read/:kind?/:hash?' exact render={route => <Read {...route} manifest={this.manifest} />} />
                      <Route path='/settings' exact render={() => <Settings manifest={this.manifest} availableLanguages={this.availableLanguages} />} />
                      <Route path='/pride' exact render={() => <Pride />} />
                      <Route path='/credits' exact render={() => <Credits />} />
                      <Route path='/resources' exact render={() => <Resources />} />
                      <Route path='/resources/clan-banner-builder/:decalBackgroundColorId?/:decalColorId?/:decalId?/:gonfalonColorId?/:gonfalonDetailColorId?/:gonfalonDetailId?/:gonfalonId?/' exact render={route => <ClanBannerBuilder {...route} />} />
                      <Route path='/resources/god-rolls' exact render={() => <GodRolls manifest={this.manifest} />} />
                      <Route path='/' exact render={() => <Index />} />
                    </Switch>
                  </div>
                  <Route path='/' render={route => <Footer route={route} />} />
                </div>
              )}
            />
          </Router>
        );
      } else {
        return (
          <Router>
            <Route
              render={route => (
                <div className={cx('wrapper', themeOverride(route.location.pathname) ? themeOverride(route.location.pathname) : this.props.theme.selected, { 'profile-route': isProfileRoute(route.location.pathname) })}>
                  <Route path='/' render={route => <NotificationApp updateAvailable={this.props.updateAvailable} />} />
                  <Route path='/' render={route => <Tooltip {...route} manifest={this.manifest} />} />
                  <GoogleAnalytics.RouteTracker />
                  <div className='main'>
                    <Route path='/' render={route => <Header route={route} {...this.state} {...this.props} themeOverride={themeOverride(route.location.pathname)} manifest={this.manifest} />} />
                    <Switch>
                      <Route path='/character-select' render={route => <CharacterSelect location={route.location} viewport={this.state.viewport} manifest={this.manifest} />} />
                      <Route
                        path='/account'
                        exact
                        render={route => (
                          <Redirect
                            to={{
                              pathname: '/character-select',
                              state: { from: route.location }
                            }}
                          />
                        )}
                      />
                      <Route
                        path='/clan/:view?/:subView?'
                        exact
                        render={route => (
                          <Redirect
                            to={{
                              pathname: '/character-select',
                              state: { from: route.location }
                            }}
                          />
                        )}
                      />
                      <Route
                        path='/character'
                        exact
                        render={route => (
                          <Redirect
                            to={{
                              pathname: '/character-select',
                              state: { from: route.location }
                            }}
                          />
                        )}
                      />
                      <Route
                        path='/checklists'
                        exact
                        render={route => (
                          <Redirect
                            to={{
                              pathname: '/character-select',
                              state: { from: route.location }
                            }}
                          />
                        )}
                      />
                      <Route
                        path='/collections/:primary?/:secondary?/:tertiary?/:quaternary?'
                        render={route => (
                          <Redirect
                            to={{
                              pathname: '/character-select',
                              state: { from: route.location }
                            }}
                          />
                        )}
                      />
                      <Route
                        path='/triumphs/:primary?/:secondary?/:tertiary?/:quaternary?'
                        render={route => (
                          <Redirect
                            to={{
                              pathname: '/character-select',
                              state: { from: route.location }
                            }}
                          />
                        )}
                      />
                      <Route
                        path='/this-week'
                        exact
                        render={route => (
                          <Redirect
                            to={{
                              pathname: '/character-select',
                              state: { from: route.location }
                            }}
                          />
                        )}
                      />
                      <Route path='/vendors/:hash?' exact render={route => <Vendors {...route} manifest={this.manifest} />} />
                      <Route path='/read/:kind?/:hash?' exact render={route => <Read {...route} manifest={this.manifest} />} />
                      <Route path='/settings' exact render={() => <Settings manifest={this.manifest} availableLanguages={this.availableLanguages} />} />
                      <Route path='/pride' exact render={() => <Pride />} />
                      <Route path='/credits' exact render={() => <Credits />} />
                      <Route path='/resources' exact render={() => <Resources />} />
                      <Route path='/resources/clan-banner-builder/:decalBackgroundColorId?/:decalColorId?/:decalId?/:gonfalonColorId?/:gonfalonDetailColorId?/:gonfalonDetailId?/:gonfalonId?/' exact render={route => <ClanBannerBuilder {...route} />} />
                      <Route path='/resources/god-rolls' exact render={() => <GodRolls manifest={this.manifest} />} />
                      <Route path='/' render={() => <Index />} />
                    </Switch>
                  </div>
                  <Route path='/' render={route => <Footer route={route} />} />
                </div>
              )}
            />
          </Router>
        );
      }
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile,
    theme: state.theme
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(App);
