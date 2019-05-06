import React, { Component } from "react";
import { Link } from "react-router-dom";

class PokeTable extends Component {
  render() {
    const { pokemon } = this.props;
    return (
      <React.Fragment>
        {pokemon.map((row, rowNumber) => (
          <div className="card-deck" key={rowNumber}>
            {row.map(pokecell => (
              <div
                className="card text-center shadow bg-white rounded"
                key={pokecell.number}
              >
                <Link to={`/pokemon/${pokecell.number}`}>
                  <img
                    src={pokecell.sprite}
                    alt={pokecell.name}
                    className="rounded mx-auto d-block cartas"
                  />
                  <div className="card-header">
                    {pokecell.number} - {pokecell.name}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ))}
      </React.Fragment>
    );
  }
}

export default PokeTable;
