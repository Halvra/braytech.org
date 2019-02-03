import React from 'react';

// TODO: we can just use itemCategoryHashes for this now?
export const isOrnament = item => item.inventory && item.inventory.stackUniqueLabel && item.plug && item.plug.plugCategoryIdentifier && item.plug.plugCategoryIdentifier.includes('skins');

export const flagEnum = (state, value) => !!(state & value);

export function hasCategoryHash(item, categoryHash) {
  return item.itemCategoryHashes && item.itemCategoryHashes.includes(categoryHash);
}

export function genderTypeToString(str) {
  let string;

  switch (str) {
    case 0:
      string = 'Male';
      break;
    case 1:
      string = 'Female';
      break;
    default:
      string = 'uh oh';
  }

  return string;
}

export function raceTypeToString(str) {
  let string;

  switch (str) {
    case 0:
      string = 'Human';
      break;
    case 1:
      string = 'Awoken';
      break;
    case 2:
      string = 'Exo';
      break;
    default:
      string = 'uh oh';
  }

  return string;
}

export function classHashToString(hash, manifest, gender) {
  let classDef = manifest.DestinyClassDefinition[hash];
  if (!classDef) return 'uh oh';
  if (classDef.genderedClassNames) {
    return classDef.genderedClassNames[gender == 1 ? 'Female' : 'Male'];
  }
  return classDef.displayProperties.name;
}

export function raceHashToString(hash, manifest, gender) {
  let raceDef = manifest.DestinyRaceDefinition[hash];
  if (!raceDef) return 'uh oh';
  if (raceDef.genderedRaceNames) {
    return raceDef.genderedRaceNames[gender === 1 ? 'Female' : 'Male'];
  }
  return raceDef.displayProperties.name;
}

export function getDefName(hash, manifest, defType = 'DestinyInventoryItemDefinition') {
  try {
    return manifest[defType][hash].displayProperties.name;
  } catch (e) {}
  return 'uh oh';
}

export function classTypeToString(str) {
  let string;

  switch (str) {
    case 0:
      string = 'Titan';
      break;
    case 1:
      string = 'Hunter';
      break;
    case 2:
      string = 'Warlock';
      break;
    default:
      string = 'uh oh';
  }

  return string;
}

export function membershipTypeToString(str) {
  let string;

  switch (str) {
    case 1:
      string = 'Xbox';
      break;
    case 2:
      string = 'PlayStation';
      break;
    case 4:
      string = 'PC';
      break;
    default:
      string = 'uh oh';
  }

  return string;
}

export function damageTypeToString(type) {
  let string;

  switch (type) {
    case 3373582085:
      string = 'Kinetic';
      break;
    case 1847026933:
      string = 'Solar';
      break;
    case 2303181850:
      string = 'Arc';
      break;
    case 3454344768:
      string = 'Void';
      break;
    default:
      string = 'idk';
  }

  return string;
}

export function ammoTypeToString(type) {
  let string;

  switch (type) {
    case 1:
      string = 'Primary';
      break;
    case 2:
      string = 'Special';
      break;
    case 3:
      string = 'Heavy';
      break;
    default:
      string = 'idk';
  }

  return string;
}

function stringToIconsWrapper(string) {
  return <span className={`destiny-${string}`} />
}

export function stringToIcons(string) {
  let array = [];

  let equivalents = {
    "[Sniper Rifle]": "sniper_rifle",
    "[Headshot]": "headshot",
    "[Auto Rifle]": "auto_rifle",
    "[Pulse Rifle]": "pulse_rifle",
    "[Scout Rifle]": "scout_rifle",
    "[Hand Cannon]": "hand_cannon",
    "[Sidearm]": "sidearm",
    "[SMG]": "smg",
    "[Shotgun]": "shotgun",
    "[Fusion Rifle]": "fusion_rifle",
    "[Linear Fusion Rifle]": "wire_rifle",
    "[Trace Rifle]": "beam_weapon",
    "[Rocker Launcher]": "rocket_launcher",
    "[Sword]": "sword_heavy",
    "[Grenade Launcher]": "grenade_launcher"
  }

  array = string.split(/(\[.*?\])/g);

  array.forEach((part, index) => {
    let matches = part.match(/\[(.*?)\]/g);
    if (matches) {
      matches.forEach(match => {
        if (!equivalents[match]) {
          return;
        }
        array[index] = stringToIconsWrapper(equivalents[match]);
      });
    }
  });

  return array;
}

// thank you DIM (https://github.com/DestinyItemManager/DIM/blob/master/src/app/inventory/store/well-rested.ts)
export function isWellRested(characterProgression, manifest) {
  // We have to look at both the regular progress and the "legend" levels you gain after hitting the cap.
  // Thanks to expansions that raise the level cap, you may go back to earning regular XP after getting legend levels.
  const levelProgress = characterProgression.progressions[1716568313];
  const legendProgressDef = manifest.DestinyProgressionDefinition[2030054750];
  const legendProgress = characterProgression.progressions[2030054750];

  // You can only be well-rested if you've hit the normal level cap.
  // And if you haven't ever gained 3 legend levels, no dice.
  if (levelProgress.level < levelProgress.levelCap || legendProgress.level < 4) {
    return {
      wellRested: false
    };
  }

  const progress = legendProgress.weeklyProgress;

  const requiredXP =
    xpRequiredForLevel(legendProgress.level, legendProgressDef) +
    xpRequiredForLevel(legendProgress.level - 1, legendProgressDef) +
    xpRequiredForLevel(legendProgress.level - 2, legendProgressDef);

  // Have you gained XP equal to three full levels worth of XP?
  return {
    wellRested: progress < requiredXP,
    progress,
    requiredXP
  };
}

/**
 * How much XP was required to achieve the given level?
 */
function xpRequiredForLevel(level, progressDef) {
  const stepIndex = Math.min(Math.max(0, level), progressDef.steps.length - 1);
  return progressDef.steps[stepIndex].progressTotal;
}