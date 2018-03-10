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
      description: 'Elipticoin client',
      required: true,
    })
    name: string,
  ) {
  }
}
