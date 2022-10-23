export const convertDateToStartOfUTCDay = (
  dateTime: Date,
  originalTimezone: string
): Date => {
  let start = convertDateUTCToTimezone(dateTime, originalTimezone);
  start.setHours(0, 0, 0, 0);
  return new Date(start.toISOString());
};

export const convertDateToEndOfUTCDay = (
  dateTime: Date,
  originalTimezone: string
): Date => {
  let end = convertDateUTCToTimezone(dateTime, originalTimezone);
  end.setHours(23, 59, 59, 59);
  return new Date(end.toISOString());
};

export const convertDateToTimezone = (
  dateTime: Date,
  timeZone: string
): Date => {
  return new Date(
    dateTime.toLocaleString('en-US', {
      timeZone,
    })
  );
};

export const convertDateUTCToTimezone = (
  dateTime: Date,
  timeZone: string
): Date => {
  return new Date(
    new Date(dateTime.toISOString()).toLocaleString('en-US', {
      timeZone,
    })
  );
};

//Used when you need to convert a schedule that maybe a different original timezone to new timezone
export const convertDateUTCToOriginalTimeZoneToNewTimeZone = (
  dateTime: Date,
  originalTimezone: string,
  timeZone: string
): Date => {
  const dateOriginalTimeZone = convertDateUTCToTimezone(
    dateTime,
    originalTimezone
  );

  return convertDateToTimezone(dateOriginalTimeZone, timeZone);
};

//Schedules should be in new schedule original timezone
export const checkIfRecurringScheduleOnSameDayOfWeek = (
  oldSchedule: {
    startDateTime: Date;
    endDateTime: Date;
  },
  newSchedule: {
    startDateTime: Date;
    endDateTime: Date;
  }
): boolean => {
  //Either schedule's start and end time are diff days of the week
  if (
    oldSchedule.startDateTime.getDay() !== newSchedule.startDateTime.getDay() &&
    oldSchedule.startDateTime.getDay() !== newSchedule.endDateTime.getDay() &&
    oldSchedule.endDateTime.getDay() !== newSchedule.startDateTime.getDay() &&
    oldSchedule.endDateTime.getDay() !== newSchedule.endDateTime.getDay()
  ) {
    return false;
  }

  // let updatedStart = new Date(
  //   newSchedule.startDateTime.getFullYear(),
  //   newSchedule.startDateTime.getMonth(),
  //   newSchedule.startDateTime.getDate(),
  //   newSchedule.startDateTime.getHours(),
  //   newSchedule.startDateTime.getMinutes()
  // );
  // let updatedEnd = new Date(
  //   newSchedule.endDateTime.getFullYear(),
  //   newSchedule.endDateTime.getMonth(),
  //   newSchedule.endDateTime.getDate(),
  //   newSchedule.endDateTime.getHours(),
  //   newSchedule.endDateTime.getMinutes()
  // );

  // const oldStartTimezoneOffset = oldSchedule.startDateTime.getTimezoneOffset();
  // const newStartTimezoneOffset = oldSchedule.startDateTime.getTimezoneOffset();

  // const oldEndTimezoneOffset = oldSchedule.endDateTime.getTimezoneOffset();
  // const newEndTimezoneOffset = oldSchedule.endDateTime.getTimezoneOffset();

  // //Update the hours if there is a diff in timezone offset
  // updatedStart.setHours(
  //   updatedStart.getHours() - (newStartTimezoneOffset - oldStartTimezoneOffset)
  // );
  // updatedEnd.setHours(
  //   updatedStart.getHours() - (newEndTimezoneOffset - oldEndTimezoneOffset)
  // );

  return true;
};
