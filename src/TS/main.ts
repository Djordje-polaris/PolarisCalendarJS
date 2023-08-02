import dayjs from "dayjs";

let currentDate = dayjs().format("DD/MM/YYYY");

let calendarWeekDays = document.getElementById("calendar--weekday");

let WeekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type Booking = {
  dayId: number;
  bookings: number[];
};

type Schedule = {
  days: number[];
  startHour: number;
  endHour: number;
  bookings: Booking[];
};

const coach: Schedule = {
  days: [1, 2],
  startHour: 9,
  endHour: 17,
  bookings: [
    { dayId: 1, bookings: [] },
    { dayId: 2, bookings: [] },
    { dayId: 3, bookings: [] },
    { dayId: 4, bookings: [16] },
    { dayId: 5, bookings: [] },
    { dayId: 6, bookings: [] },
    { dayId: 7, bookings: [] },
  ],
};

const createCalendar = (days: number) => {
  let calendarMatrix: String[7][23];
  for (let i = 0; i <= days; i++) {
    for (let j = 0; j <= 23; j++) {
      if (i === 0 && j === 0) {
        let calendarCorner = document.createElement("div");
        calendarCorner.classList.add("field");
      } else if (i !== 0 && j === 0) {
        //Za skroz gornji red
        let calendarDay = document.createElement("div");
        calendarDay.setAttribute("id", String(i));
        calendarDay.classList.add("field");
        calendarDay.innerText = WeekDays[i-1];
        calendarWeekDays?.appendChild(calendarDay);
      } else if (i === 0 && j !== 0) {
        //Za skroz levu kolonu
        let calendarHour = document.createElement("div");
        calendarHour.setAttribute("id", String(j));
        calendarHour.classList.add("field");
        calendarHour.innerText = String(j);
      }
      let calendarField = document.createElement("div");
      let calendarDay = document.getElementById(String(i))


      calendarField.classList.add("field");
      calendarField.setAttribute("id", currentDate);
      calendarField.classList.add(String(j));
      calendarDay?.appendChild(calendarField)
    }
  }
};

createCalendar(7);
