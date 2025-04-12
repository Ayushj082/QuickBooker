'use server';

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function deleteRoom(roomId) {
    const sessionCookie =  cookies().get('appwrite-session');
    if (!sessionCookie) {
        redirect('/login');
      }
    
  try {
    const { account, databases } = await createSessionClient(
        sessionCookie.value
      );

      const user = await account.get();
      const userId = user.$id;

    // Fetch rooms
    const { documents: rooms } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
      [Query.equal('user_id', userId)]
    );
    const roomToDelete= rooms.find((room)=> room.$id === roomId);
    if (roomToDelete){
        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
            roomToDelete.$id
        );
        revalidatePath('/rooms/my','layout');
        revalidatePath('/','layout');

        return{
            success: true
        };
    }else{
        return{
            error: 'Room not Found'
        }
    }
  } catch (error) {
    console.log('Failed to delete rooms:', error.message || error);
    // return []; // or  if you want to handle in UI
    return { error: 'Failed to delete room' };
  }
}

export default deleteRoom;
