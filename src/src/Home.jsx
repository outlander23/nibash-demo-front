import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [rooms, setRooms] = useState([]);
  const [extras, setExtras] = useState([]);
  const [fullMeals, setFullMeals] = useState([]);
  const [halfMeals, setHalfMeals] = useState([]);

  const [totalGivenTaka, setTotalGivenTaka] = useState(0);
  const [totalCostTillNow, setTotalCostTillNow] = useState(0);

  useEffect(() => {
    // Fetch data using axios
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/meals/table");
        setRooms(response.data);
        const getResponse = await axios.get(
          "http://localhost:3000/meals/extra"
        );
        setExtras(getResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount
  useEffect(() => {
    const calculateMealsAndTotals = () => {
      // Initialize arrays to store meal counts for each date
      const fullMealsArr = Array.from({ length: 31 }, () => 0);
      const halfMealsArr = Array.from({ length: 31 }, () => 0);

      // Initialize total cost and total given taka
      let totalFullMealsCost = 0;
      let totalHalfMealsCost = 0;
      let totalExtraCost = 0;
      let totalGivenTaka = 0;

      // Iterate over rooms data to count meals for each date and calculate total cost and given taka
      rooms.forEach((room) => {
        room.roommeal.forEach((meal, index) => {
          if (meal >= 1) {
            fullMealsArr[index] += meal;
            totalFullMealsCost += 65 * meal; // Assuming full meal cost is 65
          } else if (meal === 0.5) {
            halfMealsArr[index] += 1;
            totalHalfMealsCost += 40; // Assuming half meal cost is 40
          }
        });

        // Calculate total given taka
        totalGivenTaka += room.totalPayment;
      });

      // Calculate total extra cost
      totalExtraCost = extras.reduce((acc, curr) => acc + curr.amount, 0);

      // Update state with calculated values
      setFullMeals(fullMealsArr);
      setHalfMeals(halfMealsArr);
      console.log(totalFullMealsCost, totalHalfMealsCost, totalExtraCost);
      setTotalCostTillNow(
        totalFullMealsCost + totalHalfMealsCost + totalExtraCost
      );
      setTotalGivenTaka(totalGivenTaka);
    };

    calculateMealsAndTotals();
  }, [rooms, extras]);

  // Function to calculate full and half meals for each date
  useEffect(() => {
    const calculateMeals = () => {
      // Initialize arrays to store meal counts for each date
      const fullMealsArr = Array.from({ length: 31 }, () => 0);
      const halfMealsArr = Array.from({ length: 31 }, () => 0);

      // Iterate over rooms data to count meals for each date
      rooms.forEach((room) => {
        room.roommeal.forEach((meal, index) => {
          if (meal >= 1) {
            fullMealsArr[index] += meal;
          } else if (meal === 0.5) {
            halfMealsArr[index] += 1;
          }
        });
      });

      // Update state with calculated meal counts
      setFullMeals(fullMealsArr);
      setHalfMeals(halfMealsArr);
    };

    calculateMeals();
  }, [rooms]);

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
                      {meal === -1 ? "" : meal}
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
          {/* Render row for full and half meals */}
          <tr>
            <td className="border border-green-800 px-4 py-2">Meals</td>
            {fullMeals.map(
              (mealCount, index) =>
                index >= 1 && (
                  <td
                    key={index}
                    className="border border-green-800 px-4 py-2"
                  >{`Full: ${mealCount}, Half: ${halfMeals[index]}`}</td>
                )
            )}
            <td className="border border-green-800 px-4 py-2"></td>
            <td className="border border-green-800 px-4 py-2"></td>
          </tr>
        </tbody>
      </table>
      {/* Render ExtraCostCard components for each extra */}
      <div className="flex flex-wrap">
        {extras.map((extra, index) => (
          <ExtraCostCard
            key={index}
            description={extra.description}
            amount={extra.amount}
            date={extra.date}
          />
        ))}
      </div>

      <p> total cost till now: {totalCostTillNow} </p>
      <p> total given till now: {totalGivenTaka} </p>

      <p>remain: {totalGivenTaka - totalCostTillNow} </p>
    </div>
  );
}

const ExtraCostCard = ({ description, amount, date }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{description}</div>
        <p className="text-gray-700 text-base mb-2">
          Amount: ${amount.toFixed(2)}
        </p>
        <p className="text-gray-700 text-base">
          Date: {new Date(date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Home;
