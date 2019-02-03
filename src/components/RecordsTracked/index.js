import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import Records from '../Records';

class RecordsTracked extends React.Component {
  render() {
    const { triumphs, limit, pageLink } = this.props;
    let hashes = triumphs.tracked;

    return (
      <ul className={cx('list record-items tracked')}>
        <Records selfLink {...this.props} hashes={hashes} ordered='progress' limit={limit} />
        {pageLink && hashes.length > 0 ? (
          <li key='pageLink' className='linked'>
            <Link to={{ pathname: '/triumphs/tracked', state: { from: '/triumphs' } }}>See all tracked</Link>
          </li>
        ) : null}
        {hashes.length < 1 ? (
          <li key='none-tracked' className='none-tracked'>
            <div className='properties'>
              <div className='text'>
                <div className='name'>Nothing tracked</div>
                <div className='description'>You aren't tracking any records yet!</div>
              </div>
            </div>
          </li>
        ) : null}
        {pageLink && (this.props.location && this.props.location.pathname !== '/triumphs') && hashes.length < 1 ? (
          <li key='pageLink' className='linked'>
            <Link to={{ pathname: '/triumphs', state: { from: '/triumphs' } }}>See all triumphs</Link>
          </li>
        ) : null}
      </ul>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile,
    triumphs: state.triumphs
  };
}

export default compose(connect(mapStateToProps))(RecordsTracked);
