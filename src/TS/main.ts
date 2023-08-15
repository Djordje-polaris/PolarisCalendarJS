import dayjs, { Dayjs } from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { json } from "stream/consumers";
import { DUMMY_DATA } from "./constants";
dayjs.extend(weekOfYear);

// let calendarWeekDays = document.getElementById("calendar--weekdays");
// let calendarHours = document.getElementById("calendar--hours");

let calendarMonth = document.getElementById("date--picker-month");
let calendarYear = document.getElementById("date--picker-year");
let today = new Date();
let chosenDate = new Date();
let chosenWeek = dayjs(chosenDate).week();

let coach = DUMMY_DATA;
type BookingData = typeof coach;
type Bookings = BookingData["bookings"];
type BookingByDay = Bookings[number]["bookings"];
// bookings: {
//   bookingId: number;
//   hourId: number;
//   status: $Enums.booking_confirmed_by_coach | null;
//   sessionType: number;
//   isUsersSession: boolean;

const loadCoachData = () => {
  const localData = localStorage.getItem(chosenWeek.toString());
  if (localData) {
    coach = JSON.parse(localData);
  }
};

if (calendarMonth && calendarYear) {
  calendarMonth.innerText = dayjs(chosenDate).format("MMMM");
  calendarYear.innerText = dayjs(chosenDate).format("YYYY");
}

function getCurrentWeekMonday(currentDate: Date): Date {
  const dayOfWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
  const daysUntilMonday = ((dayOfWeek + 6) % 7) + 1; // Number of days to the nearest past Monday

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
      return true;
    }
  }
  return false;
};

const doesContainBooking = (array: BookingByDay, predicate: number) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].hourId === predicate) {
      return true;
    }
  }
  return false;
};

let navigateCalendar = (currentDate: Date, flag: number): Date => {
  if (flag) {
    //forward
    currentDate.setDate(currentDate.getDate() + 7);
  } else {
    //backward
    if (currentDate <= today) {
      return chosenDate;
    }
    currentDate.setDate(currentDate.getDate() - 7);
  }
  if (calendarMonth && calendarYear) {
    calendarMonth.innerText = dayjs(currentDate).format("MMMM");
    calendarYear.innerText = dayjs(currentDate).format("YYYY");
  }
  chosenWeek = dayjs(chosenDate).week();
  console.log(chosenWeek, currentDate);
  return currentDate;
};

let calendarNavigationForward = document.getElementById("go-forward");
calendarNavigationForward?.addEventListener("click", () => {
  chosenDate = navigateCalendar(chosenDate, 1);
  loadCoachData();
  fillCalendar(coach);
});

let calendarNavigationBackward = document.getElementById("go-back");
calendarNavigationBackward?.addEventListener("click", () => {
  chosenDate = navigateCalendar(chosenDate, 0);
  loadCoachData();
  fillCalendar(coach);
});

const checkBookingStatus = (
  array: BookingByDay,
  predicate: number,
  status: string | null
) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].status === status && array[i].hourId === predicate) {
      return true;
    }
  }
  return false;
};

const spliceBooking = (coach: BookingData) => {
  for (let i = 0; i < coach.bookings.length; i++) {
    for (let j = 0; j < coach.bookings[i].bookings.length; j++) {
      if (coach.bookings[i].bookings[j].status === null)
        coach.bookings[i].bookings.splice(j, 1);
    }
  }
};

function event(i: number, j: number) {
  let popup = document.getElementById("displaypopup");
  let book = document.getElementById("book");

  let radio = document.getElementsByClassName("radio");

  let option: [number];

  for (let f = 0; f < radio.length; f++) {
    radio[f].addEventListener("click", () => {
      option = [f + 1];
      radio[f].classList.add("selected");
      for (let z = 0; z < radio.length; z++) {
        if (z === f) {
          continue;
        }
        radio[z].classList.remove("selected");
      }
      console.log(option);
    });
  }

  book?.addEventListener("click", () => {
    coach.bookings[i - 1].bookings.push({
      hourId: j,
      status: "pending",
      bookingId: 123123,
      isUsersSession: true,
      sessionType: option[0],
    });

    option.splice(0, 1);

    localStorage.setItem(String(chosenWeek), JSON.stringify(coach));
    if (popup) popup.style.display = "none";
  });

  if (popup) popup.style.display = "block";
}

