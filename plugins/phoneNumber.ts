
import countryMap from '~/assets/json/country_list.json';

export default defineNuxtPlugin(() => {
  function getCountryFromPhone(phone: string, returnPhoneNumber: false) {
    if (!['0', '+'].includes(phone.charAt(0))) return 'invalid-phone-number';
    let currentPhone:string = phone.replaceAll('+', '')
      .replaceAll(' ', '')
      .replaceAll('-', '')
      .replaceAll('_', '')
      .replaceAll('.', '')
      .replaceAll('(', '')
      .replaceAll(')', '')
      .replaceAll('[', '')
      .replaceAll(']', '');

    if (!parseInt(currentPhone)) return 'invalid-phone-number.';
    currentPhone = `${parseInt(currentPhone)}`;
    let countrySearchLimit = 0;
    let rootCountries = countryMap.filter(i => i.idd.root === `+${currentPhone.charAt(0)}`);
    let country = JSON.parse(JSON.stringify(rootCountries));

    do {
      country = country.filter(i => i.idd.suffixes.includes(`${currentPhone.substring(1, (2 + countrySearchLimit))}`));

      if (!country.length) {
        country = JSON.parse(JSON.stringify(rootCountries));
      }

      countrySearchLimit++;
    } while(countrySearchLimit <= 10 && country.length > 1)

    if (returnPhoneNumber) {
      return {phone: currentPhone, country: country[0]}
    }

    return country[0];
  }

  return {
    provide: {
      getPhoneCountry: getCountryFromPhone
    }
  }
})