import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../components/ObservedImage';

import './styles.css';

class Resources extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    
  }

  render() {
    const { t } = this.props;
    return (
      <div className={cx('view', this.props.theme.selected)} id='resources'>
        <div className='resource'>
          <ObservedImage className='image' src='/static/images/clan-banner-builder.jpg'></ObservedImage>
          <div className='properties'>
            <div className='name'>
              {t('Clan Banner Builder')}
            </div>
            <div className='description'>
              <p>{t('Collaborate with clan members on a new clan banner.')}</p>
            </div>
          </div>
          <Link to='/resources/clan-banner-builder'></Link>
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
