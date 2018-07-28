import axios from "axios";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    // PROXY URL
    const proxy = "https://thingproxy.freeboard.io/fetch/";
    // API ACCESS KEY
    const key = "32f9e7e11f71ce1bcfac73b51c042b49";
    try {
      // GET DATA
      const result = await axios(
        `${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`
      );
      this.result = result.data.recipes;
    } catch (err) {
      alert(err);
    }
  }
}
