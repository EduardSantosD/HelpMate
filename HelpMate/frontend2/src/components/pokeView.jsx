import React, { Component } from "react";
import pokeService from "../services/pokemonService";
import _ from "lodash";

class PokeView extends Component {
  state = {
    data: {
      number: "",
      name: "",
      types: [],
      height: "",
      weight: "",
      sprite: ""
    }
  };

  async componentDidMount() {
    try {
      const { data } = await pokeService.getPokemonByNumber(
        this.props.match.params.number
      );
      this.setState({ data });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }

  render() {
    const { data } = this.state;
    return (
      <div
        className="card mx-auto d-block shadow bg-white rounded"
        style={{ width: "18rem" }}
      >
        <img src={data.sprite} alt={data.name} className="card-img-top" />
        <div className="card-header text-center">
          <h3 className="card-title">
            {data.number} - {data.name}
          </h3>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Height: {data.height}</li>
          <li className="list-group-item">Weight: {data.weight}</li>
          <li className="list-group-item">Types: {_.join(data.types, ", ")}</li>
        </ul>
      </div>
    );
  }
}

export default PokeView;
