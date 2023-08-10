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

type Term = {
  hourId: number;
  status: boolean | null;
};

type Bookings = {
  dayId: number;
  bookings: Term[];
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
    { dayId: 2, bookings: [{ hourId: 12, status: true }] },
    { dayId: 3, bookings: [] },
    { dayId: 4, bookings: [{ hourId: 13, status: false }] },
    {
      dayId: 5,
      bookings: [
        { hourId: 15, status: true },
        { hourId: 16, status: false },
      ],
    },
    { dayId: 6, bookings: [] },
    { dayId: 7, bookings: [] },
  ],
};

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

const doesContainNumber = (array: number[], predicate: number) => {
  console.log(array.length);
  for (let i = 0; i < array.length; i++) {
    if (array[i] == predicate) {
      console.log(array[i], i, predicate);
      return true;
    }
  }
  return false;
};

const doesContainTerm = (array: Term[], predicate: number) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].hourId === predicate) {
      console.log(array[i].hourId, i, predicate);
      console.log(array.length);
      return predicate;
    }
  }
  return 25;
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

const createCalendar = (coach: Schedule) => {
  for (let i = 1; i <= 7; i++) {
    let currentDate = getDayOfWeek(getCurrentWeekMonday(chosenDate), i);
    for (let j = 0; j < 24; j++) {
      let calendarWeekDay = document.getElementById(String(i));
      let calendarField = document.createElement("div");

      calendarField.classList.add("dayId-" + String(i) + "hourId-" + String(j));

      if (calendarWeekDay)
        calendarWeekDay.children[0].children[1].textContent =
          dayjs(currentDate).format("DD");

      calendarField.innerText = String(i) + " " + String(j);

      calendarField.classList.add("field");

      console.log(
        i + ": i ",
        j + ": j",
        doesContainNumber(coach.days, i),
        currentDate > today,
        dayjs(currentDate).format("DD/MM/YYYY"),
        dayjs(today).format("DD/MM/YYYY"),
        j < coach.endHour,
        j != doesContainTerm(coach.bookings[i - 1].bookings, j)
      );
      if (
        doesContainNumber(coach.days, i) &&
        currentDate > today && //If current day in week is later than the Monday's date
        j >= coach.startHour && //Current hour is later than coaches starting hour
        j < coach.endHour && //Current hour is earlier than coaches ending hour
        j != doesContainTerm(coach.bookings[i - 1].bookings, j) //Current hour is not a booked term
      ) {
        // console.log(i + ": i ", j + ": j", "proslo");

        calendarField.style.backgroundColor = "white";
        calendarField.addEventListener("click", () => {
          calendarField.style.backgroundColor = "#0F766EB2";
          coach.bookings[i - 1].bookings.push({ hourId: j, status: false });
          //   console.log(coach);
        });
      } else if (
        i > 0 && //If we are in week day range (Monday to Sunday)
        j === doesContainTerm(coach.bookings[i - 1].bookings, j) //If current hour is a booked term
      ) {
        console.log("prosao u else " + i + j);
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
//   let fields = document.querySelectorAll("field");
//   fields.forEach((element) => {
//     element.removeEventListener("click", () => {});
//   });
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

        console.log(
          i + ": i ",
          j + ": j",
          doesContainNumber(coach.days, i),
          currentDate > today,
          dayjs(currentDate).format("DD/MM/YYYY"),
          dayjs(today).format("DD/MM/YYYY"),
          j >= coach.startHour,
          j < coach.endHour,
          j != doesContainTerm(coach.bookings[i - 1].bookings, j)
        );
        if (
          doesContainNumber(coach.days, i) &&
          currentDate > chosenDate && //If current day in week is later than the Monday's date
          j >= coach.startHour && //Current hour is later than coaches starting hour
          j < coach.endHour && //Current hour is earlier than coaches ending hour
          j != doesContainTerm(coach.bookings[i - 1].bookings, j) //Current hour is not a booked term
        ) {
          console.log(i + ": i ", j + ": j", "proslo");

          calendarField.style.backgroundColor = "white";
          calendarField.addEventListener("click", () => {
            calendarField.style.backgroundColor = "#0F766EB2";
            coach.bookings[i - 1].bookings.push({ hourId: j, status: false });
            console.log(coach);
          });
        } else if (
          i > 0 && //If we are in week day range (Monday to Sunday)
          j === doesContainTerm(coach.bookings[i - 1].bookings, j) //If current hour is a booked term
        ) {
          console.log("prosao u else " + i + j);
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

// let array = [1,2,3]

// console.log(doesContainNumber(array,3))
