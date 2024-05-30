import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [rooms, setRooms] = useState([]);
  const [extras, setExtras] = useState([]);
  const [fullMeals, setFullMeals] = useState([]);
  const [halfMeals, setHalfMeals] = useState([]);

  const [totalGivenTaka, setTotalGivenTaka] = useState(0);
  const [totalCostTillNow, setTotalCostTillNow] = useState(0);

  // State variables to hold input values
  const [amountInput, setAmountInput] = useState(0);
  const [newOwnerNameInput, setNewOwnerNameInput] = useState("");
  const [roomNumber, setRoomNumber] = useState(0);
  const [dateOfChangeMeal, setDateOfChangeMeal] = useState(0);
  const [stateOfMeal, setStateOfMeal] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullMealsForRoom, setFullMealsForRoom] = useState([]);
  const [halfMealsForRoom, setHalfMealsForRoom] = useState([]);
  const [guestMealsForRoom, setguestMealsForRoom] = useState([]);
  const [ache, setAche] = useState(0);
  const [baki, setBaki] = useState(0);
  const currrommnumber = 110;
  useEffect(() => {
    // Fetch data using axios
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/meals/table");
        const sorteddata = response.data.sort(
          (a, b) => a.roomNumber - b.roomNumber
        );
        setRooms(sorteddata);
        const getResponse = await axios.get(
          "http://localhost:3000/meals/extra"
        );
        setExtras(getResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isSubmitting]);

  useEffect(() => {
    const calculateMealsAndTotals = () => {
      const fullMealsArr = Array.from({ length: 32 }, () => 0);
      const halfMealsArr = Array.from({ length: 32 }, () => 0);

      const fullMealsArr1 = Array.from({ length: 32 }, () => 0);
      const halfMealsArr1 = Array.from({ length: 32 }, () => 0);

      let totalFullMealsCost = 0;
      let totalHalfMealsCost = 0;
      let totalExtraCost = 0;
      let totalGivenTaka = 0;
      let achenaki = 0;
      let baki = 0;

      rooms.forEach((room) => {
        let roomGuest = 0;
        let roomfull = 0;
        let roomHalf = 0;

        room.roommeal.forEach((meal, index) => {
          if (meal >= 1) {
            fullMealsArr[index] += meal;
            roomfull += 1;
            roomGuest += meal - 1.0;
            totalFullMealsCost += 65 * meal;
          } else if (meal === 0.5) {
            halfMealsArr[index] += 1;
            totalHalfMealsCost += 40;
            roomHalf += 1;
          }
        });
        room.roomGuest = roomGuest;
        room.roomHalf = roomHalf;
        room.roomfull = roomfull;

        totalGivenTaka += room.totalPayment;
      });

      totalExtraCost = extras.reduce((acc, curr) => acc + curr.amount, 0);

      setFullMeals(fullMealsArr);
      setHalfMeals(halfMealsArr);
      setTotalCostTillNow(
        totalFullMealsCost + totalHalfMealsCost + totalExtraCost
      );
      setTotalGivenTaka(totalGivenTaka);

      rooms.forEach((room) => {
        let totalcost = 0;

        let electricitybill = 0;
        let khalabill = 0;
        let extrasbill = 0;

        if ([102, 128, 105, 225, 215, 222].includes(room.roomNumber)) {
          electricitybill += 50;
        }

        if (![117, 122, 211, 216].includes(room.roomNumber)) {
          electricitybill += 192;
          khalabill += 210;
          extrasbill += 53;
        }

        room.roommeal.forEach((meal, index) => {
          if (meal > 0) {
            if (index === 18) {
              if (meal >= 1) {
                totalcost += meal * 150 + 5 * (meal - 1);
              }
              if (room.roomNumber == 121) console.log("pak", totalcost);
            } else if (index === 9) {
              if (meal >= 1) {
                totalcost += meal * 100;
              } else if (meal === 0.5) {
                totalcost +=
                  room.roomNumber === 107 || room.roomNumber === 123 ? 70 : 40;
              }
            } else if (index >= 1 && index <= 16) {
              if (meal == 0.5) {
                totalcost += 40;
                if (room.roomNumber == 121) console.log(index);
              } else if (meal == 1.5) {
                totalcost += 110;
              } else {
                totalcost += meal * 65 + (meal - 1) * 5;
              }
              if (room.roomNumber == 121) console.log("pak age", totalcost);
            } else if (index >= 17 && index <= 31) {
              if (meal == 0.5) {
                totalcost += 40;
                if (room.roomNumber == currrommnumber) console.log(index);
              } else if (meal == 1.5) {
                totalcost += 115;
              } else {
                totalcost += meal * 70 + (meal - 1) * 5;
              }

              if (room.roomNumber == 121) console.log("pak", index, totalcost);
            }
          }
        });

        room.extrasbill = extrasbill * 1;
        if (room.roomNumber == currrommnumber) console.log("pak", totalcost);
        totalcost += electricitybill + khalabill + extrasbill;
        room.totalcost = totalcost;
        room.electricitybill = electricitybill;
        room.khalabill = khalabill;
        if (room.roomNumber == currrommnumber) console.log("pak", totalcost);
        if (room.totalPayment - totalcost >= 0) {
          achenaki += room.totalPayment - totalcost;
        } else {
          baki += -(room.totalPayment - totalcost);
        }
      });
      setAche(achenaki);
      setBaki(baki);
    };

    calculateMealsAndTotals();
  }, [rooms, extras, isSubmitting]);

  useEffect(() => {
    const calculateMeals = () => {
      const fullMealsArr = Array.from({ length: 32 }, () => 0);
      const halfMealsArr = Array.from({ length: 32 }, () => 0);

      rooms.forEach((room) => {
        room.roommeal.forEach((meal, index) => {
          if (meal >= 1) {
            fullMealsArr[index] += meal;
          } else if (meal === 0.5) {
            halfMealsArr[index] += 1;
          }
        });
      });

      setFullMeals(fullMealsArr);
      setHalfMeals(halfMealsArr);
    };

    calculateMeals();
  }, [rooms]);

  const updateMeal = async (roomNumber, currentDate, state) => {
    try {
      await axios.post("http://localhost:3000/meals/update-room-meal", {
        roomNumber,
        currentDate,
        state,
      });
    } catch (error) {
      console.error("Error updating meal:", error);
    }
    setIsSubmitting(false);
  };

  const addAmount = async (roomNumber, date, amount) => {
    try {
      await axios.post("http://localhost:3000/meals/add-amount", {
        roomNumber,
        date,
        amount,
      });
    } catch (error) {
      console.error("Error adding amount:", error);
    }
    setIsSubmitting(false);
  };

  const generateTodayMeals = async () => {
    try {
      await axios.post("http://localhost:3000/meals/generate-today-meal");
    } catch (error) {
      console.error("Error generating today's meals:", error);
    }
    setIsSubmitting(false);
  };

  const updateRoomOwnerName = async (roomNumber, newOwnerName) => {
    try {
      await axios.put("http://localhost:3000/meals/updateRoomOwnerName", {
        roomNumber,
        newOwnerName,
      });
    } catch (error) {
      console.error("Error updating room owner name:", error);
    }
    setIsSubmitting(false);
  };

  const handleAddAmountSubmit = (event) => {
    setIsSubmitting(true);
    event.preventDefault();
    console.log("add amount", roomNumber, dateOfChangeMeal, amountInput);
    addAmount(roomNumber * 1, dateOfChangeMeal * 1, amountInput * 1);
  };

  const handleUpdateOwnerNameSubmit = (event) => {
    setIsSubmitting(true);
    event.preventDefault();

    // updateRoomOwnerName(roomNumber, newOwnerNameInput);
  };

  const handleUpdateRoomMeal = (event) => {
    setIsSubmitting(true);
    event.preventDefault();
    console.log("meal update", roomNumber, dateOfChangeMeal, stateOfMeal);
    updateMeal(roomNumber * 1, dateOfChangeMeal * 1, stateOfMeal * 1);
  };

  const handleGenerateMeal = (event) => {
    setIsSubmitting(true);
    event.preventDefault();
    generateTodayMeals();
  };

  return (
    <div>
      <div className="container mt-4">
        <div className="flex flex-col md:flex-col justify-center items-center mt-4">
          <div className="flex justify-center items-center mr-4 mb-5">
            <div className="form-group flex flex-row items-center mb-4 mr-2">
              <label
                htmlFor="roomNumberInput"
                className="block text-lg font-medium text-gray-700 mr-2"
              >
                Room Number:
              </label>
              <select
                className="form-control p-2 text-lg"
                id="roomNumberInput"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
              >
                {[...Array(29)].map((_, index) => (
                  <option key={index} value={index + 101}>
                    {index + 101}
                  </option>
                ))}
                {[...Array(29)].map((_, index) => (
                  <option key={index} value={index + 201}>
                    {index + 201}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group flex flex-row items-center mb-4">
              <label htmlFor="dateInput" className="mr-2">
                Date
              </label>
              <select
                className="form-control p-2 text-lg"
                id="dateInput"
                value={dateOfChangeMeal}
                onChange={(e) => setDateOfChangeMeal(e.target.value)}
              >
                {[...Array(31)].map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-fulll h-3 bg-slate-200 " />
          <div className="flex flex-row">
            <form onSubmit={handleAddAmountSubmit} className="mr-4">
              <div className="form-group flex flex-row items-center mb-4">
                <label
                  htmlFor="amountInput"
                  className="block text-lg font-medium text-gray-700 mr-2"
                >
                  Amount:
                </label>
                <input
                  type="number"
                  className="form-control p-2 text-lg"
                  id="amountInput"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className={`btn btn-primary btn-lg btn-rounded ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                } p-2 bg-red-500 rounded-lg mr-4`}
                disabled={isSubmitting}
                onClick={handleAddAmountSubmit}
              >
                {isSubmitting ? "updating..." : "Add Amount"}
              </button>
            </form>

            <form onSubmit={handleUpdateRoomMeal}>
              <div className="form-group flex flex-row items-center mb-4">
                <label htmlFor="newOwnerNameInput" className="mr-2">
                  State
                </label>
                <input
                  type="number"
                  className="form-control p-2 text-lg"
                  id="newOwnerNameInput"
                  value={stateOfMeal}
                  onChange={(e) => setStateOfMeal(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className={`btn btn-primary btn-lg btn-rounded ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                } p-2 bg-green-500 rounded-lg`}
                disabled={isSubmitting}
                onClick={handleUpdateRoomMeal}
              >
                {isSubmitting ? " updating..." : "Update Meal"}
              </button>
            </form>

            <form onSubmit={handleGenerateMeal}>
              <button
                type="submit"
                className={`btn btn-primary btn-lg btn-rounded ml-2 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                } p-2 bg-yellow-500 rounded-lg`}
                disabled={isSubmitting}
                // onClick={handleUpdateRoomMeal}
              >
                {isSubmitting ? "updateing..." : "Generate Meal"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <h2 className="text text-3xl">Room Details</h2>
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
            <th className="border border-green-800 px-4 py-2">Room Number</th>
            <th className="border border-green-800 px-4 py-2">full meal</th>
            <th className="border border-green-800 px-4 py-2">Half meal</th>
            <th className="border border-green-800 px-4 py-2">guest meal</th>
            <th className="border border-green-800 px-4 py-2">
              electricitybill
            </th>
            <th className="border border-green-800 px-4 py-2">khalabill</th>
            <th className="border border-green-800 px-4 py-2">extra</th>
            <th className="border border-green-800 px-4 py-2">totalcost</th>

            <th className="border border-green-800 px-4 py-2">due</th>
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
              <td className="border border-green-800 px-4 py-2">
                {room.roomfull}
              </td>
              <td className="border border-green-800 px-4 py-2">
                {room.roomHalf}
              </td>
              <td className="border border-green-800 px-4 py-2">
                {room.roomGuest}
              </td>
              <td className="border border-green-800 px-4 py-2">
                {room.electricitybill}
              </td>
              <td className="border border-green-800 px-4 py-2">
                {room.khalabill}
              </td>
              <td className="border border-green-800 px-4 py-2">
                {room.extrasbill}
              </td>
              <td className="border border-green-800 px-4 py-2">
                {room.totalcost}
              </td>
              <td className="border border-green-800 px-4 py-2">
                {room.totalPayment - room.totalcost * 1}
              </td>
            </tr>
          ))}
          {/* Render row for full and half meals */}
          <tr>
            <td className="border border-green-800 px-4 py-2">Meals</td>
            {fullMeals.map((mealCount, index) => {
              if (index >= 1) {
                let mealCost;
                if (index >= 1 && index <= 16) {
                  mealCost = mealCount * 65 + halfMeals[index] * 40;
                } else if (index >= 17 && index <= 38) {
                  mealCost = mealCount * 70 + halfMeals[index] * 40;
                } else if (index === 18) {
                  mealCost = mealCount * 150 + halfMeals[index] * 40;
                }

                return (
                  <td key={index} className="border border-green-800 px-4 py-2">
                    {`Full: ${mealCount}, Half: ${halfMeals[index]}, cost: ${mealCost}`}
                  </td>
                );
              }
              return null;
            })}
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
      <p>Ache: {ache}</p>
      <p>Baki: {baki}</p>
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
