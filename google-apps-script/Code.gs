const CONFIG = {
  calendarId: 'primary',
  timezone: 'America/Sao_Paulo',
  daysAhead: 30,
  minNoticeHours: 24,
  appointmentMinutes: 60,
  slotStepMinutes: 60,
  maxDaysToReturn: 6,
  workingHours: {
    1: [['09:00', '12:00'], ['14:00', '17:00']],
    2: [['09:00', '12:00'], ['14:00', '17:00']],
    3: [['09:00', '12:00'], ['14:00', '17:00']],
    4: [['09:00', '12:00'], ['14:00', '17:00']],
    5: [['09:00', '12:00'], ['14:00', '17:00']]
  }
};

function doGet(e) {
  const callback = e.parameter.callback || 'callback';

  try {
    const payload = JSON.stringify(getAvailability());
    return ContentService
      .createTextOutput(`${callback}(${payload});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } catch (error) {
    const payload = JSON.stringify({
      ok: false,
      error: error && error.message ? error.message : String(error)
    });

    return ContentService
      .createTextOutput(`${callback}(${payload});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

function getAvailability() {
  const calendar = CalendarApp.getCalendarById(CONFIG.calendarId);
  if (!calendar) {
    throw new Error(`Agenda não encontrada: ${CONFIG.calendarId}`);
  }

  const now = new Date();
  const start = startOfDay(now);
  const end = addDays(start, CONFIG.daysAhead);
  const events = calendar.getEvents(start, end);
  const days = [];

  for (let dayOffset = 0; dayOffset < CONFIG.daysAhead; dayOffset += 1) {
    const day = addDays(start, dayOffset);
    const weekday = Number(Utilities.formatDate(day, CONFIG.timezone, 'u'));
    const windows = CONFIG.workingHours[weekday] || [];
    const slots = [];

    windows.forEach((windowRange) => {
      const windowStart = timeOnDate(day, windowRange[0]);
      const windowEnd = timeOnDate(day, windowRange[1]);

      for (
        let slotStart = new Date(windowStart);
        addMinutes(slotStart, CONFIG.appointmentMinutes) <= windowEnd;
        slotStart = addMinutes(slotStart, CONFIG.slotStepMinutes)
      ) {
        const slotEnd = addMinutes(slotStart, CONFIG.appointmentMinutes);
        const respectsNotice = slotStart >= addHours(now, CONFIG.minNoticeHours);
        const isBusy = events.some((event) => overlaps(slotStart, slotEnd, event.getStartTime(), event.getEndTime()));

        if (respectsNotice && !isBusy) {
          slots.push(Utilities.formatDate(slotStart, CONFIG.timezone, 'HH:mm'));
        }
      }
    });

    if (slots.length) {
      days.push({
        date: Utilities.formatDate(day, CONFIG.timezone, 'yyyy-MM-dd'),
        horarios: slots
      });
    }

    if (days.length >= CONFIG.maxDaysToReturn) break;
  }

  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    timezone: CONFIG.timezone,
    days
  };
}

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function addDays(date, days) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

function addHours(date, hours) {
  const value = new Date(date);
  value.setHours(value.getHours() + hours);
  return value;
}

function addMinutes(date, minutes) {
  const value = new Date(date);
  value.setMinutes(value.getMinutes() + minutes);
  return value;
}

function timeOnDate(date, time) {
  const parts = time.split(':').map(Number);
  const value = new Date(date);
  value.setHours(parts[0], parts[1], 0, 0);
  return value;
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}
