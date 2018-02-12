import {
  Command,
  command,
  param,
} from 'clime';

@command({
  description: 'Elipticoin Client',
})
export default class extends Command {
  execute(
    @param({
      description: 'Your loud name',
      required: true,
    })
    name: string,
  ) {
    return `Hello, ${name}!`;
  }
}
