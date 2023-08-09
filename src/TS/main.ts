import dayjs, { Dayjs } from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(weekOfYear);

// let calendarWeekDays = document.getElementById("calendar--weekdays");
// let calendarHours = document.getElementById("calendar--hours");

let calendarMonth = document.getElementById("date--picker-month");
let calendarYear = document.getElementById("date--picker-year");
let today = new Date();
let chosenDate = new Date();
let chosenWeek = dayjs(chosenDate).week();

if (calendarMonth && calendarYear) {
  calendarMonth.innerText = dayjs(chosenDate).format("MMMM");
  calendarYear.innerText = dayjs(chosenDate).format("YYYY");
}

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

const doesContain = (array: number[], predicate: number) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === predicate) {
      return predicate;
    }
  }
};

let navigateCalendar = (currentDate: Date, flag: number): Date => {
  if (flag) {
    //forward
    currentDate.setDate(currentDate.getDate() + 7);
    chosenWeek = dayjs(chosenDate).week();
  } else {
    //backward
    if (currentDate <= today) {
      return chosenDate;
    }
    currentDate.setDate(currentDate.getDate() - 7);
    chosenWeek = dayjs(chosenDate).week();
  }
  if (calendarMonth && calendarYear) {
    calendarMonth.innerText = dayjs(currentDate).format("MMMM");
    calendarYear.innerText = dayjs(currentDate).format("YYYY");
  }

  console.log(chosenWeek, currentDate);
  return currentDate;
};

let calendarNavigationForward = document.getElementById("go-forward");
calendarNavigationForward?.addEventListener("click", () => {
  chosenDate = navigateCalendar(chosenDate, 1);
  fillCalendar(coach);
});

let calendarNavigationBackward = document.getElementById("go-back");
calendarNavigationBackward?.addEventListener("click", () => {
  navigateCalendar(chosenDate, 0);
  fillCalendar(coach);
});

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
    { dayId: 5, bookings: [13, 14] },
    { dayId: 6, bookings: [] },
    { dayId: 7, bookings: [] },
  ],
};

const createCalendar = (coach: Schedule) => {
  for (let i = 1; i <= 7; i++) {
    let currentDate = getDayOfWeek(getCurrentWeekMonday(chosenDate), i);
    for (let j = 0; j < 24; j++) {
      // if (i === 0) {
      //   Za skroz levu kolonu
      //   let calendarHour = document.createElement("div");
      //   calendarHour.classList.add("field");
      //   calendarHour.innerText = String(j);
      //   calendarHours?.appendChild(calendarHour);
      // }
      // if (i !== 0 && j === 0) {
      //   Za skroz gornji red
      //   let calendarWeekDay = document.createElement("div");
      //   let calendarField = document.createElement("div");
      //   let calendarWeekDayName = document.createElement("p");
      //   let calendarDate = document.createElement("p");

      //   calendarWeekDay.setAttribute("id", String(i));
      //   calendarWeekDay.classList.add("column");
      //   calendarField.classList.add("field");
      //   calendarWeekDayName.innerText = WeekDays[i - 1];
      //   calendarDate.innerText = dayjs(currentDate).format("DD");

      //   calendarWeekDays?.appendChild(calendarWeekDay);
      //   calendarWeekDay.appendChild(calendarField);
      //   calendarField.appendChild(calendarWeekDayName);
      //   calendarField.appendChild(calendarDate);
      // }

      let calendarWeekDay = document.getElementById(String(i));
      let calendarField = document.createElement("div");

      calendarField.classList.add("dayId-" + String(i) + "hourId-" + String(j));

      if (calendarWeekDay)
        calendarWeekDay.children[0].children[1].textContent =
          dayjs(currentDate).format("DD");

      calendarField.innerText = dayjs(currentDate).format("DD/MM/YYYY");

      calendarField.classList.add("field");

      if (
        doesContain(coach.days, i) &&
        currentDate > chosenDate && //If current day in week is later than the Monday's date
        j >= coach.startHour && //Current hour is later than coaches starting hour
        j < coach.endHour && //Current hour is earlier than coaches ending hour
        j != doesContain(coach.bookings[i - 1].bookings, j) //Current hour is not a booked term
      ) {
        calendarField.addEventListener("click", () => {
          calendarField.style.backgroundColor = "#0F766EB2";
          coach.bookings[i - 1].bookings.push(j);
          console.log(coach);
          31;
        });
      } else if (
        i > 0 && //If we are in week day range (Monday to Sunday)
        j === doesContain(coach.bookings[i - 1].bookings, j) //If current hour is a booked term
      ) {
        calendarField.style.backgroundColor = "#FF9F1C";
      } else {
        //If the current hour is a non working hour
        calendarField.style.backgroundColor = "lightgrey";
      }

      calendarWeekDay?.appendChild(calendarField);
    }
  }
};

const fillCalendar = (coach: Schedule) => {
  let fields = document.querySelectorAll("field");
  fields.forEach((element) => {
    element.removeEventListener("click", () => {});
  });
  for (let i = 1; i <= 7; i++) {
    let currentDate = getDayOfWeek(getCurrentWeekMonday(chosenDate), i);
    for (let j = 0; j < 24; j++) {
      let calendarWeekDay = document.getElementById(String(i));

      if (calendarWeekDay) {
        calendarWeekDay.children[0].children[1].textContent =
          dayjs(currentDate).format("DD");

        let dayId = ".dayId-" + i.toString();
        let hourId = "hourId-" + j.toString();

        let calendarField = <HTMLDivElement>(
          calendarWeekDay.querySelector(dayId + hourId)
        );

        calendarField.removeEventListener("click", () => {});
        calendarField.style.backgroundColor = "white";

        calendarField.innerText = dayjs(currentDate).format("DD/MM/YYYY");

        if (
          doesContain(coach.days, i) && //if current day is a working day
          currentDate > today && //If current day in week is later than the Monday's date
          j >= coach.startHour && //Current hour is later than coaches starting hour
          j < coach.endHour && //Current hour is earlier than coaches ending hour
          j != doesContain(coach.bookings[i - 1].bookings, j) //Current hour is not a booked term
        ) {
          calendarField.addEventListener("click", () => {
            calendarField.style.backgroundColor = "#0F766EB2";
            coach.bookings[i - 1].bookings.push(j);
            console.log(coach);
          });
        } else if (
          i > 0 && //If we are in week day range (Monday to Sunday)
          j === doesContain(coach.bookings[i - 1].bookings, j) //If current hour is a booked term
        ) {
          calendarField.style.backgroundColor = "#FF9F1C";
        } else {
          //If the current hour is a non working hour
          calendarField.style.backgroundColor = "lightgrey";
        }
      }
    }
  }
};

createCalendar(coach);
