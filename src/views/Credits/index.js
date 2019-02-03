import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import cx from 'classnames';

import './styles.css';

class Credits extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {}

  render() {
    const { t } = this.props;

    return (
      <div className={cx('view', this.props.theme.selected)} id='credits'>
        <div className='content'>
          <div className='name'>{t('Credits')}</div>
          <div className='description'>
            <p>Thanks to Bungie in general for a great game and a great API. Thanks to vthornheart, the boys in the DIM Slack, and for everyone who's excitement motivates me.</p>
            <p>
              The repo is at{' '}
              <a href='https://github.com/justrealmilk/braytech.org' target='_blank' rel='noopener noreferrer'>
                justrealmilk/braytech.org
              </a>
              .{' '}
              <a href='https://github.com/justrealmilk/braytech.org/issues' target='_blank' rel='noopener noreferrer'>
                Issues?
              </a>
            </p>
            <ul>
              <li>
                <strong>{t('Translations')}</strong>
                <ul>
                  <li>
                    <a href='https://github.com/marquesinijatinha' target='_blank' rel='noopener noreferrer'>
                      João Paulo (Português Brasileiro)
                    </a>
                  </li>
                  <li>
                    <a href='https://github.com/koenigderluegner' target='_blank' rel='noopener noreferrer'>
                      Alex Niersmann (Deutsch)
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <strong>{t('Index')}</strong>
                <ul>
                  <li>
                    <a href='https://www.artstation.com/artwork/33PaD' target='_blank' rel='noopener noreferrer'>
                      Image
                    </a>{' '}
                    by Jesse van Dijk / Bungie
                  </li>
                </ul>
              </li>
              <li>
                <strong>{t('Checklists')}</strong>
                <ul>
                  <li>
                    <a href='https://github.com/mipearson' target='_blank' rel='noopener noreferrer'>
                      Michael Pearson
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <strong>{t('This Week')}</strong>
                <ul>
                  <li>
                    <a href='https://github.com/delphiactual' target='_blank' rel='noopener noreferrer'>
                      Rob Jones
                    </a>
                  </li>
                  <li>
                    <a href='https://github.com/koenigderluegner' target='_blank' rel='noopener noreferrer'>
                      Alex Niersmann
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
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
