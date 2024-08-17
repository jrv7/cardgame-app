import {useApiPost} from "~/composables/useApiFetch";

export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'sessionId');
  const playerId = getRouterParam(event, 'playerId');

  let headers = {}
  let requestBody;

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  return new Promise((resolve, reject) => {
    useApiPost(`/session/${sessionId}/shuffle/${playerId}`, requestBody, headers)
      .then((handResp) => {
        resolve(handResp);
      })
      .catch((e) => {
        console.log('Could not resolve game session', e);
      })
  })
})