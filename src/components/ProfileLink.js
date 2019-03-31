import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

function BuildProfileLink(props) {
  const { to, children, component, member, onClick, isActive, exact, ...rest } = props;
  const LinkComponent = component || Link;

  let memberPrefix = member.characterId ? `/${member.membershipType}/${member.membershipId}/${member.characterId}` : '';

  let pathname = typeof to === 'object' ? to.pathname : to;
  let state = typeof to === 'object' ? to.state : false;

  return (
    <LinkComponent to={{ pathname: `${memberPrefix}${pathname}`, state: state || undefined }} onClick={onClick || null} {...(LinkComponent === NavLink ? { isActive, exact } : null)}>
      {children}
    </LinkComponent>
  );
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export const ProfileLink = connect(mapStateToProps)(BuildProfileLink);

function BuildProfileNavLink(props) {
  return <ProfileLink {...props} component={NavLink} />;
}

export const ProfileNavLink = BuildProfileNavLink;

// https://reacttraining.com/react-router/web/api/NavLink/isactive-func
