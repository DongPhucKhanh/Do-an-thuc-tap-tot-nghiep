const mammoth = require("mammoth");
const fs = require("fs");

mammoth.extractRawText({path: "ThucTapTaiTruong.docx"})
    .then(function(result){
        var text = result.value; 
        fs.writeFileSync("ThucTapTaiTruong_raw.txt", text);
        console.log("Extraction complete.");
    })
    .catch(function(err){
        console.log("Error:", err);
    });
