const containerLowerDeck = document.querySelector(".lower-deck");
const containerUpperDeck = document.querySelector(".upper-deck");
const container = document.querySelector(".flex-row-container");
const cartTotalEl = document.querySelector(".cart-total");

const { dataLowerDeck, dataUpperdeck } = loadData();
let cartTotal = parseInt(localStorage.getItem("cartTotal")) || 0;
let selectedIds = JSON.parse(localStorage.getItem("selectedIds")) || [];

function loadData() {
  let dataLowerDeck = JSON.parse(localStorage.getItem("dataLowerDeck"));
  let dataUpperdeck = JSON.parse(localStorage.getItem("dataUpperDeck"));
  if (!dataLowerDeck || !dataUpperdeck) {
    dataLowerDeck = generateData(42, "lower-deck");
    localStorage.setItem("dataLowerDeck", JSON.stringify(dataLowerDeck));
    dataUpperdeck = generateData(42, "upper-deck");
    localStorage.setItem("dataUpperDeck", JSON.stringify(dataUpperdeck));
    return { dataLowerDeck, dataUpperdeck };
  }
  return { dataLowerDeck, dataUpperdeck };
}

function loadSeats(data) {
  const container = document.querySelector(`.${data[0].type}`);
  container.innerHTML = ""; // Clear the container before loading new seats
  data.forEach((seat) => {
    const div = document.createElement("div");
    div.style.width = "50px";
    div.style.height = "50px";
    if (!seat.booked && !seat.reserved) {
      div.className = "available-seat";
      div.title = "Available"; // Set the title attribute for available seats
    } else if (seat.booked && !seat.reserved) {
      div.style.backgroundColor = "red";
      div.title = "Booked"; // Set the title attribute for booked seats
    } else {
      div.style.backgroundColor = "gray";
      div.title = "Reserved"; // Set the title attribute for reserved seats
    }

    div.setAttribute("data-id", seat.id);

    container.appendChild(div);
  });

  updateSelectedSeat();
}

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("available-seat")) {
    const seatId = e.target.getAttribute("data-id");
    // check if it has already been selected then remove it from being selected ids
    if (selectedIds.includes(seatId)) {
      const idx = selectedIds.findIndex((id) => id === seatId); // Corrected findIndex usage
      selectedIds.splice(idx, 1);
      e.target.classList.remove("active");
      localStorage.setItem("selectedIds", JSON.stringify(selectedIds));
    } else {
      selectedIds.push(seatId);
      localStorage.setItem("selectedIds", JSON.stringify(selectedIds));
      updateSelectedSeat();
    }
    updateCart();
  }
});

function updateSelectedSeat() {
  const seats = container.getElementsByClassName("available-seat");
  for (const seat of seats) {
    const seatId = seat.getAttribute("data-id");
    if (selectedIds.includes(seatId)) {
      seat.classList.add("active");
    }
  }
}

function updateCart() {
  const selectedSeatsLowerDeck = selectedIds.map((id) => {
    const idx = dataLowerDeck.findIndex((seat) => seat.id === id);
    return dataLowerDeck[idx];
  });
  const selectedSeatsUpperDeck = selectedIds.map((id) => {
    const idx = dataUpperdeck.findIndex((seat) => seat.id === id);
    return dataUpperdeck[idx];
  });
  cartTotal = [...selectedSeatsLowerDeck, ...selectedSeatsUpperDeck].reduce(
    (acc, curr) => {
      if (curr) {
        return acc + parseInt(curr.price);
      } else {
        return acc; // Always return the accumulator to update it in the next iteration
      }
    },
    0
  );
  console.log(cartTotal);
  localStorage.setItem("cartTotal", cartTotal);
  cartTotalEl.textContent = cartTotal;
}

window.addEventListener("DOMContentLoaded", () => {
  loadSeats(dataLowerDeck);
  loadSeats(dataUpperdeck);
  updateCart();
});
