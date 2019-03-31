import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { withNamespaces } from 'react-i18next';
import packageJSON from '../../../package.json';

import './styles.css';

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t, linkOnClick, minimal } = this.props;

    return (
      <div id='footer'>
        <div>
          © 2019 Tom Chapman <span>{packageJSON.version}</span>
        </div>
        <ul>
          {!minimal ? (
            <>
              <li>
                <Link to='/faq' onClick={linkOnClick}>
                  {t('FAQ')}
                </Link>
              </li>
              <li>
                <Link to='/credits' onClick={linkOnClick}>
                  {t('Credits')}
                </Link>
              </li>
            </>
          ) : null}
          <li>
            <a href='https://twitter.com/justrealmilk' target='_blank' rel='noopener noreferrer'>
              Twitter
            </a>
          </li>
          <li>
            <a href='https://discordapp.com/invite/Y68xDsG' target='_blank' rel='noopener noreferrer'>
              Discord
            </a>
          </li>
          <li>
            <a href='https://www.ko-fi.com/justrealmilk' target='_blank' rel='noopener noreferrer'>
              {t('Buy me a Ko-fi')} 🍻
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default withNamespaces()(Footer);
