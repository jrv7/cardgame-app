import {useApiPost} from "~/composables/useApiFetch";

export default defineEventHandler(async (event) => {
  let requestBody

  if (process.env.NODE_ENV === "development") {
    requestBody = await readBody(event);
  } else {
    requestBody = event.node?.req?.body;
  }

  let apiRequestBody = {
    ...requestBody
  }

  return new Promise((resolve, reject) => {
    const listSize = 1211;
    const pageSize = requestBody.pageSize || 10;
    const page = requestBody.page || 1;
    const search = requestBody.search || '';
    const searchable = requestBody.searchableColumns || [];
    let returnedList = [];

    for(let i = 0; i < listSize; i++) {
      returnedList.push({
        id: i+1,
        name: `Card ${1000+i+1}`
      });
    }

    const filteredList = returnedList.filter(i => {
      if (!searchable.length) return false;
      if (!search.length) return true;

      let found = false;
      const regexp = new RegExp(search.toLowerCase())

      searchable.forEach(col => {
        found = !!String(i[col]).toLowerCase().match(regexp);
      });

      return found;
    });

    const visibleList = filteredList.filter((i, index) => ((index >= (((page - 1) * pageSize)) && (index < (((page - 1) * pageSize) + pageSize)))));

    resolve({
      success: true,
      data: {
        total: filteredList.length,
        page: page,
        pageSize: pageSize,
        from: page,
        to: parseInt((filteredList.length / pageSize) + (filteredList.length % pageSize ? 1 : 0)),
        results: visibleList
      }
    });
  })
})