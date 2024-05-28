useEffect(() => {
    const calahisab = () => {
      rooms.forEach((room) => {
        let totalcost = 0;
        let roomGuest = 0;
        let roomFull = 0;
        let roomHalf = 0;
        let electricitybill = 0;
        let khalabill = 0;

        if ([102, 128, 105, 225, 215, 222].includes(room.roomNumber)) {
          electricitybill += 50;
        }

        if (![117, 112, 211, 216].includes(room.roomNumber)) {
          electricitybill += 192;
          khalabill += 210;
        }

        room.roommeal.forEach((meal, index) => {
          if (index === 18) {
            if (meal >= 1) {
              totalcost += meal * 150 + 5 * (meal - 1);
            }
          } else if (index === 9) {
            if (meal >= 1) {
              totalcost += meal * 100;
            } else if (meal === 0.5) {
              totalcost +=
                room.roomNumber === 107 || room.roomNumber === 123 ? 70 : 40;
            }
          } else if (index >= 1 && index <= 16) {
            if (meal % 1 === 0.5) {
              let fullMeals = meal - 0.5;
              totalcost += fullMeals * 65 + (fullMeals - 1) * 5 + 40;
            } else if (meal === 0.5) {
              totalHalfMealsCost += 40;
            } else if (meal >= 1) {
              totalFullMealsCost += meal * 65;
              totalcost += meal * 65 + (meal - 1) * 5;
            }
          } else {
            if (meal % 1 === 0.5) {
              let fullMeals = meal - 0.5;
              totalcost += fullMeals * 70 + (fullMeals - 1) * 5 + 40;
            } else if (meal === 0.5) {
              totalHalfMealsCost += 40;
            } else if (meal >= 1) {
              totalFullMealsCost += meal * 70;
              totalcost += meal * 65 + (meal - 1) * 5;
            }
          }
        });

        totalcost += electricitybill + khalabill;
        room.totalcost = totalcost;
        room.roomGuest = roomGuest;
        room.roomHalf = roomHalf;
        room.roomFull = roomFull;
        room.electricitybill = electricitybill;
        room.khalabill = khalabill;

      });

      
    };