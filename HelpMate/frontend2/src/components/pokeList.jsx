import React, { Component } from "react";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import PokeTable from "./pokeTable";
import typesService from "../services/typeService";
import pokemonService from "../services/pokemonService";
import _ from "lodash";

class PokeList extends Component {
  state = {
    pokemon: [],
    types: [],
    currentPage: 1,
    pageSize: 20,
    columns: 4,
    searchQuery: "",
    selectedType: null,
    sortColumn: { path: "number", order: "asc" },
    totalCount: null
  };

  async populatePokemon(currentPage = 1, selectedType = null) {
    let newTotalCount = undefined;
    if (
      this.state.totalCount === null ||
      selectedType !== this.state.selectedType
    ) {
      const { data } = await pokemonService.getPokemonCount(
        selectedType ? selectedType._id : null
      );
      newTotalCount = data.totalCount;
    }

    let { data: pokemon } = await pokemonService.getPokemon(
      selectedType ? selectedType._id : null,
      currentPage
    );
    pokemon = _.chunk(pokemon, this.state.columns);
    this.setState({
      pokemon,
      currentPage,
      selectedType,
      totalCount: newTotalCount || this.state.totalCount
    });
  }

  async componentDidMount() {
    let { data: types } = await typesService.getTypes();
    types = types.sort();
    types = types.map(type => ({ _id: type, name: _.capitalize(type) }));
    types = [{ _id: "", name: "All types" }, ...types];

    this.setState({ types });
    await this.populatePokemon();
  }

  handleTypeSelect = async type => {
    await this.populatePokemon(1, type);
  };

  handlePageChange = async page => {
    await this.populatePokemon(page, this.state.selectedType);
  };

  render() {
    const {
      types,
      pokemon,
      selectedType,
      totalCount,
      pageSize,
      currentPage
    } = this.state;

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={types}
            selectedItem={selectedType}
            onItemSelect={this.handleTypeSelect}
          />
        </div>
        <div className="col">
          <PokeTable pokemon={pokemon} />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default PokeList;
