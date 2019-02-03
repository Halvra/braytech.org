
export const Globals = {
  key: {
    braytech: process.env.REACT_APP_BRAYTECH_API_KEY,
    bungie: process.env.REACT_APP_BUNGIE_API_KEY
  },
  url: {
    braytech: "https://api.braytech.org",
    bungie: "https://www.bungie.net"
  },
  routes: {
    standard: ['character-select', 'pride', 'credits', 'settings', 'resources', 'read'],
    badboys: ['vendors']
  }
}

export const isProfileRoute = (pathname, hasProfileData = false) => {
  let paths = pathname.split('/');
  // if (paths[1] === 'collections' && paths[2] === 'inspect') {
  //   return false;
  // } else 
  if (pathname !== '/' && !Globals.routes.standard.includes(paths[1]) && !Globals.routes.badboys.includes(paths[1])) {
    return true;
  } else if (Globals.routes.badboys.includes(paths[1]) && hasProfileData) {
    return true;
  } else {
    return false;
  }
}

export const themeOverride = pathname => {
  let paths = pathname.split('/');
  if (['read'].includes(paths[1])) {
    return 'dark-mode ' + paths[1];
  } else {
    return false;
  }
}

export default Globals;