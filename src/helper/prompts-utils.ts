import { PromptObject } from 'prompts';

export const confirmTailwindPropmpts: PromptObject<'confirmUseTailwind'> = {
  type: 'confirm',
  name: 'confirmUseTailwind',
  message: 'tailwindcss 옵션을 추가하지 않았습니다. 추가해드릴까요?',
  initial: false,
};

export const confirmEslintPropmpts: PromptObject<'confirmUseEslint'> = {
  type: 'confirm',
  name: 'confirmUseEslint',
  message: 'eslint 옵션을 추가하지 않았습니다. 추가해드릴까요?',
  initial: false,
};
