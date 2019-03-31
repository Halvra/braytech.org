export function store(payload) {
  try {

    fetch('https://voluspa-a.braytech.org/member/store', {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

  } catch (e) {

  }
}

export async function statistics(payload) {
  try {

    const request = await fetch('https://voluspa-a.braytech.org/statistics/triumphs', {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(r => r.json());

    return request.Response.data;

  } catch (e) {

  }
}

export async function leaderboard(offset = 0, limit = 10) {
  const request = await fetch(`https://voluspa-a.braytech.org/leaderboard/triumphScore/?limit=${limit}&offset=${offset}`).then(r => r.json())

  if (request.ErrorCode === 1) {
    return request.Response;
  } else {
    return {};
  }

}

export async function memberRank(membershipType = false, membershipId = false) {
  if (!membershipType) {
    return {};
  }

  const request = await fetch(`https://voluspa-a.braytech.org/member/rank/?membershipType=${membershipType}&membershipId=${membershipId}`).then(r => r.json())

  if (request.ErrorCode === 1) {
    return request.Response;
  } else {
    return {};
  }

}