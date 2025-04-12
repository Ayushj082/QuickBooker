
import RoomCard from '@/components/RoomCard';
import Heading from '@/components/Heading';
import getAllRooms from './actions/getAllRooms';

export default async function Home() {
  let rooms = [];
  try {
    rooms = await getAllRooms();
  } catch (error) {
    console.error('Error fetching rooms:', error);
    rooms = [];
  }

  return (
    <>
      <Heading title="Available Rooms" />
      {rooms?.length > 0 ? (
        rooms.map((room) => <RoomCard room={room} key={room.$id} />)
      ) : (
        <p>No rooms available at the moment</p>
      )}
    </>
  );
}
