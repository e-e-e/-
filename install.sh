#!/usr/bin/env bash
#
# This script helps install my dot files on a UNIX like system.
#

set -eu
set -o pipefail

dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

usage() {
  cat <<EOF
... put some help
EOF
}

override_prompt() {
  echo "Do you want to override it? (We will make a backup for you.)";
  select yn in "Yes" "No"; do
    case $yn in
      Yes) printf "yes"; return;;
      No) printf "no"; return;;
    esac
  done
}

install_tmux() {
  if [[ -f ~/.tmux.conf ]]; then
    echo "A ~/.tmux.conf file already config exists.";
    echo "Do you want to override it?";
    select yn in "Yes" "No"; do
      case $yn in
        "No") 
          echo "Thats cool. Bye!";
          exit;;
        "Yes")
          break;;
      esac
    done
    echo "Would you like to save a backup?"
    select yn in "Yes" "No"; do
      case $yn in
        "Yes") 
          # Creat backup
          local backups=$(find ~ -maxdepth 1 -name ".tmux.conf*.bak" -printf "." | wc -m);
          cp ~/.tmux.conf{,".${backups}.bak"};
          echo "Created backup at ~/tmux.config.$backups.bak.";
          break;;
        "No") break;;
      esac
    done
  fi
  local from="$dir/tmux/.tmux.conf";
  local to=~/.tmux.conf;
  cp "$from" "$to";
  echo "Copied $from to $to";
  exit
}

main() {
  if [[ "$*" =~ ^(-h|--help)$ ]]; then
    usage
    exit
  fi
  echo "What config would you like to install?"
  select yn in "tmux" "nothing"; do
    case $yn in
      tmux ) install_tmux;; 
      nothing) exit;;
      * ) exit;;
    esac
  done
}

main "$@";