import React, { useEffect, useState } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/toys")
      .then((response) => response.json())
      .then(setToys);
  }, []);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  function handleAddToy(toy) {
    fetch("http://localhost:3001/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...toy, likes: toy.likes ?? 0 }),
    })
      .then((response) => response.json())
      .then((savedToy) => {
        setToys((toys) => [...toys, { ...savedToy, likes: savedToy.likes ?? 0 }]);
      });
  }

  function handleDeleteToy(id) {
    fetch(`http://localhost:3001/toys/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        setToys((toys) => toys.filter((toy) => toy.id !== id));
      }
    });
  }

  function handleLikeToy(toy) {
    const updatedLikes = toy.likes + 1;

    fetch(`http://localhost:3001/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: updatedLikes }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        setToys((toys) =>
          toys.map((currentToy) =>
            currentToy.id === updatedToy.id
              ? { ...currentToy, likes: updatedToy.likes ?? updatedLikes }
              : currentToy
          )
        );
      });
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onToySubmit={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer toys={toys} onDeleteToy={handleDeleteToy} onLikeToy={handleLikeToy} />
    </>
  );
}

export default App;
