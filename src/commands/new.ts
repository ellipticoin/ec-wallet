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
  let renderedContents = _.template(contents)(templateVars);
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

    if(!stdout.match(/nightly.*(default)^/)) {
      `rustup update nightly && rustup default nightly`
    };

    if(!stdout.match(/wasm32-unknown-unknown/)) {
      `rustup target add wasm32-unknown-unknown`
    };

    var { stdout, stderr } = await exec(`cargo new ${_.snakeCase(params[0])} ${params.slice(1).join(' ')}`);

    var projectTemplatePath = path.resolve(path.dirname(require.main.filename), "../project_template");
    const projectName = params[0];
    fs.mkdirSync(`${projectName}/.cargo`);
    fs.mkdirSync(`${projectName}/tmp`);
    fs.mkdirSync(`${projectName}/test`);
    fs.mkdirSync(`${projectName}/test/support`);
    fs.copyFileSync(
      `${projectTemplatePath}/test/support/fake-blockchain.js`,
      `${projectName}/test/support/fake-blockchain.js`,
    );
    fs.copyFileSync(
      `${projectTemplatePath}/test/support/utils.js`,
      `${projectName}/test/support/utils.js`,
    );

    fs.copyFileSync(
      `${projectTemplatePath}/src/error.rs`,
      `${projectName}/src/error.rs`,
    );
    fs.copyFileSync(
      `${projectTemplatePath}/.cargo/config`,
      `${projectName}/.cargo/config`,
    );
    fs.copyFileSync(
      `${projectTemplatePath}/.cargo/config`,
      `${projectName}/.cargo/config`,
    );

    renderTemplateAndCopy(
      `${projectTemplatePath}/src/__project_name__.rs`,
      `${projectName}/src/${projectName}.rs`,
      {
        projectName: _.upperFirst(_.camelCase(projectName)),
      }
    );

    renderTemplateAndCopy(
      `${projectTemplatePath}/src/entry_point.rs`,
      `${projectName}/src/entry_point.rs`,
      {
        projectName: _.upperFirst(_.camelCase(projectName)),
        snakeCaseProjectName: projectName,
      }
    );

    renderTemplateAndCopy(
      `${projectTemplatePath}/package.json`,
      `${projectName}/package.json`,
      {
        kebabCaseProjectName: _.kebabCase(projectName),
      }
    );

    renderTemplateAndCopy(
      `${projectTemplatePath}/test/__project_name__-test.js`,
      `${projectName}/test/${_.kebabCase(projectName)}-test.js`,
      {
        projectName: _.upperFirst(_.camelCase(projectName)),
        snakeCaseProjectName: projectName,
      }
    );

    renderTemplateAndCopy(
      `${projectTemplatePath}/src/__project_name___test.rs`,
      `${projectName}/src/${projectName}_test.rs`,
      {
        projectName: _.upperFirst(_.camelCase(projectName)),
        snakeCaseProjectName: projectName,
      }
    );

    renderTemplateAndCopy(
      `${projectTemplatePath}/src/lib.rs`,
      `${projectName}/src/lib.rs`,
      {
        snakeCaseProjectName: projectName,
      }
    );


    let cargoToml = fs.readFileSync(
      `${projectName}/Cargo.toml`,
      "utf8"
    )
    fs.writeFileSync(
      `${projectName}/Cargo.toml`,
      cargoToml.replace("[dependencies]\n", cargoDependencies),
      "utf8"
    )

  }
}
