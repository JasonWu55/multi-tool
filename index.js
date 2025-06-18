const chalk = require('chalk');
const figlet = require('figlet');
const Table = require('cli-table3');
const ora = require('ora');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Force set UTF-8 encoding to solve Chinese character encoding issues
process.stdout.setEncoding('utf8');
process.stderr.setEncoding('utf8');

// Set Windows console to UTF-8 encoding
if (process.platform === 'win32') {
    exec('chcp 65001', { encoding: 'utf8' }, () => {});
}

class MultiTool {
    constructor() {
        this.config = this.loadConfig();
        this.isRunning = true;
    }

    loadConfig() {
        try {
            const configPath = path.join(__dirname, 'config.json');
            const configData = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            console.error(chalk.red('❌ Unable to load config file:', error.message));
            process.exit(1);
        }
    }

    clearScreen() {
        console.clear();
    }

    displayHeader() {
        console.log(chalk[this.config.ui.primaryColor](
            figlet.textSync(this.config.title, {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        ));
        
        console.log(chalk[this.config.ui.secondaryColor](
            `\nVersion: ${this.config.version}\n`
        ));
    }

    displayMenu() {
        const table = new Table({
            head: ['Option', 'Tool Name', 'Description'],
            colWidths: [8, 25, 50],
            style: {
                head: [this.config.ui.primaryColor],
                border: [this.config.ui.primaryColor]
            }
        });

        this.config.tools.forEach(tool => {
            const option = chalk[this.config.ui.secondaryColor](`[${tool.id}]`);
            const name = this.config.ui.showIcons ? 
                `${tool.icon} ${tool.name}` : tool.name;
            table.push([option, name, tool.description]);
        });

        // Add exit option
        const exitOption = chalk[this.config.ui.secondaryColor](`[0]`);
        table.push([exitOption, '🚪 Exit Program', 'Close the multi-tool toolbox']);

        console.log(table.toString());
        console.log();
    }

    async getUserChoice() {
        return new Promise((resolve) => {
            console.log(chalk[this.config.ui.primaryColor]('Please select an option (0-' + this.config.tools.length + '):'));
            
            // Create choice command option string
            const choices = '0' + this.config.tools.map(tool => tool.id).join('');
            
            // Use Windows choice command with UTF-8 encoding
            const choiceProcess = spawn('choice', ['/c', choices, '/n'], {
                stdio: ['inherit', 'pipe', 'inherit'],
                env: { ...process.env, CHCP: '65001' }
            });

            choiceProcess.stdout.on('data', (data) => {
                const choice = data.toString().trim();
                resolve(parseInt(choice));
            });

            choiceProcess.on('error', (error) => {
                // If choice command fails, use standard input
                console.log(chalk.yellow('⚠️  Using standard input mode'));
                process.stdin.resume();
                process.stdin.setEncoding('utf8');
                process.stdin.once('data', (data) => {
                    const choice = parseInt(data.toString().trim());
                    process.stdin.pause();
                    resolve(choice);
                });
            });
        });
    }

    async executeCommand(tool) {
        const spinner = ora({
            text: `Executing: ${tool.name}`,
            color: this.config.ui.primaryColor
        }).start();

        return new Promise((resolve) => {
            // Force UTF-8 encoding for command execution
            exec(tool.command, { 
                encoding: 'utf8',
                env: { ...process.env, CHCP: '65001' }
            }, (error, stdout, stderr) => {
                spinner.stop();
                
                if (error) {
                    console.log(chalk[this.config.ui.errorColor](`❌ Execution error: ${error.message}`));
                    resolve(false);
                    return;
                }

                if (stderr) {
                    console.log(chalk[this.config.ui.secondaryColor](`⚠️  Warning: ${stderr}`));
                }

                console.log(chalk[this.config.ui.successColor](`✅ ${tool.name} executed successfully\n`));
                
                // Display output results with UTF-8 encoding
                if (stdout) {
                    console.log(chalk.white('─'.repeat(60)));
                    // Ensure output is UTF-8 encoded
                    const utf8Output = Buffer.from(stdout, 'utf8').toString('utf8');
                    console.log(chalk.white(utf8Output));
                    console.log(chalk.white('─'.repeat(60)));
                }

                resolve(true);
            });
        });
    }

    async confirmAction(tool) {
        return new Promise((resolve) => {
            console.log(chalk[this.config.ui.secondaryColor](
                `⚠️  Warning: You are about to execute "${tool.name}"`
            ));
            console.log(chalk.yellow('This operation may affect the system. Are you sure you want to continue?'));
            console.log(chalk[this.config.ui.primaryColor]('Press Y to confirm, N to cancel:'));

            const choiceProcess = spawn('choice', ['/c', 'YN', '/n'], {
                stdio: ['inherit', 'pipe', 'inherit'],
                env: { ...process.env, CHCP: '65001' }
            });

            choiceProcess.stdout.on('data', (data) => {
                const choice = data.toString().trim().toUpperCase();
                resolve(choice === 'Y');
            });

            choiceProcess.on('error', (error) => {
                // Fallback solution
                process.stdin.resume();
                process.stdin.setEncoding('utf8');
                process.stdin.once('data', (data) => {
                    const choice = data.toString().trim().toUpperCase();
                    process.stdin.pause();
                    resolve(choice === 'Y' || choice === 'YES');
                });
            });
        });
    }

    async waitForKeyPress() {
        console.log(chalk[this.config.ui.primaryColor]('\nPress any key to continue...'));
        
        return new Promise((resolve) => {
            const pauseProcess = spawn('pause', {
                stdio: ['inherit', 'inherit', 'inherit'],
                shell: true,
                env: { ...process.env, CHCP: '65001' }
            });

            pauseProcess.on('close', () => {
                resolve();
            });

            pauseProcess.on('error', () => {
                // Fallback solution
                process.stdin.resume();
                process.stdin.setEncoding('utf8');
                process.stdin.once('data', () => {
                    process.stdin.pause();
                    resolve();
                });
            });
        });
    }

    async run() {
        while (this.isRunning) {
            this.clearScreen();
            this.displayHeader();
            this.displayMenu();

            const choice = await this.getUserChoice();

            if (choice === 0) {
                console.log(chalk[this.config.ui.successColor]('👋 Thank you for using Multi-Tool Toolbox!'));
                this.isRunning = false;
                break;
            }

            const selectedTool = this.config.tools.find(tool => tool.id === choice);

            if (!selectedTool) {
                console.log(chalk[this.config.ui.errorColor]('❌ Invalid selection, please choose again.'));
                await this.waitForKeyPress();
                continue;
            }

            this.clearScreen();
            console.log(chalk[this.config.ui.primaryColor](
                `\nExecuting: ${selectedTool.icon} ${selectedTool.name}\n`
            ));

            // If confirmation is required, ask user first
            if (selectedTool.requiresConfirmation) {
                const confirmed = await this.confirmAction(selectedTool);
                if (!confirmed) {
                    console.log(chalk[this.config.ui.secondaryColor]('Operation cancelled.'));
                    await this.waitForKeyPress();
                    continue;
                }
            }

            await this.executeCommand(selectedTool);
            await this.waitForKeyPress();
        }
    }
}

// Start the application
const app = new MultiTool();
app.run().catch(error => {
    console.error(chalk.red('Application error:', error));
    process.exit(1);
}); 