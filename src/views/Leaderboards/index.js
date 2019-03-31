import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import Moment from 'react-moment';
import cx from 'classnames';

import Ranks from '../../components/Ranks';

import './styles.css';
import ObservedImage from '../../components/ObservedImage';

class Leaderboards extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { t } = this.props;

    console.log(this.state);

    return (
      <div className='view' id='leaderboards'>
        <div className='head'>
          <div className='page-header'>
            <div className='name'>{t('Leaderboards')}</div>
            <div className='description'>{t("It's a long way to the top")}</div>
          </div>
        </div>
        <div className='wrap'>
          <div className='col'>
            <div className='board triumphScore'>
              <div className='sub-header sub'>
                <div>{t('Triumphs')}</div>
              </div>
              <Ranks includeMember />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Leaderboards);
