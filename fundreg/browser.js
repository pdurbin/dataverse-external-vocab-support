async function fetchText(type) {
  let response = await fetch('funders.json');
  //console.log(response.status); // 200
  //console.log(response.statusText); // OK
  if (response.status === 200) {
    console.log("200 ok");
    let content = await response.text();
    //console.log(content);
    if (type == 'byYear') {
      console.log("in if");
      var div = document.getElementById('yearid');
      div.innerHTML += 'Funders\n';
      //let output = this.asciiLib.getByYear(content);
      //let output = this.asciiLib.getFromLocal(content);
      let output = this.libFunders.getFromLocal(content);
      //let output = this.asciiLib.query('nih');
      console.log("output: " + output);
      div.innerHTML += "<pre>" + output + "</pre>";
      //div.innerHTML += output.split('\n').reverse().join('\n');
    } else {
      console.log("in else");
      var div = document.getElementById('ratingid');
      div.innerHTML += 'FIXME\n';
      let output = this.asciiLib.getByRating(content);
      div.innerHTML += output
        .split('\n')
        .reverse()
        .join('\n');
    }
  }
}
