import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch data using axios
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/meals/table");
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount

  return (
    <div>
      <h2>Room Details</h2>

      <table className="border-collapse border border-green-800">
        <thead>
          <tr>
            <th className="border border-green-800 px-4 py-2">Room Number</th>
            {/* Generate date headers for May */}
            {Array.from({ length: 31 }, (_, index) => (
              <th key={index} className="border border-green-800 px-4 py-2">
                {index + 1}
              </th>
            ))}
            <th className="border border-green-800 px-4 py-2">
              Total given taka
            </th>
            <th>Room Number</th>
          </tr>
        </thead>
        <tbody>
          {/* Iterate over each room and render its data */}
          {rooms.map((room, roomIndex) => (
            <tr key={roomIndex}>
              <td className="border border-green-800 px-4 py-2">
                {room.roomNumber}
              </td>
              {/* Render roommeal data for each date */}
              {room.roommeal.map(
                (meal, index) =>
                  index !== 0 && (
                    <td
                      key={index}
                      className="border border-green-800 px-4 py-2"
                    >
                      {meal == -1 ? "" : meal}
                    </td>
                  )
              )}
              <td className="border border-green-800 px-4 py-2">
                {room.totalPayment}
              </td>

              <td className="border border-green-800 px-4 py-2">
                {room.roomNumber}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
