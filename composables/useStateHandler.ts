
export const useStateHandler = () => {
  const globalState = useGlobalState();

  return {
    logMissingTranslation: (language, word) => {
      const clientName = 'gateway';
      const loggedWord = word.replaceAll(clientName+'__', '');

      let missingWord = globalState.value.missingTranslations.find(i => i.word === loggedWord);

      if (missingWord) {
        if (!missingWord.languages.includes(language)) {
          missingWord.languages.push(language);
        }
      } else {
        missingWord = {
          word: loggedWord,
          languages: [language]
        }
        globalState.value.missingTranslations.push(missingWord);
      }
    }
  }
}