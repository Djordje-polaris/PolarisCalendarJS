export const DUMMY_DATA = 
  {
    days: [1, 2, 3, 4, 5],
    startHour: 9,
    endHour: 17,
    bookings: [
      {
        dayId: 1,
        bookings: [
          {
            bookingId: 39,
            hourId: 9,
            status: null,
            sessionType: 1,
            isUsersSession: false,
          },
          {
            bookingId: 93,
            hourId: 10,
            status: "pending",
            sessionType: 5,
            isUsersSession: false,
          },
          {
            bookingId: 101,
            hourId: 13,
            status: "pending",
            sessionType: 5,
            isUsersSession: true,
          },
        ],
      },
      {
        dayId: 2,
        bookings: [
          {
            bookingId: 40,
            hourId: 9,
            status: null,
            sessionType: 1,
            isUsersSession: false,
          },
          {
            bookingId: 102,
            hourId: 10,
            status: "confirmed",
            sessionType: 1,
            isUsersSession: true,
          },
        ],
      },
      {
        dayId: 3,
        bookings: [
          {
            bookingId: 80,
            hourId: 9,
            status: null,
            sessionType: 1,
            isUsersSession: false,
          },
          {
            bookingId: 87,
            hourId: 12,
            status: "confirmed",
            sessionType: 5,
            isUsersSession: false,
          },
          {
            bookingId: 100,
            hourId: 11,
            status: "pending",
            sessionType: 3,
            isUsersSession: true,
          },
        ],
      },
      {
        dayId: 4,
        bookings: [
          {
            bookingId: 81,
            hourId: 9,
            status: null,
            sessionType: 5,
            isUsersSession: false,
          },
        ],
      },
      {
        dayId: 5,
        bookings: [
          {
            bookingId: 50,
            hourId: 9,
            status: null,
            sessionType: 1,
            isUsersSession: false,
          },
          {
            bookingId: 88,
            hourId: 14,
            status: "pending",
            sessionType: 1,
            isUsersSession: false,
          },
        ],
      },
      {
        dayId: 6,
        bookings: [],
      },
      {
        dayId: 7,
        bookings: [],
      },
    ],
  }

