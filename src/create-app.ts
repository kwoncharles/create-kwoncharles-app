import fs from 'fs';
import cpy from 'cpy'
import os from 'os';
import chalk from 'chalk';
import path from 'path';
import { isFolderEmpty } from './helper/is-folder-empty';
import { getOnline } from './helper/is-online';
import { isWriteable } from './helper/is-writeable';
import { makeDir } from './helper/make-dir';
import { shouldUseYarn } from './helper/should-use-yarn';
import { install } from './helper/install';
import { tryGitInit } from './helper/git';
import { logInstallingDeps } from './helper/logger';

const LINT_CMD = 'lint' as const;

export async function createApp({
  appPath,
  useNpm,
  useEslint,
  useTailwind,
}: {
  appPath: string;
  useNpm: boolean;
  useEslint?: boolean;
  useTailwind?: boolean;
}): Promise<void> {
  const root = path.resolve(appPath);

  if (!(await isWriteable(path.dirname(root)))) {
    console.error(
      'The application path is not writable, please check folder permissions and try again.'
    )
    console.error(
      'It is likely you do not have write permissions for this folder.'
    )
    process.exit(1)
  }

  const appName = path.basename(root);
  await makeDir(root);
  if (!isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  const useYarn = useNpm ? false : shouldUseYarn();
  const isOnline = !useYarn || (await getOnline());
  const originalDir = process.cwd();

  const displayedCommand = useYarn ? 'yarn' : 'npm';
  console.log(
    '새로운 애플리케이션을 아래 경로에 생성합니다!',
    '\n',
    chalk.green(root),
    '\n',
  );

  await makeDir(root);
  process.chdir(root);

  const packageJson: any = {
    name: appName,
    version: '0.1.0',
    private: true,
    scripts: { dev: 'next dev', build: 'next build', start: 'next start' },
    engines: { node: '>=10.13.0' },
  };

  if (useEslint) {
    packageJson.scripts[LINT_CMD] = 'eslint . --ext .js,.jsx,.ts,.tsx';
    packageJson.husky = {
      hooks: {
        'pre-commit': 'lint-staged',
      }
    };
    packageJson['lint-staged'] = {
      '*.{ts,tsx}': [
        'eslint',
      ],
    };
  }

  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL,
  );

  const deps = ['react', 'react-dom', 'next'];
  logInstallingDeps(displayedCommand, ...deps);

  await install(
    root,
    deps,
    { useYarn, isOnline },
  );

  let devDeps = ['@babel/core', '@types/react', '@types/react-dom', '@types/node','typescript'];

  if (useTailwind) {
    devDeps = [
      ...devDeps,
      ...tailwindRelatedDeps,
    ];
  }

  if (useEslint) {
    devDeps = [
      ...devDeps,
      ...lintRelatedDeps,
    ];
  }

  logInstallingDeps(displayedCommand, ...devDeps);
  await install(
    root,
    devDeps,
    { useYarn, isOnline, isDevDeps: true },
  );

  console.log();
  
  // 기본 탬플릿 copy
  await cpy('**', root, {
    parents: true,
    cwd: path.join(__dirname, 'templates', 'default'),
    rename(name) {
      switch (name) {
        case 'gitignore': {
          return '.'.concat(name);
        }
        case 'babelrc': {
          return '.'.concat(name);
        }
        case 'README-template.md': {
          return 'README.md';
        }
        default: {
          return name;
        }
      }
    },
  });

  // eslint 관련 탬플릿 copy
  if (useEslint) {
    await cpy('.eslintrc.template.js', root, {
      parents: true,
      cwd: path.join(__dirname, 'templates'),
      rename(name) {
        switch (name) {
          case '.eslintrc.template.js': {
            return '.eslintrc.js';
          }
          default: {
            return name;
          }
        }
      },
    });
  }

  // tailwind 관련 탬플릿 copy
  if (useTailwind) {
    await cpy('**', root, {
      parents: true,
      cwd: path.join(__dirname, 'templates', 'tailwindcss', 'config'),
      rename(name) {
        switch (name) {
          case 'tailwind.config.template.js': {
            return 'tailwind.config.js';
          }
          case 'postcss.config.template.js': {
            return 'postcss.config.js';
          }
          default: {
            return name;
          }
        }
      },
    });

    await cpy('global.css', path.join(root, 'src', 'screen', 'shared', 'styles'), {
      parents: true,
      cwd: path.join(__dirname, 'templates', 'tailwindcss'),
    });
  }

  if (tryGitInit(root)) {
    console.log(
      'git repository 설정 완료',
      '\n',
    );
  }

  let cdpath: string;
  if (path.join(originalDir, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  console.log(
    `${chalk.green('Success!')} ${appPath} 경로에 "${appName}" 프로젝트가 생성되었습니다.`,
    '\n',
    '디렉토리 내부에서 다음 명령어들을 바로 사용할 수 있습니다:',
    '\n',
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}dev`),
    '\n',
    '    개발 모드 실행.',
    '\n',
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`),
    '\n',
    '    프로덕션 앱 빌드.',
    '\n',
    chalk.cyan(`  ${displayedCommand} start`),
    '\n',
    '    빌드된 프로덕션 앱 실행.',
    '\n',
    '\n',
    '다음 명령어로 개발 모드를 실행해보세요!',
    '\n',
    `${chalk.cyan('   cd')} ${cdpath}`,
    '\n',
    `${chalk.cyan(`   ${displayedCommand} ${useYarn ? '' : 'run '}dev`)}`,
    '\n',
  );
}


const tailwindRelatedDeps = [
  'autoprefixer',
  'postcss',
  'postcss-custom-properties',
  'postcss-flexbugs-fixes',
  'postcss-nested',
  'tailwindcss',
];

const lintRelatedDeps = [
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'eslint',
  'eslint-config-airbnb-typescript',
  'eslint-plugin-import',
  'eslint-plugin-jsx-a11y',
  'eslint-plugin-react',
  'eslint-plugin-react-hooks',
  'husky@4.3.8',
  'lint-staged',
];
