import { RangeValue } from 'rc-picker/lib/interface';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { ProjDate } from '../store/apis/datesApi';

export function handleLoginError(
    error: unknown,
    callback: (message: string) => void
) {
    if (error instanceof Error) {
        callback(error.message);
    } else {
        callback('Unexpected Error');
    }
}

// get dates in range from date[0] to date[1]
export function getDatesFromRange(range: RangeValue<Dayjs>): string[] {
    if (range && range[0] && range[1]) {
        let startDate = range[0];
        const endDate = range[1];

        const result: string[] = [];

        while (startDate.diff(endDate, 'day') !== 1) {
            result.push(startDate.format('YYYYMMDD'));
            startDate = startDate.add(1, 'day');
        }
        console.log(result);
        return result;
    }
    return [];
}

// sort date array of dates['YYYY-MM-DD'] in ascending order
export function sortDates(dates: string[]): string[] {
    // prepare date array as number[] for sorting
    const filteredArray = dates.map((date) =>
        parseInt([...date].filter((e) => e !== '-').join(''))
    );
    // sort and return dates formated
    return filteredArray.sort().map((e) => formatDate(e));
}

// format numeric date YYYYMMDD to string date YYYY-MM-DD
export function formatDate(dateToFormat: number): string {
    const stringDate = dateToFormat.toString();
    return (
        stringDate.substring(0, 4) +
        '-' +
        stringDate.substring(4, 6) +
        '-' +
        stringDate.substring(6, 8)
    );
}

// convert string date to integer date YYYYMMDD
export function parseDateToInteger(date: string): number {
    const result = parseInt([...date].filter((e) => e !== '-').join(''));
    return result;
}

// sort array of proj dates in ascending order
export function sortPojDates(projDates: ProjDate[]): ProjDate[] {
    const arrayToSort = [...projDates];
    return arrayToSort.sort((a, b) => {
        return parseDateToInteger(a.SK) - parseDateToInteger(b.SK);
    });
}

//  function for backend - from today's date get range of dates to get project data for

export function getDateRangeForQuery(date: string): string[] {
    const queryDate = dayjs(date);
    const startDate = queryDate.date(1).subtract(7, 'day');
    const endDate = queryDate.date(queryDate.daysInMonth()).add(15, 'day');

    const queryDateArray: string[] = [];
    for (let i = 0; !startDate.add(i, 'day').isSame(endDate, 'day'); i++) {
        queryDateArray.push(startDate.add(i, 'day').format('YYYY-MM-DD'));
    }
    return queryDateArray;
}

interface LocalCredentials {
    userName: string;
    jwtToken: string;
}

export function getCredentialsFromLocalStorage() {
    const data = window.localStorage.getItem('SET_TEAM_CREDENTIALS');
    const localCredentials: LocalCredentials = JSON.parse(
        data as string
    ) as LocalCredentials;
    return localCredentials;
}
