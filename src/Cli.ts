import { Container } from '@karcass/container'
import { MetaContainerInterface, ConsoleCommandInterface } from './AbstractConsoleCommand'
import { HelpCommand } from './HelpCommand'

export class Cli {
    protected container = new Container<ConsoleCommandInterface>()

    public constructor(config: { useDefaultHelpCommand?: boolean } = {}) {
        config = { useDefaultHelpCommand: true, ...config }
        if (config.useDefaultHelpCommand) {
            this.container.add(HelpCommand, () => {
                const commands: (new (...args: any[]) => ConsoleCommandInterface)[] = []
                for (const key of this.container.getKeys()) {
                    if (typeof key !== 'string') {
                        commands.push(key)
                    }
                }
                return new HelpCommand(commands)
            })
        }
    }

    public add<T extends ConsoleCommandInterface>(constructor: new (...args: any[]) => T, initializer: () => T|Promise<T>) {
        const meta = (constructor as unknown as MetaContainerInterface).meta
        if (!meta || !meta.name) {
            throw new Error(`There is no static field "meta" in the ${constructor.name}`)
        }
        this.container.add(constructor, initializer)
    }

    public async run() {
        if (process.argv[2]) {
            for (const command of this.container.getKeys()) {
                if (typeof command === 'string') {
                    throw new Error(`Key "${command}" must be a constructor, not a string`)
                }
                const meta = (command as unknown as MetaContainerInterface).meta
                if (meta.name === process.argv[2]) {
                    await (await this.container.get(command)).execute()
                    return
                }
            }
            console.log(`\nCommand ${process.argv[2]} not found.`)
        }
        (await this.container.get(HelpCommand)).execute()
    }

}
