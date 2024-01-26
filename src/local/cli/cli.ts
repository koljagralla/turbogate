#!node_modules/.bin/tsx
import { Argument, Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { Constants } from '../../constants';
import { ApiBuilder, ApiBuilderConfig } from '../builder/api-builder';
import { buildSpec } from '../builder/spec-builder';
import { z } from 'zod';

const program = new Command();

// General setup
program.version(Constants.VERSION).description('Tiny CLI to initialize new turbogates or (re)build existing ones.');

// Build action
program
  .command('build')
  .description('Uses the given spec file to generate all declared resources and turbogate entrypoint.')
  .option(
    '-r --root <root>',
    'The directory to use as root folder',
    process.env.INIT_CWD || process.cwd(), // Default value for root
  )
  .option(
    '-s --spec <spec>',
    'The filename of the turbogate spec file in the root folder',
    'turbospec.ts', // Default value for spec
  )
  // TODO limit to byResource and byPath
  .option(
    '-e --endpointStructure <endpointStructure>',
    'Whether to put all endpoint folders directly in the endpoints folder ("allTogether", e.g. endpoints/my-operation, recommend for small APIs) or to infer the resource from the path and create an organizational hierarchy level between endpoints and operation folder ("byResource", e.g. endpoints/my-resource/my-operation, recommend for larger APIs). Migrating generated code between this options is tedious work so choose wisely.',
    'byResource', // Default value for endpointStructure
  )
  .action(async args => {
    const endpointStructure = z
      .enum(['allTogether', 'byResource'], {
        invalid_type_error:
          'Only "allTogether" and "byResource" are allowed values for option --endpointStructure (-e)!',
      })
      .parse(args.endpointStructure);
    const apiBuilderConfig: ApiBuilderConfig = {
      rootDirectory: path.isAbsolute(args.root) ? args.root : path.join(process.cwd()!, args.root),
      configFileName: args.spec,
      endpointStructure: args.endpointStructure,
    };
    const apiBuilder = new ApiBuilder(apiBuilderConfig);
    try {
      await apiBuilder.build();
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  });

// Init action
program
  .command('init')
  .description('Initializes a new turbogate by creating a directory with turbogate spec file.')
  .option(
    '-r --root <root>',
    'The directory to create the new directory with spec file in',
    process.env.INIT_CWD || process.cwd(), // Default value for root
  )
  .addArgument(
    new Argument(
      'name',
      'The name for the API, should be kebap-case. The created folder will be the name suffixed with -turbogate.',
    ).argRequired(),
  )
  .action(async (name, options) => {
    try {
      const targetDirectory = options.root;
      const specContent = buildSpec(name);
      const dir = targetDirectory + `/${name}-turbogate`;
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'turbospec.ts'), specContent);
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
