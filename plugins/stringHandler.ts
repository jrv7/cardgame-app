
export default defineNuxtPlugin((nuxtApp) => {
    const i18n = nuxtApp.$i18n;
    const client = 'fid';

    const stringToHash = (string:string) => {

        let hash:any = 0;
        let char:any = '';

        if (string.length == 0) return hash;

        for (let i = 0; i < string.length; i++) {
            char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        return hash;
    }

    return {
        provide: {
            _hash: (str: string): string => {
                return stringToHash(str);
            },
            _regex: (regex:string, str:string): boolean => {
                return String(str)
                    .toLowerCase()
                    .match(regex) !== null;
            }
        }
    }
});