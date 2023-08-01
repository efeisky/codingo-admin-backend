function getExpiryTime(minute) {
    return new Date(new Date().setMinutes(new Date().getMinutes() + minute));
}
function calculateRemainingTime(targetDate) {
    const currentDateTime = new Date();
    const targetDateTime = new Date(targetDate);
    const timeDifferenceInMilliseconds = targetDateTime - currentDateTime;
    const totalMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return { hours: hours, minutes: minutes };
}

module.exports = {
    getExpiryTime,
    calculateRemainingTime
};