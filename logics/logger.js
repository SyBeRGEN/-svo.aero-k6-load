// logger.js
export function logFlights(json, startStr, endsStr) {
    let flights = {};

    console.log('📅 Выполнен запрос на рейсы:');
    console.log(`   ➤ С: ${startStr}`);
    console.log(`   ➤ По: ${endsStr}`);

    for (const item of json.items) {
        const flight = item.flt || 'NO_FLIGHT';
        const from = item.mar1?.city || 'NO_FROM';
        const to = item.mar2?.city || 'NO_TO';
        const status = item.status_id || 'NO_STATUS';
        const checkin = item.estimated_chin_start || 'NO_TIME';

        if (!flights[flight]) {
            flights[flight] = {
                from,
                to,
                status,
                times: [],
            };
        }

        flights[flight].times.push(checkin);
    }

    for (const [flight, data] of Object.entries(flights)) {
        const timesSorted = data.times.filter(t => t !== 'NO_TIME').sort();
        const firstTime = timesSorted[0] || 'NO_TIME';
        const lastTime = timesSorted[timesSorted.length - 1] || 'NO_TIME';

        const line = `Из: ${data.from} → В: ${data.to} | Рейс: ${flight} | Статус: ${data.status} | Времена чекинизаций: ${data.times.length} (${firstTime} → ${lastTime})`;
        console.log(line);
    }
}

export function logCity(json) {
    let flights = {};

    console.log('📦 Обработка рейсов по городу');

    if (!json || !Array.isArray(json.items)) {
        console.warn('⚠️ Структура ответа некорректна или пуста');
        console.log(JSON.stringify(json, null, 2));
        return;
    }

    for (const item of json.items) {
        const flight = item.flt || 'NO_FLIGHT';
        const from = item.mar1?.city || 'NO_FROM';
        const to = item.mar2?.city || 'NO_TO';
        const status = item.status_id || 'NO_STATUS';
        const checkin = item.estimated_chin_start || 'NO_TIME';

        if (!flights[flight]) {
            flights[flight] = {
                from,
                to,
                status,
                times: [],
            };
        }

        flights[flight].times.push(checkin);
    }

    function extracted(timesSorted) {
        const lastTime = timesSorted[timesSorted.length - 1] || 'NO_TIME';
        return lastTime;
    }

    for (const [flight, data] of Object.entries(flights)) {
        const timesSorted = data.times.filter(t => t !== 'NO_TIME').sort();
        const firstTime = timesSorted[0] || 'NO_TIME';
        const lastTime = extracted(timesSorted);

        const line = `Из: ${data.from} → В: ${data.to} | Рейс: ${flight} | Статус: ${data.status} | Времена чекинизаций: ${data.times.length} (${firstTime} → ${lastTime})`;
        console.log(line);
    }
}