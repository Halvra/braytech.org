import React from 'react';
import { withNamespaces } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import siteMessages from '../../data/siteMessages';

import './styles.css';

class NotificationOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    
  }

  render() {
    const { t } = this.props;

    let messages = siteMessages.slice().reverse();

    let current = false;
    let now = new Date().getTime();
    
    let itemDate = new Date(messages[0].date).getTime();
    if (itemDate > (now - 1209600000)) {
      current = messages[0];
    }

    if (current) {
      return (
        <div id='notification-overlay'>
          <div>
            <strong>{current.name}</strong>
            <ReactMarkdown source={current.description} />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default withNamespaces()(NotificationOverlay);
