
export const useApiPost = async (requestUrl, opts = {}) => {
  const config = useRuntimeConfig();
  // const apiCookie = useCookie('api_token') ?? null;

  let headers = {
    Accept: '*/*',
    'Origin': config.public.baseAppUrl,
    'Type': 'application/json',
    'Content-Type': 'application/json',
  }
  // "Authorization": apiCookie?.value ? `Bearer ${apiCookie?.value}` : ''

  return new Promise(async (resolve, reject) => {
    const reqOptions = {
      baseURL: config.public.baseApiUrl,
      method: 'POST',
      body: opts,
      headers: headers
    }

    await $fetch(requestUrl, reqOptions)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log('Invalid credentials from API', error);
        reject(error);
      });
    // await useFetch(requestUrl, reqOptions)
    //   .then(res => {
    //     const data = res.data.value
    //     const error = res.error.value
    //
    //     if (error) {
    //       // dealing error
    //       // if (error.statusCode === 401 && error.statusMessage === 'Expired JWT Token') {
    //       //   const router = useRouter()
    //       //   router.push('/')
    //       // }
    //       console.error('API Post request response problem', error.statusCode ?? error.code);
    //       reject({code: error.statusCode, message: error.statusMessage})
    //     } else {
    //       resolve(data)
    //     }
    //   }, error => {
    //     console.error('API Post request response error', error.statusCode ?? error.code);
    //     reject({code: error.statusCode ?? error.code, message: `Exception: ${error.statusMessage}`})
    //   });
  })
}
export const useLocalApiPost = async (requestUrl, opts = {}) => {
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