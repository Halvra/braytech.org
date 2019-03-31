import entities from 'entities';

export const profileScrubber = profile => {
  // convert character response to an array
  profile.characters.data = Object.values(profile.characters.data).sort(function(a, b) {
    return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal);
  });

  // remove dud ghost scans
  if (profile.profileProgression) {
    delete profile.profileProgression.data.checklists[2360931290][1116662180];
    delete profile.profileProgression.data.checklists[2360931290][3856710545];
    delete profile.profileProgression.data.checklists[2360931290][508025838];
  }

  // adjust adventures checklist state https://github.com/Bungie-net/api/issues/786
  if (profile.characterProgressions) {
    let completed = false;

    // Signal Light
    Object.values(profile.characterProgressions.data).forEach(character => {
      if (character.checklists[4178338182][844419501]) {
        completed = true;
      }
    });
    Object.values(profile.characterProgressions.data).forEach(character => {
      if (completed) {
        character.checklists[4178338182][844419501] = true;
      }
    });
    completed = false;
    //Not Even the Darkness
    Object.values(profile.characterProgressions.data).forEach(character => {
      if (character.checklists[4178338182][1942564430]) {
        completed = true;
      }
    });
    Object.values(profile.characterProgressions.data).forEach(character => {
      if (completed) {
        character.checklists[4178338182][1942564430] = true;
      }
    });
  }

  return profile;
};

export const groupScrubber = groups => {
  if (groups.results.length > 0) {
    groups.results[0].group.clanInfo.clanCallsign = entities.decodeHTML(groups.results[0].group.clanInfo.clanCallsign);
    groups.results[0].group.name = entities.decodeHTML(groups.results[0].group.name);
  }

  return groups;
};
