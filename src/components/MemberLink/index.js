import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import * as destinyEnums from '../../utils/destinyEnums';

import './styles.css';

class MemberLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { membershipType, membershipId, displayName } = this.props;

    return (
      <div className='member-link'>
        <span className={`destiny-platform_${destinyEnums.PLATFORMS[membershipType].toLowerCase()}`} />
        {displayName}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    theme: state.theme
  };
}

export default compose(connect(mapStateToProps))(MemberLink);
