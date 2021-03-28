import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

export function isFolderEmpty(root: string, name: string): boolean {
  const validFiles = [
    '.DS_Store',
    '.git',
    '.gitattributes',
    '.gitignore',
    '.gitlab-ci.yml',
    '.hg',
    '.hgcheck',
    '.hgignore',
    '.idea',
    '.npmignore',
    '.travis.yml',
    'LICENSE',
    'Thumbs.db',
    'docs',
    'mkdocs.yml',
    'npm-debug.log',
    'yarn-debug.log',
    'yarn-error.log',
  ];
  const conflicts = fs
    .readdirSync(root)
    .filter((file) => !validFiles.includes(file))
    // Support IntelliJ IDEA-base editors
    .filter((file) => !/\.iml$/.test(file));

  if (conflicts.length > 0) {
    console.log(
      `${chalk.green(name)} 폴더 내에 충돌될 수 있는 파일이 존재합니다:`,
      '\n',
    );
    for (const file of conflicts) {
      try {
        const stats = fs.lstatSync(path.join(root, file))
        if (stats.isDirectory()) {
          console.log(`   ${chalk.blue(file)}/`);
        } else {
          console.log(`   ${file}`);
        }
      } catch {
        console.log(`   ${file}`);
      }
    }

    console.log(
      '\n',
      '새로운 폴더명을 입력하거나 위 파일을 제거해주세요.',
      '\n',
    );

    return false;
  }
  return true;
}
