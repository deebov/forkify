import axios from "axios";
import { key, proxy } from "./config";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      // GET DATA
      const result = await axios(
        `${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`
      );
      this.result = result.data.recipes;
    } catch (err) {
      console.log(err);
      alert("Something went wrong :(");
    }
  }
}
