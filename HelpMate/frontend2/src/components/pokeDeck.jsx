import React from "react";
import Carousel from "./common/carousel.jsx";
import Footer from "./common/footer";
import { Redirect } from "react-router-dom";
import auth from "../services/authService";

const PokeDeck = () => {
  if (auth.getCurrentUser()) return <Redirect to="/home" />;
  // const cards = [
  //   {
  //     path: "/pokemon",
  //     button: "Pokédex",
  //     description: "Listado de Pokémon",
  //     image: "/img/pikachu.png"
  //   },
  //   {
  //     path: "/trainers",
  //     button: "Entrenadores",
  //     description: "Listado de Entrenadores",
  //     image: "/img/trainer.png"
  //   },
  //   {
  //     path: "/teams",
  //     button: "Equipos",
  //     description: "Listado de Equipos",
  //     image: "/img/teams.png"
  //   }
  // ];

  return (
    <React.Fragment>
      <div>
        <Carousel />
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default PokeDeck;
