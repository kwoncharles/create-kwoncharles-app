#!/usr/bin/env node
import path from 'path';
import Commander from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import { validateNpmName } from './helper/validate-pkg';
import packageJson from '../package.json';
import { createApp } from './create-app';
import { confirmEslintPropmpts, confirmTailwindPropmpts } from './helper/prompts-utils';

let projectPath: string = '';

const program = new Commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action((name) => {
    projectPath = name;
  })
  .option('--use-npm', 'use npm instead of yarn.')
  .option('--eslint', 'use eslint')
  .option('--tw --tailwind', 'use tailwindcss')
  .allowUnknownOption()
  .parse(process.argv);

async function run(): Promise<void> {
  let {
    useNpm,
    eslint: useEslint,
    tailwind: useTailwind,
  } = program.opts();

  if (typeof projectPath === 'string') {
    projectPath = projectPath.trim()
  }

  if (!projectPath) {
    const res = await prompts({
      type: 'text',
      name: 'path',
      message: '프로젝트 이름을 알려주세요.',
      initial: 'my-app',
      validate: (name) => {
        const validation = validateNpmName(name)
  
        if (validation.valid) {
          return true;
        }
        return '해당 이름을 사용할 수 없습니다: ' + validation.problems![0];
      },
    });
  
    if (typeof res.path === 'string') {
      projectPath = res.path.trim();
    }
  }

  if (!useEslint || !useTailwind) {
    const confirmPrompts: prompts.PromptObject[] = [];
    !useTailwind && confirmPrompts.push(confirmTailwindPropmpts);
    !useEslint && confirmPrompts.push(confirmEslintPropmpts);

    const { confirmUseTailwind, confirmUseEslint } = await prompts(confirmPrompts);

    useTailwind = useTailwind || confirmUseTailwind;
    useEslint = useEslint || confirmUseEslint;
  }

  const resolvedProjectPath = path.resolve(projectPath);
  const projectName = path.basename(resolvedProjectPath);

  const validation = validateNpmName(projectName);
  if (!validation.valid) {
    console.error(
      '\n'
      + `${chalk.red(
        `"${projectName}"`
      )}는 프로젝트 이름으로 사용할 수 없습니다.`
      + '\n'
      + '이유는 다음과 같습니다: '
      + chalk.redBright(validation.problems![0])
    );
    process.exit(1)
  }

  try {
    await createApp({
      useNpm,
      useEslint,
      useTailwind,
      appPath: resolvedProjectPath,
    })
  } catch (reason) {
    throw reason;
  }
}

run()
  .then(() => {
    process.exit();
  })
  .catch(async (reason) => {
    console.log();
    console.log('프로젝트 설치 실패.')
    if (reason.command) {
      console.log(`  ${chalk.cyan(reason.command)} 명령어를 수행하던 중 오류가 발생했습니다.`);
    } else {
      console.log(chalk.red('예상치 못한 오류가 발생했습니다. 이슈를 올려주시면 빠르게 처리해보겠습니다:'))
      console.log(reason)
    }
    console.log();

    process.exit(1);
  });
