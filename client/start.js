const path = require('path');
const { spawn } = require('child_process');

const reactScriptsPath = path.resolve(__dirname, '..', 'node_modules', '.bin', 'react-scripts');
const args = ['start'];
const options = {
  cwd: __dirname,
  stdio: 'inherit',
};

const child = spawn(reactScriptsPath, args, options);
child.on('exit', (code) => process.exit(code));
