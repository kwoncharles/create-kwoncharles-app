import chalk from 'chalk';

export function logInstallingDeps(displayedCommand: 'yarn' | 'npm',  ...deps: string[]) {
  const logs = deps.map(dep => chalk.cyan(dep));
  let str = '';

  if (logs.length > 1) {
    let last = logs.splice(logs.length - 1);
    str = `Installing ${logs.join(', ')} and ${last} using ${displayedCommand}...`
  } else {
    str = `Installing ${logs.join(', ')} using ${displayedCommand}...`
  }

  console.log(
    '\n',
    str,
    '\n',
  )
}
