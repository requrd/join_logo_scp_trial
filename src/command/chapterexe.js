const childProcess = require('child_process');
const { CHAPTEREXE_COMMAND, CHAPTEREXE_OUTPUT } = require("../settings");

exports.exec = filename => {
  return new Promise((resolve, reject) => {
    const args = ["-v", filename, "-s", "8", "-e", "4", "-o", CHAPTEREXE_OUTPUT];
    const child = childProcess.spawn(CHAPTEREXE_COMMAND, args);

    child.on('error', (err) => {
      reject(new Error(`Failed to start chapter_exe: ${err.message}`));
    });

    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`chapter_exe terminated with signal ${signal}`));
      } else if (code !== 0) {
        reject(new Error(`chapter_exe exited with code ${code}`));
      } else {
        resolve();
      }
    });

    child.stderr.on('data', (data) => {
      const strbyline = String(data).split('\n');
      for (const line of strbyline) {
        if (line !== '') {
          if (line.startsWith('Creating')) {
            console.error("AviSynth " + line);
          } else {
            console.error("chapter_exe " + line);
          }
        } else {
          console.error(line);
        }
      }
    });
  });
};
