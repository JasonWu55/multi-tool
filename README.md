# Multi-Tool Toolbox

A Node.js multi-functional tool with beautiful terminal UI, supporting Windows choice commands and customizable tool options through configuration files.

## ✨ Features

- 🎨 **Beautiful Terminal UI** - Using colored text, tables, and icons
- ⚙️ **Configurable Tools** - Easily add or modify tools through config.json
- 🖱️ **Windows Choice Support** - Native support for Windows choice commands
- 🔒 **Safety Confirmation** - Dangerous operations require user confirmation
- 📊 **Clear Output** - Structured display of command execution results

## 🚀 Quick Start

### Method 1: Global Installation (Recommended)

#### Automatic Installation
```bash
# Double-click install.bat or run in command line:
install.bat
```

#### Manual Installation
```bash
npm install -g .
```

After installation, you can use from anywhere:
```bash
multi-tool
# or short version
mt
```

### Method 2: Local Execution

#### Install Dependencies
```bash
npm install
```

#### Run Program
```bash
npm start
```

## 📋 Built-in Tools

1. **System Information Viewer** 🖥️ - Display basic system information
2. **Network Connection Test** 🌐 - Test network connectivity status
3. **Disk Space Viewer** 💾 - Check disk usage
4. **Process Manager** ⚙️ - Display running processes
5. **Clean Temporary Files** 🧹 - Clean system temporary files (requires confirmation)
6. **IP Configuration Viewer** 🔧 - Display network configuration information

## ⚙️ Configuration

Edit the `config.json` file to customize your tools:

```json
{
  "tools": [
    {
      "id": 1,
      "name": "Tool Name",
      "description": "Tool description",
      "command": "Command to execute",
      "type": "Tool type",
      "icon": "🔧",
      "requiresConfirmation": false
    }
  ]
}
```

### Configuration Parameters

- `id`: Numeric ID of the tool (used for selection)
- `name`: Display name of the tool
- `description`: Tool function description
- `command`: Windows command to execute
- `type`: Tool category (system, network, disk, etc.)
- `icon`: Emoji icon to display
- `requiresConfirmation`: Whether user confirmation is required (recommended for dangerous operations)

### UI Configuration

You can also customize the UI appearance:

```json
{
  "ui": {
    "primaryColor": "cyan",
    "secondaryColor": "yellow", 
    "errorColor": "red",
    "successColor": "green",
    "showBorder": true,
    "showIcons": true
  }
}
```

## 🎮 Usage

### Start the Tool
```bash
# After global installation, run from anywhere
multi-tool

# or use short command
mt
```

### Operation Steps
1. After starting the program, you'll see a beautiful tool menu
2. Use number keys to select the tool you want to execute
3. The program uses Windows choice command to get your selection
4. For dangerous operations, the system will ask for confirmation
5. After tool execution completes, press any key to return to main menu
6. Select `0` to exit the program

### Uninstall
```bash
# Double-click uninstall.bat or run in command line:
uninstall.bat

# or manual uninstall
npm uninstall -g multi-tool
```

## 🛠️ Technical Dependencies

- **chalk**: Terminal color support
- **figlet**: ASCII art fonts
- **cli-table3**: Beautiful table display
- **ora**: Loading animation effects
- **Node.js built-in modules**: child_process, fs, path

## 📝 License

MIT License

## 🤝 Contributing

Welcome to submit issues and feature requests! 