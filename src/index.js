document.addEventListener("DOMContentLoaded", () => {
  const characterBar = document.getElementById("character-bar");
  const detailedInfo = document.getElementById("detailed-info");
  const nameElement = document.getElementById("name");
  const imageElement = document.getElementById("image");
  const voteCountElement = document.getElementById("vote-count");
  const votesForm = document.getElementById("votes-form");
  const votesInput = document.getElementById("votes");
  const resetButton = document.getElementById("reset-btn");
  const characterForm = document.getElementById("character-form");

  const API_URL = "http://localhost:3000/characters";
  let currentCharacter = null;

  fetch(API_URL)
    .then((response) => response.json())
    .then((characters) => {
      characters.forEach((character) => {
        const span = document.createElement("span");
        span.textContent = character.name;
        span.addEventListener("click", () => displayCharacter(character));
        characterBar.appendChild(span);
      });
    });

  function displayCharacter(character) {
    currentCharacter = character;
    nameElement.textContent = character.name;
    imageElement.src = character.image;
    voteCountElement.textContent = character.votes;
  }

  votesForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (currentCharacter) {
      const newVotes = parseInt(votesInput.value) || 0;
      const updatedVotes = currentCharacter.votes + newVotes;

      fetch(`${API_URL}/${currentCharacter.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ votes: updatedVotes }),
      })
        .then((res) => res.json())
        .then((updatedCharacter) => {
          currentCharacter.votes = updatedCharacter.votes;
          voteCountElement.textContent = updatedCharacter.votes;
          votesInput.value = "";
        });
    }
  });

  resetButton.addEventListener("click", () => {
    if (currentCharacter) {
      fetch(`${API_URL}/${currentCharacter.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ votes: 0 }),
      })
        .then((res) => res.json())
        .then((updatedCharacter) => {
          currentCharacter.votes = updatedCharacter.votes;
          voteCountElement.textContent = updatedCharacter.votes;
        });
    }
  });

  if (characterForm) {
    characterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const newName = document.getElementById("name").value;
      const newImage = document.getElementById("image-url").value;

      if (newName && newImage) {
        const newCharacter = { name: newName, image: newImage, votes: 0 };

        fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCharacter),
        })
          .then((response) => response.json())
          .then((character) => {
            const span = document.createElement("span");
            span.textContent = character.name;
            span.addEventListener("click", () => displayCharacter(character));
            characterBar.appendChild(span);

            displayCharacter(character);
          });

        characterForm.reset();
      }
    });
  }
});
