# @karcass/cli

CLI for the <a href="https://github.com/karcass-ts/karcass">karcass</a> which helps to build simple CLI interfaces

## Installation

```
npm install @karcass/cli
```

## Usage

With this code in `example.ts`:

```typescript
import { Cli, AbstractConsoleCommand } from '@karcass/cli'

const cli = new Cli()

class SomeCommand extends AbstractConsoleCommand {
    public static meta = { name: 'do:some', description: 'Does some action' }
    public async execute() {
        console.log('It just works!')
    }
}
cli.add(SomeCommand, () => new SomeCommand())

cli.run()
```

Executing &nbsp;`ts-node example.ts`&nbsp; will print:

```
=== Available commands: ===
  --help   Show this help
  do:some  Does some action
```

And executing of &nbsp;`ts-node example.js do:some`&nbsp; will print:

```
It just works!
```

Also you can turn off default --help command behaviour by turning off corresponding setting:

```
const cli = new Cli({ useDefaultHelpCommand: false })
```
