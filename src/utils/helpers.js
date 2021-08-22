export function convert_minutes_amount_to_time_string(minutes_amount) {
    let time = new Date(minutes_amount * 60 * 1000)
    return time.getUTCHours() + 'h ' + time.getUTCMinutes() + 'm'
}