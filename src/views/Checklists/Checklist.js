import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import ProgressBar from '../../components/ProgressBar';

const Checklist = props => {
  const { t, name, binding, totalItems, progressDescription, completedItems, children } = props;

  return (
    <>
      <div className='head'>
        <h4>{name}</h4>
        <div className='binding'>
          <p>{binding}</p>
        </div>
        <ProgressBar
          objectiveDefinition={{
            progressDescription,
            completionValue: totalItems
          }}
          playerProgress={{
            progress: completedItems
          }}
          hideCheck
          chunky
        />
      </div>
      {children.length > 0 ? (
        <ul className='list no-interaction'>{children}</ul>
      ) : (
        <div className='info'>
          <div className='text'>{t("You've completed this list.")}</div>
        </div>
      )}
    </>
  );
};

Checklist.propTypes = {
  name: PropTypes.node.isRequired,
  binding: PropTypes.node.isRequired,
  progressDescription: PropTypes.string.isRequired,
  totalItems: PropTypes.number.isRequired,
  completedItems: PropTypes.number.isRequired
};

export default withNamespaces()(Checklist);
