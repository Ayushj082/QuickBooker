'use server';

import { createAdminClient } from '@/config/appwrite';

async function getAllRooms() {
  try {
    const { databases } = await createAdminClient();

    // Fetch rooms
    const { documents: rooms } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS
    );

    return rooms;
  } catch (error) {
    console.log('Failed to get rooms:', error.message || error);
    // return []; // or  if you want to handle in UI
    return { error: true };
  }
}

export default getAllRooms;
