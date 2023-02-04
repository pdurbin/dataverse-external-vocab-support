async function hello(type) {
  let response = await fetch("funders.json");
  //console.log(response.status); // 200
  //console.log(response.statusText); // OK
  if (response.status === 200) {
    let content = await response.text();
    var div = document.getElementById("mydiv");
    div.innerHTML += "First Results from Funders API\n";
    //let output = this.libFunders.hello(content);
    let output = this.libFunders.getFromLocal(content);
    div.innerHTML += output.split("\n").reverse().join("\n");
  }
}
