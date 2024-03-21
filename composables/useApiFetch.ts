
export const useApiPost = async (requestUrl, opts = {}, headers = {}) => {
  const config = useRuntimeConfig();

  // headers.Authorization = `Bearer ${apiCookie?.value}`;

  return new Promise(async (resolve, reject) => {
    const reqOptions = {
      baseURL: config.public.baseApiUrl,
      method: 'POST',
      body: opts,
      headers: {
        Accept: '*/*',
        'Origin': config.public.baseAppUrl,
        'Type': 'application/json',
        'Content-Type': 'application/json',
        ...headers
      }
    }

    await $fetch(requestUrl, reqOptions)
      .then((response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject({code: response.code, message: response.message});
        }
      })
      .catch((error) => {
        console.log('Invalid credentials from API', error);
        reject(error);
      });
  })
}
export const useLocalApiPost = async (requestUrl, opts = {}, headers = {}) => {
  const config = useRuntimeConfig();

  return new Promise(async (resolve, reject) => {
    const {data, error} = await useFetch(`/api${requestUrl}`, {
      baseURL: config.public.baseAppUrl,
      method: 'POST',
      body: opts,
      headers: {
        Accept: 'application/json'
      },
    });

    if (!error?.value?.data) {
      resolve(data.value)
    } else {
      reject(error.value.data)
    }
  })
}

export const useDynamicPost = async (requestUrl, opts = {}, headers = null) => {
  const config = useRuntimeConfig();
  const sessionCode = useCookie('managerSession') ?? null;

  let postHeaders = {};
  if (null === headers) {
    if (sessionCode && sessionCode.value && sessionCode.value !== 'null') {
      postHeaders = {
        Authorization: `Bearer ${sessionCode.value}`
      }
    }
  } else {
    postHeaders = {
      ...headers
    }
  }

  if ([useConsts().ENV_DEVELOPMENT, useConsts().ENV_INTEGRATION, useConsts().ENV_RECETTE].includes(config.public.env)) {
    return await useApiPost(requestUrl, opts, postHeaders);
  } else {
    return await useLocalApiPost(requestUrl, opts);
  }
}