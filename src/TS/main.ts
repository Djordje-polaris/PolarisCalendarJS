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

type Bookings = {
  dayId: number;
  bookings: number[];
};

type Schedule = {
  days: number[];
  startHour: number;
  endHour: number;
  bookings: Bookings[];
};

const coach: Schedule = {
  days: [1, 2, 4, 5],
  startHour: 9,
  endHour: 17,
  bookings: [
    { dayId: 1, bookings: [] },
    { dayId: 2, bookings: [12] },
    { dayId: 3, bookings: [] },
    { dayId: 4, bookings: [16] },
    { dayId: 5, bookings: [13,14,15] },
    { dayId: 6, bookings: [] },
    { dayId: 7, bookings: [] },
  ],
};

const doesContain = (array: number[], predicate: number) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === predicate) {
      return predicate;
    }
  }
};

const createCalendar = (coach: Schedule) => {
  for (let i = 0; i <= 7; i++) {
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
        let calendarField = document.createElement("div");

        calendarWeekDay.setAttribute("id", String(i));
        calendarWeekDay.classList.add("column");
        calendarField.classList.add("field");
        calendarField.innerText = WeekDays[i - 1];
        calendarWeekDays?.appendChild(calendarWeekDay);
        calendarWeekDay.appendChild(calendarField);
      }

      let calendarField = document.createElement("div");
      let calendarWeekDay = document.getElementById(String(i));
      calendarField.innerText = String(i) + " " + String(j);
      calendarField.classList.add(
        "field",
        String(j),
        dayjs(currentDate).format("DD/MM/YYYY")
      );

      if (
        doesContain(coach.days, i) &&
        j >= coach.startHour &&
        j < coach.endHour &&
        j != doesContain(coach.bookings[i - 1].bookings, j)
      ) {
        calendarField.addEventListener("click", () => {
          calendarField.style.backgroundColor = "#0F766EB2";
          coach.bookings[i - 1].bookings.push(j);
          console.log(coach);
        });
      } else if (
        i > 0 &&
        j === doesContain(coach.bookings[i - 1].bookings, j)
      ) {
        calendarField.style.backgroundColor = "yellow";
      } else {
        calendarField.style.backgroundColor = "red";
      }

      calendarWeekDay?.appendChild(calendarField);
    }
  }
};
createCalendar(coach);
