'use server';

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { redirect } from "next/navigation";
import checkAuth from "./checkAuth";
import { revalidatePath } from "next/cache";
import checkRoomAvailability from "./checkRoomAvailability";

async function bookRoom(previousState, formData) {
    const sessionCookie =  cookies().get('appwrite-session');
    if (!sessionCookie) {
        redirect('/login');
      }
    
  try {
    const { databases } = await createSessionClient(
        sessionCookie.value
      );

    const { user } = await checkAuth();
    if (!user){
        return {
        error: 'You must be togged in to book a room'
        }
    }

    const checkInDate = formData.get('check_in_date');
    const checkInTime = formData.get('check_in_time');
    const checkOutDate = formData.get('check_out_date');
    const checkOutTime = formData.get('check_out_time');
    const roomId = formData.get('room_id');

    // ISO 8601 format conversion
    const checkInDateTime = `${checkInDate}T${checkInTime}`;
    const checkOutDateTime = `${checkOutDate}T${checkOutTime}`;

    const isAvailable = await checkRoomAvailability(
      roomId,
      checkInDateTime,
      checkOutDateTime
    );

    if (!isAvailable) {
      return {
        error: 'This room is already booked for the selected time',
      };
    }

    const bookingData = {
        check_in : checkInDateTime,
        check_out : checkOutDateTime,
        user_id : user.id,
        room_id: roomId,
    };

    const newBooking = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
        ID.unique(),
        bookingData
    );

    revalidatePath('/bookings', 'layout');
    return {
        success:true
    };
  } catch (error) {
    console.log('Failed to book room', error.message || error);
    // return []; // or  if you want to handle in UI
    return { error: 'Something went wrong booking the room' };
  }
}

export default bookRoom;
