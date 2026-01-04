const path = require('path');
const fs = require('fs-extra');
const ora = require('ora');
const chalk = require('chalk');

async function generateProject(config) {
  const targetDir = path.resolve(process.cwd(), config.projectName);

  // 检查目录是否存在
  if (await fs.pathExists(targetDir)) {
    throw new Error(`Directory "${config.projectName}" already exists`);
  }

  const spinner = ora('Creating project structure...').start();

  try {
    // 创建目标目录
    await fs.ensureDir(targetDir);

    // 复制基础框架文件
    const baseDir = path.resolve(__dirname, '../..');

    // 复制基础文件，排除 create-base-app 目录和 node_modules
    const filesToCopy = await getFilesToCopy(baseDir);

    spinner.text = 'Copying base framework files...';
    for (const file of filesToCopy) {
      const relativePath = path.relative(baseDir, file);
      const targetPath = path.join(targetDir, relativePath);
      await fs.copy(file, targetPath, { overwrite: true });
    }

    // 生成 package.json
    spinner.text = 'Generating package.json...';
    await generatePackageJson(targetDir, config);

    // 生成配置文件
    spinner.text = 'Generating configuration files...';
    await generateConfigFiles(targetDir, config);

    // 根据配置调整项目
    spinner.text = 'Applying project configuration...';
    await applyProjectConfiguration(targetDir, config);

    spinner.succeed('Project structure created successfully!');

    // 显示后续步骤
    printNextSteps(config);

  } catch (error) {
    spinner.fail('Failed to create project');
    throw error;
  }
}

