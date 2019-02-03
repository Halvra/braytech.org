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
    const darkPaths = ['/character-select'];
    const { t } = this.props;
    // if (this.props.route.location.pathname !== '/') {
      return (
        <div id='footer' className={cx({ dark: darkPaths.includes(this.props.route.location.pathname) })}>
          <div>
            © 2019 Tom Chapman <span>{packageJSON.version}</span>
          </div>
          <ul>
            <li>
              <Link to='/pride' className='pride'>
                {t('Pride')}
              </Link>
            </li>
            <li>
              <Link to='/credits'>
                {t('Credits')}
              </Link>
            </li>
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
              {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
              <a href='https://www.ko-fi.com/justrealmilk' target='_blank' rel='noopener noreferrer'>
                {t('Buy me a Ko-fi')} 🍻
              </a>
            </li>
          </ul>
        </div>
      );
    // } else {
    //   return null;
    // }
  }
}

export default withNamespaces()(Footer);
