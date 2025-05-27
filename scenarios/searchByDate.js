import http from 'k6/http';
import { check, sleep } from 'k6';
import {logFlights} from "./logger.js";
import {getRandomDateRange} from "./dateCalculator.js";
import {SharedArray} from "k6/data";

export const options = {
    vus: 1,
    iterations: 2
};

const csvData = new SharedArray('Города', function () {
    return open ('./cities.csv')
        .split('./cities.csv')
        .filter(line => line.trim() !== '')
        .map(line => line.trim());
});

export default function () {
    const { startStr, endStr } = getRandomDateRange();

    const url = 'https://www.svo.aero/bitrix/timetable/';
    const params = [
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
            logFlights(json, startStr, endStr);
        } catch (e) {
            console.error('Ошибка парсинга JSON:', e);
        }
    }

    sleep(1);
}