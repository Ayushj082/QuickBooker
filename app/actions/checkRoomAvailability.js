'use server';

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";

function toUTCDateTime(dateSring) {
    return DateTime.fromISO(dateSring, { zone: 'utc' }).toUTC();
  }

  function dateRangesOverlap(checkInA, checkOutA, checkInB, checkOutB) {
    return checkInA < checkOutB && checkOutA > checkInB;
  }

async function checkRoomAvailability(roomId, checkIn, checkOut) {
    const sessionCookie =  cookies().get('appwrite-session');
    if (!sessionCookie) {
        redirect('/login');
      }
    
  try {
    const { databases } = await createSessionClient(
        sessionCookie.value
      );
        const checkInDateTime = toUTCDateTime(checkIn);
        const checkOutDateTime = toUTCDateTime(checkOut);

      const { documents: bookings } = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
        [Query.equal('room_id', roomId)]
      );

    for (const booking of bookings){
        const bookingCheckInDateTime = toUTCDateTime(booking.check_in);
        const bookingCheckOutDateTime = toUTCDateTime(booking.check_out);
        if (
            dateRangesOverlap(
              checkInDateTime,
              checkOutDateTime,
              bookingCheckInDateTime,
              bookingCheckOutDateTime
            )
          ) {
            return false; // Overlap found, do not book
          }
        }
        return true;
  } catch (error) {
    console.log('Failed to check availability', error.message || error);
    // return []; // or  if you want to handle in UI
    return { error: 'Failed to check availability' };
  }
}

export default checkRoomAvailability;
