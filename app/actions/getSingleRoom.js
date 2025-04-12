'use server';

import { createAdminClient } from '@/config/appwrite';

async function getSingleRoom(id) {
  try {
    const { databases } = await createAdminClient();

    // Fetch room
    const room = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
      id
    );

    return room;
  } catch (error) {
    console.log('Failed to get room:', error.message || error);
    return null; // Or handle this case in your component
  }
}

export default getSingleRoom;
