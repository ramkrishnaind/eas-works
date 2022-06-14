// file system module to perform file operations
const fs = require("fs");
const d = 0,
  i = 0,
  s = 0,
  c = 0;
let jsonData = "[";
// json dat
for (let dVal = 0; dVal < 28; dVal++) {
  for (let iVal = 0; iVal < 28; iVal++) {
    for (let sVal = 0; sVal < 28; sVal++) {
      for (let cVal = 0; cVal < 28; cVal++) {
        jsonData += `{
                    "keyD": ${dVal},
                    "keyI": ${iVal},
                    "keyS": ${sVal},
                    "keyC": ${cVal},
                    "text": "${dVal}${iVal}${sVal}${cVal}Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into the years, sometimes by accident, sometimes on purpose (injected humour and the like).${dVal}${iVal}${sVal}${cVal}"
                  }`;
        if (!(dVal == 27 && iVal == 27 && sVal == 27 && cVal == 27))
          jsonData += ",";
        else jsonData += "]";
      }
    }
  }
}

// parse json
var jsonObj = JSON.parse(jsonData);
console.log(jsonObj);

// stringify JSON Object
var jsonContent = JSON.stringify(jsonObj);
// console.log(jsonContent);

fs.writeFile("output.json", jsonContent, "utf8", function (err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.");
    return console.log(err);
  }

  console.log("JSON file has been saved.");
});
