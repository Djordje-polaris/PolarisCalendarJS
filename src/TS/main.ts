import dayjs from "dayjs";

function getCurrentWeekMonday(currentDate: Date): Date {
  const dayOfWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
  const daysUntilMonday = (dayOfWeek + 6) % 7; // Number of days to the nearest past Monday

  const currentWeekMonday = new Date(currentDate);
  currentWeekMonday.setDate(currentDate.getDate() - daysUntilMonday);

  return currentWeekMonday;
}

function getDayOfWeek(currentDate: Date, i: number): Date {
  const nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + i);
  return nextDay;
}

let currentMonday = dayjs(getCurrentWeekMonday(new Date())).format(
  "DD/MM/YYYY"
);

console.log(currentMonday);

let calendarWeekDays = document.getElementById("calendar--weekday");
let calendarHours = document.getElementById("calendar--hours");

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
    let currentDate = getDayOfWeek(getCurrentWeekMonday(new Date()), i - 1);
    for (let j = 0; j < 24; j++) {
      if (i === 0) {
        //Za skroz levu kolonu
        let calendarHour = document.createElement("div");
        calendarHour.classList.add("field");
        calendarHour.innerText = String(j);
        calendarHours?.appendChild(calendarHour);
      }
      if (i !== 0 && j === 0) {
        //Za skroz gornji red
        let calendarWeekDay = document.createElement("div");
        let calendarField = document.createElement("div")

        calendarWeekDay.setAttribute("id", String(i));
        calendarWeekDay.classList.add("column")
        calendarField.classList.add("field");
        calendarField.innerText = WeekDays[i - 1];
        calendarWeekDays?.appendChild(calendarWeekDay);
        calendarWeekDay.appendChild(calendarField)
      }
      console.log(i, j);

      let calendarField = document.createElement("div");
      let calendarWeekDay = document.getElementById(String(i));
      calendarField.innerText = String(i) + " " + String(j);
      calendarField.classList.add(
        "field",
        dayjs(currentDate).format("DD/MM/YYYY")
      );
      calendarWeekDay?.appendChild(calendarField);
    }
  }
};

createCalendar(7);
