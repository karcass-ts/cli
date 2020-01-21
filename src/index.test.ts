import { Cli, AbstractConsoleCommand } from './'
import assert from 'assert'

class FailCommand extends AbstractConsoleCommand {
    public async execute() { /**/ }
}
let testVar = 1
class SuccessCommand extends AbstractConsoleCommand {
    public static meta = { name: 'test', description: 'test description' }
    public async execute() {
        testVar = 2
    }
}

it('Must throw message about undefined static field', async () => {
    const cli = new Cli()
    try {
        cli.add(FailCommand, () => new FailCommand())
    } catch (err) {
        return assert(err.message.indexOf('meta'))
    }
    assert.fail()
})
it('Must change value of testVar to 2', async () => {
    const cli = new Cli()
    cli.add(SuccessCommand, () => new SuccessCommand())
    process.argv[2] = 'test'
    await cli.run()
    assert.equal(testVar, 2)
})
it('Must console.log help text', async () => {
    const cli = new Cli()
    const out: string[] = []
    const myLog = (text: string) => {
        out.push(text)
    }
    const reallyLog = console.log
    console.log = myLog
    await cli.run()
    console.log = reallyLog
    assert(out.join('\n').indexOf('Show this help') >= 0)
    assert(out.join('\n').indexOf('--help') >= 0)
})
it('Must console.log "123"', async () => {
    class MyCommand extends AbstractConsoleCommand {
        public static meta = { name: 'test' }
        public async execute() {
            await new Promise(resolve => setTimeout(resolve, 100))
            console.log('123')
        }
    }
    const cli = new Cli()
    let out = ''
    const myLog = (text: string) => {
        out = text
    }
    const reallyLog = console.log
    cli.add(MyCommand, () => new MyCommand())
    console.log = myLog
    await cli.run()
    console.log = reallyLog
    assert(out.indexOf('123') >= 0)
})
it('Must out command not found message', async () => {
    const cli = new Cli()
    process.argv[2] = 'dsdsd'
    const reallyLog = console.log
    let out = ''
    const myLog = (text: string) => {
        out += text
    }
    console.log = myLog
    await cli.run()
    console.log = reallyLog
    assert(out.indexOf('not found') >= 0)
})
