#!/usr/bin/env node

const program = require("commander");
const inquirer = require("inquirer");
const shell = require("shelljs");
const fs = require("fs");
const path = require("path");
const os = require("os");

// const EXEC_DIR = process.cwd();
const HOME = os.homedir();
const DOTFILES_DIR = __dirname;

const notImplemented = name => {
  console.error(`${name}: Not implemented`);
  process.exit(1);
};

function fileExistsInUsersHomeDir(file) {
  return !!fs.existsSync(path.resolve(HOME, file));
}

function maybeExit() {
  shell.error() && process.exit(1);
}

const installs = {
  vim: {
    name: "vim",
    exists: () => fileExistsInUsersHomeDir(".vimrc"),
    install: async () => {
      // copy .vimrc to ~/.vimrc
      shell.cp(path.resolve(DOTFILES_DIR, "vim/.vimrc"), HOME);
      maybeExit();
    }
  },
  git: {
    name: "git",
    exists: () => fileExistsInUsersHomeDir(".gitconfig"),
    install: async () => {
      // copy .gitconfig to ~/.gitconfig
      shell.cp(path.resolve(DOTFILES_DIR, "git/.gitconfig"), HOME);
      maybeExit();
    }
  },
  tmux: {
    name: "tmux",
    exists: () => {
      const tmuxFiles = [".tmux", ".tmux.conf"];
      return tmuxFiles.some(fileExistsInUsersHomeDir);
    },
    install: async () => {
      // copy .tmux.conf to ~/
      shell.cp(path.resolve(DOTFILES_DIR, "tmux/.tmux.conf"), HOME);
      // copy plugins into ~/.tmux/
      maybeExit();

      const homeTmuxDir = path.resolve(HOME, "./.tmux/");

      shell.mkdir("-p", homeTmuxDir);

      shell.cp("-R", path.resolve(DOTFILES_DIR, "tmux/plugins"), homeTmuxDir);
      maybeExit();
    }
  },
  zsh: {
    name: "zsh",
    exists: () => fileExistsInUsersHomeDir(".zshrc"),
    install: async () => {
      // copy .zshrc to ~/.zshrc
      shell.cp(path.resolve(DOTFILES_DIR, "zsh/.zshrc"), HOME);
      maybeExit();
    }
  },
  i3: { install: () => notImplemented("i3") },
  "gnome-term": { install: () => notImplemented("gnome-term") }
};

async function askToOverrideConfig(name) {
  // prompt for if to continue or not
  const result = await inquirer.prompt({
    type: "confirm",
    message: `It looks like you already have a ${name} config, would you like to override it?`,
    default: false,
    name: "override"
  });
  if (!result.override) {
    console.log(`Canceled! No changes made to your ${name} config.`);
  }
  return result.override;
}

async function runInstaller(config) {
  if (config.exists() && !(await askToOverrideConfig(config.name))) {
    process.exit();
  }
  await config.install();
  console.log(`Successfully installed ${config.name} config.`);
}

async function installDotfilesFor(app) {
  const apps = Object.keys(installs);
  if (!apps.includes(app)) {
    console.error(`Invalid argument. Choose one of:\n  ${apps.join("\n  ")}`);
    process.exit(1);
  }
  await runInstaller(installs[app]);
}

program.command("install [app]").action(app => {
  installDotfilesFor(app).catch(e => {
    console.log(e);
  });
});

program.parse(process.argv);
