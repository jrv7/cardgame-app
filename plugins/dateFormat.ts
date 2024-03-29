export default defineNuxtPlugin((nuxtApp) => {
    function stringToDate(_date: string, _format: string = 'yyyy-mm-dd', _delimiter: string = '-') {
        var formatLowerCase = _format.toLowerCase();
        var formatItems: array = formatLowerCase.split(_delimiter);
        var dateItems: array = String(_date).split(_delimiter);
        var monthIndex = formatItems.indexOf("mm");
        var dayIndex = formatItems.indexOf("dd");
        var yearIndex = formatItems.indexOf("yyyy");
        var month=parseInt(dateItems[monthIndex]);
        month-=1;

        return new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    }

    return {
        provide: {
            getTimestamp: ():number => {
                const currentDate = new Date();
                return currentDate.getMilliseconds();
            },
            dateFromString: stringToDate,
            dateFormat: (date: string, format:string = 'Y-m-d', withTime:string|boolean = false) => {
                if (typeof date !== 'string') return null;
                const i18n = nuxtApp.$i18n;
                const dateOnly = date.substr(0,10);
                const timeOnly = date.substr(-1 * (date.length - dateOnly.length - 1));
                const dateObj = stringToDate(dateOnly, 'yyyy-mm-dd', '-');
                const Year = `${dateObj.getFullYear()}`;
                const Month = `${dateObj.getMonth()+1}`;
                const Day = `${dateObj.getDate()}`;

                let timeParts = [];
                if (timeOnly && timeOnly.length) {
                    timeParts = timeOnly.split(':');
                }

                let formatted = format
                  .replaceAll('YYYY', Year)
                  .replaceAll('Y', Year)
                  .replaceAll('yyyy', Year)
                  .replaceAll('yy', Year.slice(2))
                  .replaceAll('y', Year.slice(2))
                  .replaceAll('MMM', i18n.t(`datepicker_month_name_long_${Month}`).slice(0, 1).toLocaleUpperCase() + i18n.t(`datepicker_month_name_long_${Month}`).slice(1))
                  .replaceAll('mmm', i18n.t(`datepicker_month_name_short_${Month}`).toLocaleUpperCase() + i18n.t(`datepicker_month_name_short_${Month}`).slice(1))
                  .replaceAll('mm', (Month.length === 1 ? '0' : '') + Month)
                  .replaceAll('dd', (Day.length === 1 ? '0' : '') + Day)
                  .replaceAll('d', (Day.length === 1 ? '0' : '') + Day);

                if (false !== withTime && timeParts.length) {
                    formatted = `${formatted} ${withTime.replaceAll('H', timeParts[0]).replaceAll('i', timeParts[1]).replaceAll('s', (timeParts[2] || ''))}`
                }

                return formatted;
            }
        }
    }
})