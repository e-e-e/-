# Notes:

### Ubuntu Terminal Settings

```
# Backup terminal settings
dconf dump /org/gnome/terminal/ > gnome_terminal_settings.txt

# Reset
dconf reset -f /org/gnome/terminal/

# Restore settings
dconf load /org/gnome/terminal/ < gnome_terminal_settings.txt
```
