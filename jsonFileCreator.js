// file system module to perform file operations
const fs = require("fs");
fs.writeFile("output.json", "[", "utf8", function (err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.");
    return console.log(err);
  }

  console.log("JSON file has been saved.");
});
let jsonData = "";
// json dat
for (let dValM = 0; dValM < 28; dValM++) {
  for (let iValM = 0; iValM < 28; iValM++) {
    for (let sValM = 0; sValM < 28; sValM++) {
      for (let cValM = 0; cValM < 28; cValM++) {
        // for (let dValL = 0; dValL < 28; dValL++) {
        //   for (let iValL = 0; iValL < 28; iValL++) {
        //     for (let sValL = 0; sValL < 28; sValL++) {
        //       for (let cValL = 0; cValL < 28; cValL++) {
        jsonData += `{
                    
                    "keyD_M": ${dValM},
                    "keyI_M": ${iValM},
                    "keyS_M": ${sValM},
                    "keyC_M": ${cValM}L
                    "text": "${dValM}${iValM}${sValM}${cValM}Lorem Ipsum.${dValM}${iValM}${sValM}${cValM}"
                  }`;
        if (
          !(
            (dValM == 27 && iValM == 27 && sValM == 27 && cValM == 27)
            // (dValL == 27 && iValL == 27 && sValL == 27 && cValL == 27)
          )
        )
          jsonData += ",";
        else jsonData += "]";

        // jsonData = "";
      }
    }
  }
}
//       }
//     }
//   }
// }
fs.appendFile("output.json", jsonData, "utf8", function (err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.");
    return console.log(err);
  }

  console.log("JSON file has been saved.");
});
// fs.appendFile("output.json", "]", "utf8", function (err) {
//   if (err) {
//     console.log("An error occured while writing JSON Object to File.");
//     return console.log(err);
//   }

//   console.log("JSON file has been saved.");
// });
// parse json
// var jsonObj = JSON.parse(jsonData);
// console.log(jsonObj);

// // stringify JSON Object
// var jsonContent = JSON.stringify(jsonObj);
// console.log(jsonContent);

// fs.writeFile("output.json", "[", "utf8", function (err) {
//   if (err) {
//     console.log("An error occured while writing JSON Object to File.");
//     return console.log(err);
//   }

//   console.log("JSON file has been saved.");
// });
