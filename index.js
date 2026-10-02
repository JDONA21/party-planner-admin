// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2608-Jesus"; // Make sure to change this!
const API = BASE + COHORT;

// === State ===
let parties = [];
let selectedParty = [];
let rsvps = [];
let guests = [];

/** Updates state with all puppies from the API */
async function getParties() {
  try {
    const response = await fetch(API + "/events");
    const result = await response.json();
    puppies = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with a single puppy from the API */
async function getParty(id) {
  try {
    const response = await fetch(API + "/events/" + id);
    const result = await response.json();
    selectedParty = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with all RSVPs from the API */
async function getRsvps() {
  try {
    const response = await fetch(API + "/rsvps");
    const result = await response.json();
    rsvps = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with all guests from the API */
async function getGuests() {
  try {
    const response = await fetch(API + "/guests");
    const result = await response.json();
    guests = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}
async function addParty(puppy) {
  try {
    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(puppy),
    });
    const result = await response.json();

    if (!response.ok) {
      throw result.error;
    }
  } catch (error) {
    console.error(error);
  }
}

async function removeParty(id) {
  try {
    await fetch(API + "/" + id, {
      method: "DELETE",
    });
    selectedParty = undefined;
    await getParty();
  } catch (e) {
    console.error(e);
  }
}
// === Components ===

/** Puppy name that shows more details about the puppy when clicked */
function PartyListItem(puppy) {
  const $li = document.createElement("li");

  if (puppy.id === selectedParty?.id) {
    $li.classList.add("selected");
  }

  $li.innerHTML = `
    <a href="#selected">${puppy.name}</a>
  `;
  $li.addEventListener("click", () => getParty(puppy.id));
  return $li;
}

/** A list of names of all puppies */
function PartyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("puppies");

  const $puppies = puppies.map(PartyListItem);
  $ul.replaceChildren(...$puppies);

  return $ul;
}

/** Detailed information about the selected puppy */
function SelectedParty() {
  if (!selectedParty) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a puppy to learn more.";
    return $p;
  }

  const $puppy = document.createElement("section");
  $puppy.innerHTML = `
    <h3>${selectedParty.name} #${selectedParty.id}</h3>
    <time datetime="${selectedParty.date}">
      ${selectedParty.date.slice(0, 10)}
    </time>
    <address>${selectedParty.location}</address>
    <p>${selectedParty.description}</p>
    <GuestList></GuestList>
  `;
  $puppy.querySelector("GuestList").replaceWith(GuestList());

  return $puppy;
}

/** List of guests attending the selected puppy */
function GuestList() {
  const $ul = document.createElement("ul");
  const guestsAtParty = guests.filter((guest) =>
    rsvps.find(
      (rsvp) => rsvp.guestId === guest.id && rsvp.eventId === selectedParty.id,
    ),
  );

  // Simple components can also be created anonymously:
  const $guests = guestsAtParty.map((guest) => {
    const $guest = document.createElement("li");
    $guest.textContent = guest.name;
    return $guest;
  });
  $ul.replaceChildren(...$guests);

  return $ul;
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Puppy Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <PartyList></PartyList>
      </section>
      <section id="selected">
        <h2>Puppy Details</h2>
        <SelectedParty></SelectedParty>
      </section>
    </main>
  `;

  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("SelectedParty").replaceWith(SelectedParty());
}

async function init() {
  await getParties();
  await getRsvps();
  await getGuests();
  render();
}

init();
