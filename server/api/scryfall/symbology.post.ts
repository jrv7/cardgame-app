import {fetchCardDetails} from "~/server/composables/cards/Functions";
import {useApiPost} from "~/composables/useApiFetch";

export default defineEventHandler(async (event) => {
  return new Promise((resolve, reject) => {
    $fetch('https://api.scryfall.com/symbology', {
      method: 'GET',
      headers: {
        Accept: '*/*',
        'Type': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log('Could not fetch from Scryfall', error);
        reject(error);
      });
  })
})