
export default defineNuxtPlugin((nuxtApp) => {
    const i18n = nuxtApp.$i18n;

    const treatText = (txt:string):string => {
        return txt
            .replaceAll('\n', '<br>')
            .replaceAll('>>b', '<b>')
            .replaceAll('<<b', '</b>')
            .replaceAll('>>u', '<u>')
            .replaceAll('<<u', '</u>')
            .replaceAll('>>i', '<i>')
            .replaceAll('<<i', '</i>')
            .replaceAll('--UL-', '<ul>')
            .replaceAll('--LI-', '<li>')
            .replaceAll('-LI--', '</li>')
            .replaceAll('-UL--', '</ul>');
    }

    return {
        provide: {
            _tt: (str: string): string => {
                // @ts-ignore
                return treatText(i18n.t(str));
            },
            _Tt: (str: string): string => {
                return treatText(String(i18n.t(str)).slice(0, 1).toLocaleUpperCase() + String(i18n.t(str)).slice(1));
            },
            _TT: (str: string): string => {
                return treatText(String(i18n.t(str)).toUpperCase());
            },
            _ttt: (str: string): string => {
                return treatText(String(i18n.t(str)).toLowerCase());
            }
        }
    }
});