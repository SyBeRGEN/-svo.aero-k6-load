import http from 'k6/http';
import { check, sleep } from 'k6';
import {logflight} from "../logics/logger.js";
import { SharedArray } from 'k6/data';

const flights = new SharedArray('flights', function () {
    return open('../data/flights.csv')
        .split('\n')
        .slice(1)
        .filter(line => line.trim() !== '')
        .map(line => line.trim());
});

export const options = {
    vus: 1,
    iterations: flights.length
};

const startStr = getTodayMidnight();
const endStr = startStr.replace('00:00:00', '23:59:59');

function getTodayMidnight() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // месяц от 0 до 11
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00`;
}

export default function () {
    const flight = flights[__ITER % flights.length];
    const url = 'https://www.svo.aero/bitrix/timetable/';
    const params = [
        `search=${encodeURIComponent(flight)}`,
        'direction=departure',
        `dateStart=${startStr}`,
        `dateEnd=${endStr}`,
        'perPage=99999',
        'page=0',
        'locale=ru'
    ].join('&');

    const res = http.get(`${url}?${params}`);

    if (res.status === 200) {
        try {
            const json = JSON.parse(res.body);
            logflight(json);
        } catch (e) {
            console.error('Ошибка парсинга JSON:', e);
        }
    }

    sleep(1);
}