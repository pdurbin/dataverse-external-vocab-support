let fs = require("fs");
const utilities = require("./libFunders");
const myArgs = process.argv.slice(2);
switch (myArgs[0]) {
  case "hello":
    var output = utilities.hello();
    console.log(output);
    break;
  case "q":
    const q = process.argv.slice(3);
    utilities.query(q);
    break;
  default:
    let filename = "funders.json";
    let content = fs.readFileSync(process.cwd() + "/" + filename).toString();
    utilities.getFromLocal(content);
}