async function getFilesToCopy(baseDir) {
  const files = [];
  const excludeDirs = [
    'node_modules',
    '.next',
    'dist',
    'build',
    'create-base-app',
    '.git',
    'coverage',
    '.turbo'
  ];
  const excludeFiles = [
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local',
    'pnpm-lock.yaml',
    'yarn.lock',
    'package-lock.json'
  ];

  async function walkDir(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);

      // 跳过排除的目录
      if (excludeDirs.some(d => relativePath.split(path.sep).includes(d))) {
        continue;
      }

      // 跳过排除的文件
      if (excludeFiles.includes(entry.name)) {
        continue;
      }

      if (entry.isDirectory()) {
        await walkDir(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  await walkDir(baseDir);
  return files;
}

async function generatePackageJson(targetDir, config) {
  const packageJsonPath = path.join(targetDir, 'package.json');

  let packageJson = {};
  if (await fs.pathExists(packageJsonPath)) {
    packageJson = await fs.readJson(packageJsonPath);
  } else {
    packageJson = {
      name: config.projectName,
      version: '0.1.0',
      private: true,
      scripts: {},
      dependencies: {},
      devDependencies: {}
    };
  }

  // 更新基本信息
  packageJson.name = config.projectName;
  packageJson.description = config.description;
  if (config.author) {
    packageJson.author = config.author;
  }

  // 更新脚本
  const devCommand = config.packageManager === 'npm' ? 'next dev' :
                     config.packageManager === 'yarn' ? 'next dev' :
                     'next dev';

  packageJson.scripts = {
    dev: devCommand,
    build: 'next build',
    start: 'next start',
    lint: 'next lint',
    ...(packageJson.scripts || {})
  };

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

async function generateConfigFiles(targetDir, config) {
  // 生成 .gitignore
  const gitignorePath = path.join(targetDir, '.gitignore');
  const gitignoreContent = `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`;

  if (config.features.includes('git')) {
    await fs.writeFile(gitignorePath, gitignoreContent);
  }

  // 生成 .env.example
  if (config.features.includes('env')) {
    const envExamplePath = path.join(targetDir, '.env.example');
    const envContent = `# Database
# DATABASE_URL=

# Authentication
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=

# API Keys
# API_KEY=

`;
    await fs.writeFile(envExamplePath, envContent);
  }

  // 生成 next.config.js
  const nextConfigPath = path.join(targetDir, 'next.config.js');
  const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ${config.appRouter ? '' : 'experimental: { appDir: false },'}
}

module.exports = nextConfig
`;
  await fs.writeFile(nextConfigPath, nextConfigContent);
}

async function applyProjectConfiguration(targetDir, config) {
  // 根据功能配置调整项目

  // 移除未选择的功能
  const srcDir = path.join(targetDir, 'src');

  // 如果没有选择 i18n，移除相关配置
  if (!config.features.includes('i18n')) {
    const nextConfigPath = path.join(targetDir, 'next.config.js');
    if (await fs.pathExists(nextConfigPath)) {
      let config = await fs.readFile(nextConfigPath, 'utf-8');
      // 移除 i18n 配置（如果存在）
      config = config.replace(/i18n:\s*\{[^}]*\},?\s*/g, '');
      await fs.writeFile(nextConfigPath, config);
    }

    // 移除 i18n 相关文件
    const i18nDirs = [
      path.join(srcDir, 'i18n'),
      path.join(srcDir, 'locales')
    ];

    for (const dir of i18nDirs) {
      if (await fs.pathExists(dir)) {
        await fs.remove(dir);
      }
    }
  }

  // 如果没有选择 testing，移除相关配置和文件
  if (!config.features.includes('testing')) {
    const jestConfigPath = path.join(targetDir, 'jest.config.js');
    if (await fs.pathExists(jestConfigPath)) {
      await fs.remove(jestConfigPath);
    }

    const testDirs = [
      path.join(srcDir, '__tests__'),
      path.join(targetDir, '__tests__')
    ];

    for (const dir of testDirs) {
      if (await fs.pathExists(dir)) {
        await fs.remove(dir);
      }
    }

    // 从 package.json 移除测试相关依赖和脚本
    const packageJsonPath = path.join(targetDir, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);

      if (packageJson.devDependencies) {
        delete packageJson.devDependencies['@testing-library/react'];
        delete packageJson.devDependencies['@testing-library/jest-dom'];
        delete packageJson.devDependencies['jest'];
        delete packageJson.devDependencies['jest-environment-jsdom'];
      }

      if (packageJson.scripts) {
        delete packageJson.scripts.test;
      }

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
  }

  // 如果没有选择 auth，移除相关文件
  if (!config.features.includes('auth')) {
    const authDirs = [
      path.join(srcDir, 'pages/api/auth'),
      path.join(srcDir, 'app/api/auth')
    ];

    for (const dir of authDirs) {
      if (await fs.pathExists(dir)) {
        await fs.remove(dir);
      }
    }
  }

  // 如果没有选择 state，移除 Zustand 相关
  if (!config.features.includes('state')) {
    const storeDirs = [
      path.join(srcDir, 'store'),
      path.join(srcDir, 'stores')
    ];

    for (const dir of storeDirs) {
      if (await fs.pathExists(dir)) {
        await fs.remove(dir);
      }
    }
  }

  // 如果没有选择 linter，移除 ESLint 和 Prettier 配置
  if (!config.features.includes('linter')) {
    const eslintPath = path.join(targetDir, '.eslintrc.json');
    const prettierPath = path.join(targetDir, '.prettierrc');

    if (await fs.pathExists(eslintPath)) {
      await fs.remove(eslintPath);
    }
    if (await fs.pathExists(prettierPath)) {
      await fs.remove(prettierPath);
    }

    // 从 package.json 移除相关依赖
    const packageJsonPath = path.join(targetDir, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJson);

      if (packageJson.devDependencies) {
        delete packageJson.devDependencies['eslint'];
        delete packageJson.devDependencies['eslint-config-next'];
        delete packageJson.devDependencies['prettier'];
      }

      if (packageJson.scripts) {
        delete packageJson.scripts.lint;
      }

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
  }

  // 初始化 Git（如果选择）
  if (config.gitInit && config.features.includes('git')) {
    const { execSync } = require('child_process');
    try {
      execSync('git init', { cwd: targetDir, stdio: 'ignore' });
    } catch (error) {
      // Git 初始化失败，不影响项目创建
    }
  }
}

function printNextSteps(config) {
  console.log();
  console.log(chalk.green.bold('✓ Project created successfully!'));
  console.log();
  console.log(chalk.cyan('Next steps:'));
  console.log();

  const pm = config.packageManager;
  const cdCmd = `cd ${config.projectName}`;
  const installCmd = pm === 'npm' ? 'npm install' :
                     pm === 'yarn' ? 'yarn' :
                     pm === 'pnpm' ? 'pnpm install' : 'npm install';

  console.log(chalk.gray('  1.'), chalk.white(cdCmd));
  console.log(chalk.gray('  2.'), chalk.white(installCmd));
  console.log(chalk.gray('  3.'), chalk.white(`${pm} run dev`));
  console.log();

  console.log(chalk.cyan('To get started:'));
  console.log();
  console.log(chalk.gray('    ' + cdCmd));
  console.log(chalk.gray('    ' + installCmd));
  console.log(chalk.gray('    ' + `${pm} run dev`));
  console.log();

  console.log(chalk.cyan('Documentation:'));
  console.log(chalk.white('  https://nextjs.org/docs'));
  console.log();

  console.log(chalk.gray('─'.repeat(50)));
  console.log();
}

module.exports = { generateProject };