const createCalendar = (coach: BookingData) => {
  spliceBooking(coach);

  for (let i = 1; i <= 7; i++) {
    let currentDate = getDayOfWeek(getCurrentWeekMonday(chosenDate), i);
    for (let j = 0; j < 24; j++) {
      let calendarWeekDay = document.getElementById(i.toString());
      let calendarField = document.createElement("div");

      calendarField.classList.add("dayId-" + i + "hourId-" + j);

      if (calendarWeekDay)
        calendarWeekDay.children[0].children[1].textContent =
          dayjs(currentDate).format("DD");

      // calendarField.innerText = dayjs(currentDate).format("DD/MM/YYYY");

      calendarField.classList.add("field");

      // console.log(
      //   "doesContain(coach.days, i) ",
      //   doesContain(coach.days, i),
      //   " currentDate > today ",
      //   currentDate > today,
      //   " j >= coach.startHour ",
      //   j >= coach.startHour,
      //   " j < coach.endHour ",
      //   j < coach.endHour,
      //   " doesContain(coach.bookings[i - 1].bookings, j) ",
      //   doesContainBooking(coach.bookings[i - 1].bookings, j)
      // );

      if (
        doesContain(coach.days, i) && //if current day is a working day
        currentDate > today && //If current day in week is later than the Monday's date
        j >= coach.startHour && //Current hour is later than coaches starting hour
        j < coach.endHour && //Current hour is earlier than coaches ending hour
        !doesContainBooking(coach.bookings[i - 1].bookings, j) //Current hour is not a booked term
      ) {
        console.log(i,j)
        calendarField.style.backgroundColor = "white";
        calendarField.textContent = "Book now";
        calendarField.addEventListener("click", () => event(i, j));
      } else if (
        currentDate > today &&
        doesContainBooking(coach.bookings[i - 1].bookings, j) //If current hour is a booked term
      ) {
        if (checkBookingStatus(coach.bookings[i - 1].bookings, j, "confirmed"))
          calendarField.style.backgroundColor = "#FF9F1C";

        if (checkBookingStatus(coach.bookings[i - 1].bookings, j, "pending"))
          calendarField.style.backgroundColor = "#0F766E";
      } else {
        //If the current hour is a non working hour
        calendarField.style.backgroundColor = "lightgrey";
      }
      calendarWeekDay?.appendChild(calendarField);
    }
  }
};

const fillCalendar = (coach: BookingData) => {
  spliceBooking(coach);
  for (let i = 1; i <= 7; i++) {
    let currentDate = getDayOfWeek(getCurrentWeekMonday(chosenDate), i);
    for (let j = 0; j < 24; j++) {
      let calendarWeekDay = document.getElementById(i.toString());

      if (calendarWeekDay) {
        calendarWeekDay.children[0].children[1].textContent =
          dayjs(currentDate).format("DD");

        let dayId = ".dayId-" + i.toString();
        let hourId = "hourId-" + j.toString();

        let calendarField = <HTMLDivElement>(
          calendarWeekDay.querySelector(dayId + hourId)
        );

        calendarField.textContent = "";

        // Clone the node to remove listeners and attributes
        let newField = calendarField.cloneNode(true) as HTMLDivElement;
        calendarField.parentNode?.replaceChild(newField, calendarField);

        // newField.innerText = dayjs(currentDate).format("DD/MM/YYYY");

        // console.log(
        //   "doesContain(coach.days, i) ",
        //   doesContain(coach.days, i),
        //   " currentDate > today ",
        //   currentDate > today,
        //   " j >= coach.startHour ",
        //   j >= coach.startHour,
        //   " j < coach.endHour ",
        //   j < coach.endHour,
        //   " doesContain(coach.bookings[i - 1].bookings, j) ",
        //   doesContainBooking(coach.bookings[i - 1].bookings, j)
        // );

        if (
          doesContain(coach.days, i) && //if current day is a working day
          currentDate > today && //If current day in week is later than the Monday's date
          j >= coach.startHour && //Current hour is later than coaches starting hour
          j < coach.endHour && //Current hour is earlier than coaches ending hour
          !doesContainBooking(coach.bookings[i - 1].bookings, j) //Current hour is not a booked term
        ) {
          newField.style.backgroundColor = "white";
          newField.textContent = "Book now";
          newField.addEventListener("click", () => event(i, j));
        } else if (
          currentDate > today &&
          doesContainBooking(coach.bookings[i - 1].bookings, j) //If current hour is a booked term
        ) {
          if (
            checkBookingStatus(coach.bookings[i - 1].bookings, j, "confirmed")
          )
            newField.style.backgroundColor = "#FF9F1C";
          if (checkBookingStatus(coach.bookings[i - 1].bookings, j, "pending"))
            newField.style.backgroundColor = "#0F766E";
        } else {
          //If the current hour is a non working hour
          newField.style.backgroundColor = "lightgrey";
        }
      }
    }
  }
};

createCalendar(coach);
