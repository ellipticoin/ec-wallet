import {
  Command,
  command,
  params,
} from 'clime';
const fs = require('fs');
const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);
const commandExists = util.promisify(require('command-exists'));
const _ = require('lodash');
const cargoDependencies =`
[profile.release]
opt-level = 3
debug = false
rpath = false
lto = true

debug-assertions = false
codegen-units = 1
panic = "abort"
[lib]
crate_type = ["cdylib"]

[dev-dependencies]
ellipticoin-test-framework = "0.1.0"

[dependencies]
ellipticoin = "0.1.0"
wee_alloc = { git = 'https://github.com/fitzgen/wee_alloc' }
wasm-rpc = "0.1.1"
cbor-no-std = "0.1.0"`;

const recursiveListDirectory = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {

    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? recursiveListDirectory(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));

  });
return filelist;
}

function renderTemplateAndCopy (source, destination, templateVars) {
  let contents = fs.readFileSync(source, 'utf8');
  let renderedContents = _.template(contents)(templateVars));
  fs.writeFileSync(destination, renderedContents, 'utf8')
}


@command({
  description: 'Create a new smart contract',
})
export default class extends Command {
  async execute(
    @params({
      type: String,
      description: 'params',
    })
    params: string[],
  ) {

    if(!await commandExists('cargo')) {
      return "Please install Cargo and Rust:\n\n    curl https://sh.rustup.rs -sSf | sh"
    };

    var { stdout, stderr } = await exec(`rustup show`);

    if(!stdout.match(/nightly.*(default)^/) {
      `rustup update nightly && rustup default nightly`
    };

    if(!stdout.match(/wasm32-unknown-unknown/) {
      `rustup target add wasm32-unknown-unknown`
    };

    var { stdout, stderr } = await exec(`cargo new ${_.snakeCase(params[0])} ${params.slice(1).join(' ')}`);

    var projectTemplatePath = path.resolve(path.dirname(require.main.filename), "../project_template");
    const projectName = params[0];
    fs.mkdirSync(`${_.snakeCase(projectName)}/.cargo`);
    fs.mkdirSync(`${_.snakeCase(projectName)}/test`);
    fs.mkdirSync(`${_.snakeCase(projectName)}/test/support`);
    fs.copyFileSync(
      `${projectTemplatePath}/test/support/fake-blockchain.js`,
      `${_.snakeCase(projectName)}/test/support/fake-blockchain.js`,
    );
    fs.copyFileSync(
      `${projectTemplatePath}/test/support/utils.js`,
      `${_.snakeCase(projectName)}/test/support/utils.js`,
    );

    fs.copyFileSync(
      `${projectTemplatePath}/src/error.rs`,
      `${_.snakeCase(projectName)}/src/error.rs`,
    );
    fs.copyFileSync(
      `${projectTemplatePath}/.cargo/config`,
      `${_.snakeCase(projectName)}/.cargo/config`,
    );
    fs.copyFileSync(
      `${projectTemplatePath}/.cargo/config`,
      `${_.snakeCase(projectName)}/.cargo/config`,
    );

    renderTemplateAndCopy(
      `${projectTemplatePath}/src/__project_name__.rs`,
      `${_.snakeCase(projectName)}/src/${_.snakeCase(projectName)}.rs`,
      {
        projectName,
      }
    );

    renderTemplateAndCopy(
      `${projectTemplatePath}/src/entry_point.rs`,
      `${_.snakeCase(projectName)}/src/entry_point.rs`,
      {
        projectName,
        snakeCaseProjectName: _.snakeCase(projectName),
      }
    );

    renderTemplateAndCopy(
      `${projectTemplatePath}/package.json`,
      `${_.snakeCase(projectName)}/package.json`,
      {
        kebabCaseProjectName: _.kebabCase(projectName),
      }
    );

    renderTemplateAndCopy(
      `${projectTemplatePath}/test/__project_name__-test.js`,
      `${_.snakeCase(projectName)}/test/${_.kebabCase(projectName)}-test.js`,
      {
        projectName: projectName,
        snakeCaseProjectName: _.snakeCase(projectName),
      }
    );

    renderTemplateAndCopy(
      `${projectTemplatePath}/src/__project_name___test.rs`,
      `${_.snakeCase(projectName)}/src/${_.snakeCase(projectName)}_test.rs`,
      {
        projectName,
      }
    );

    renderTemplateAndCopy(
      `${projectTemplatePath}/src/lib.rs`,
      `${_.snakeCase(projectName)}/src/lib.rs`,
      {
        snakeCaseProjectName: _.snakeCase(projectName),
      }
    );


    let cargoToml = fs.readFileSync(
      `${_.snakeCase(projectName)}/Cargo.toml`,
      "utf8"
    )
    fs.writeFileSync(
      `${_.snakeCase(projectName)}/Cargo.toml`,
      cargoToml.replace("[dependencies]\n", cargoDependencies),
      "utf8"
    )
    // recursiveListDirectory()

  }
}
