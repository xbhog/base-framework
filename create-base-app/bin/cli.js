#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const { generateProject } = require('../utils/generator');

program
  .version('1.0.0')
  .argument('[project-name]', 'Name of the project')
  .description('Create a new Next.js project with base-framework template')
  .action(async (projectName) => {
    console.log();
    console.log(chalk.cyan.bold('┌─────────────────────────────────────┐'));
    console.log(chalk.cyan.bold('│     Create Base App CLI Tool       │'));
    console.log(chalk.cyan.bold('│     Next.js + Base Framework       │'));
    console.log(chalk.cyan.bold('└─────────────────────────────────────┘'));
    console.log();

    // 如果没有提供项目名称，询问用户
    if (!projectName) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'What is your project name?',
          default: 'my-base-app',
          validate: input => {
            if (!input || input.trim() === '') {
              return 'Project name is required';
            }
            if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
              return 'Project name can only contain letters, numbers, hyphens, and underscores';
            }
            return true;
          }
        }
      ]);
      projectName = answers.projectName;
    }

    // 询问用户所有配置选项
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'typescript',
        message: 'Would you like to use TypeScript?',
        choices: ['Yes', 'No'],
        default: 'Yes'
      },
      {
        type: 'list',
        name: 'styling',
        message: 'Which styling solution would you like to use?',
        choices: [
          { name: 'Tailwind CSS', value: 'tailwind' },
          { name: 'CSS Modules', value: 'css-modules' },
          { name: 'Styled Components', value: 'styled-components' },
          { name: 'Plain CSS', value: 'css' }
        ],
        default: 'tailwind'
      },
      {
        type: 'list',
        name: 'appRouter',
        message: 'Use Next.js App Router (app directory) or Pages Router (pages directory)?',
        choices: [
          { name: 'App Router (Recommended)', value: true },
          { name: 'Pages Router', value: false }
        ],
        default: true
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Which features would you like to include?',
        choices: [
          { name: 'Authentication (NextAuth.js)', value: 'auth', checked: false },
          { name: 'API Routes', value: 'api', checked: true },
          { name: 'Environment Variables (.env.example)', value: 'env', checked: true },
          { name: 'ESLint + Prettier', value: 'linter', checked: true },
          { name: 'Git Repository (.git)', value: 'git', checked: true },
          { name: 'i18n Support', value: 'i18n', checked: false },
          { name: 'State Management (Zustand)', value: 'state', checked: false },
          { name: 'Testing (Jest + React Testing Library)', value: 'testing', checked: false }
        ]
      },
      {
        type: 'list',
        name: 'packageManager',
        message: 'Which package manager would you like to use?',
        choices: [
          { name: 'npm', value: 'npm' },
          { name: 'yarn', value: 'yarn' },
          { name: 'pnpm', value: 'pnpm' }
        ],
        default: 'npm'
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author name:',
        default: ''
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        default: 'A Next.js project with base-framework'
      },
      {
        type: 'confirm',
        name: 'gitInit',
        message: 'Initialize a new git repository?',
        default: true
      }
    ]);

    const config = {
      projectName,
      typescript: answers.typescript === 'Yes',
      styling: answers.styling,
      appRouter: answers.appRouter,
      features: answers.features,
      packageManager: answers.packageManager,
      author: answers.author,
      description: answers.description,
      gitInit: answers.gitInit
    };

    // 显示配置摘要
    console.log();
    console.log(chalk.yellow('Configuration Summary:'));
    console.log(chalk.gray('─'.repeat(40)));
    console.log(chalk.white(`  Project Name:    ${chalk.cyan(projectName)}`));
    console.log(chalk.white(`  TypeScript:      ${chalk.cyan(config.typescript)}`));
    console.log(chalk.white(`  Styling:         ${chalk.cyan(config.styling)}`));
    console.log(chalk.white(`  Router:          ${chalk.cyan(config.appRouter ? 'App Router' : 'Pages Router')}`));
    console.log(chalk.white(`  Features:        ${chalk.cyan(config.features.length > 0 ? config.features.join(', ') : 'None')}`));
    console.log(chalk.white(`  Package Manager: ${chalk.cyan(config.packageManager)}`));
    console.log(chalk.gray('─'.repeat(40)));
    console.log();

    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Proceed with this configuration?',
        default: true
      }
    ]);

    if (!confirm.proceed) {
      console.log(chalk.yellow('Operation cancelled.'));
      process.exit(0);
    }

    // 生成项目
    try {
      await generateProject(config);
    } catch (error) {
      console.error(chalk.red('Error generating project:'), error.message);
      process.exit(1);
    }
  });

program.parse();
