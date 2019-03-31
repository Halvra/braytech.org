import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import './styles.css';

class Button extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classNames, text, action, invisible, disabled, lined } = this.props;
    const theme = this.props.themeOverride || this.props.theme.selected;

    return (
      <button
        className={cx(classNames, { lined: lined, disabled: disabled, invisible: invisible }, theme)}
        onClick={() => {
          if (action) {
            action();
          }
        }}
      >
        <div className='text'>{text}</div>
      </button>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    theme: state.theme
  };
}

export default compose(connect(mapStateToProps))(Button);
