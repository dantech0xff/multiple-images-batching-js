const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const fs = require('fs');

function getListFiles(dir) {
    console.log('getListFiles ' + dir)
    return fs.readdirSync(dir).map(it => dir + "/" + it)
}

function ensureDirectoryExistence(filePath) {
    if (fs.existsSync(filePath)) {
      return true;
    }
    fs.mkdirSync(filePath);
}

async function batchImages(listImages, outputPath) {
    mergeImages(listImages, {
      Canvas: Canvas,
      Image: Image
    }).then(b64 => {
        fs.writeFileSync(
            outputPath, 
          b64.replace(/^data:image\/png;base64,/, ""), 
          'base64');
          console.log(outputPath)
      });
}

const bgFiles = getListFiles('input/Bg')
const mainFiles = getListFiles('input/Main')
const hudFiles = getListFiles('input/Hud')

async function generateAll(outputFolder) {
    let count = 1
    for(bg in bgFiles) {
        if(!bgFiles[bg].endsWith('.png')) continue;
        for(main in mainFiles) {
            if(!mainFiles[main].endsWith('.png')) continue;
            for(hud in hudFiles) {
                if(!hudFiles[hud].endsWith('.png')) continue;
                ensureDirectoryExistence(outputFolder)
                let fileName = outputFolder + "/#" + count + ".png";
                let listFiles = [bgFiles[bg], mainFiles[main], hudFiles[hud]];
                await batchImages(listFiles, fileName)
                count += 1;
            }
        }
    }
}

console.log(bgFiles)
console.log(mainFiles)
console.log(hudFiles)

generateAll("output")