import { createStore, combineReducers } from 'redux';

import theme from './reducers/theme.js';
import member from './reducers/member.js';
import groupMembers from './reducers/groupMembers.js';
import refreshService from './reducers/refreshService.js';
import PGCRcache from './reducers/PGCRcache.js';
import triumphs from './reducers/triumphs.js';
import collectibles from './reducers/collectibles.js';
import viewport from './reducers/viewport.js';

const rootReducer = combineReducers({
  theme,
  member,
  groupMembers,
  refreshService,
  PGCRcache,
  triumphs,
  collectibles,
  viewport
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__({
      actionsBlacklist: [],
      // trace: true
    })
);

export default store;
