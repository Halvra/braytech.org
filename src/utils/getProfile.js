import * as responseUtils from './responseUtils';
import * as bungie from './bungie';

async function getProfile(membershipType, membershipId) {
  let [profile, milestones, groups] = await Promise.all([bungie.memberProfile(membershipType, membershipId, '100,104,200,202,204,205,300,301,302,303,304,305,800,900'), bungie.milestones(), bungie.memberGroups(membershipType, membershipId)]);

  profile = responseUtils.profileScrubber(profile);
  groups = responseUtils.groupScrubber(groups);

  return {
    profile,
    groups,
    milestones
  };
}

export default getProfile;
