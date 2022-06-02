const importedData = require("../../assets/json/colaboradores.json");

export class Colaboradores {
  
  col;

  constructor() {
    this.getJson();
  }

  getJson(){
    this.col = importedData;
    console.log(this.col);
  }
}
