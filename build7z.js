const fs = require("fs");
const _7zip = require("7zip-bin");
const packageJson = require("./package.json");
const { execSync } = require("child_process");
const { argv } = require("process");

/**
 * @param {string} arg
 */
function main(arg) {
  if (arg.length > 1) {
    for (const i of arg) {
      main(i);
    }
    return;
  }
  switch (arg) {
    case "w":
      console.log("Windows 7z");
      var oldDirName = "win";
      var newDirName = `windows`;
      break;
    case "l":
      console.log("Linux 7z");
      var oldDirName = "linux";
      var newDirName = `linux`;
      break;
    default:
      return;
  }
  oldDirName = `./dist/${oldDirName}-unpacked/`;
  newDirName = `./dist/${packageJson.name}-${newDirName}-${packageJson.version}`;
  const name = newDirName + `.7z`;
  newDirName += "/";
  if (fs.existsSync(oldDirName)) {
    if (fs.existsSync(newDirName))
      fs.rmdirSync(newDirName, { recursive: true });
    fs.renameSync(oldDirName, newDirName);
  }
  if (fs.existsSync(name)) fs.rmSync(name);
  execSync(
    `"${_7zip.path7za}" a -t7z -m0=lzma -mx=9 -mmt4 -r "${name}" "${newDirName}"`
  );
  fs.renameSync(newDirName, oldDirName);
  console.log("ok");
}

main(argv[2]);
