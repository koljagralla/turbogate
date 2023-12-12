import * as fs from 'fs';
import { Constants as Constants } from '../../constants';
import { Deletability, Editability, GeneratedCodeDisclaimer } from '../private/generated-doc-data';
import { buildGeneratedCodeDisclaimerComment } from './build-generated-doc-disclaimer-comment';

/**
 * Copies a template file or directory of template files to a destination.
 *
 * Imports beginning with `../` will be replaces with imports from `{ turbogate }`. Imports containing `TO_ROOT`
 * will be replaced with `../` depthFromRoot times.
 */
export async function copyTemplate(source: string, destination: string, depthFromRoot: number | undefined = undefined) {
  const stat = fs.statSync(source);

  // If the given source is a directory re recursively call this function.
  // But before that we ensure the directory implicated by source exists at destination.
  if (stat.isDirectory()) {
    const files = fs.readdirSync(source);
    fs.mkdirSync(destination, { recursive: true });
    files.forEach(content => {
      copyTemplate(`${source}/${content}`, `${destination}/${content}`, depthFromRoot);
    });
    return;
  }

  // If the file aready exists we won't touch it and are done.
  if (fs.existsSync(destination)) {
    return;
  }

  // Read the file as plaintext as well as JS
  let content = fs.readFileSync(source, 'utf-8');
  let ts = require(source);

  // If the file contains a generatedCodeDisclaimer we read it, delete it and its imports and
  // generate a header from it.
  let disclaimerComment = '';
  if (ts.generatedCodeDisclaimer) {
    const disclaimer = ts.generatedCodeDisclaimer as GeneratedCodeDisclaimer;
    disclaimerComment = buildGeneratedCodeDisclaimerComment(disclaimer) + '\n';
    const generatedCodeDisclaimerSourceCodeRegex = /export const generatedCodeDisclaimer(.|\n)*};/;
    const generatedCodeDisclaimerImportsRegex = /import {((.|\n)(?!import))*\/generated-doc-data';\n/;
    content = content.replace(generatedCodeDisclaimerSourceCodeRegex, '');
    content = content.replace(generatedCodeDisclaimerImportsRegex, '');
  }

  // First we find all imports that are from our own package
  const ownImportRegex = /import {( .+ )} from '(?!_root)\.{2}\/(?!.*_root).+';\n/g;
  let matches,
    output = [];
  while ((matches = ownImportRegex.exec(content))) {
    output.push(matches[1].trim());
  }

  // If we found any own imports we need to parse and replace them
  if (output.length > 0) {
    // Then we sort them alphabetically and build a string of them
    const concatenatedAndSortedImportNames = output.sort((a, b) => a.localeCompare(b)).join(', ');
    const fullOwnImport = `import { ${concatenatedAndSortedImportNames} } from '${Constants.PACKAGE_NAME}';\n`;

    // Then we remove the imports from our own package
    content = content.replaceAll(ownImportRegex, '');

    // Then we place the generated import statement at the top of the file
    content = fullOwnImport + content;
  }

  // Now we ensure that relative imports that should point to the root of the project are correct
  if (depthFromRoot !== undefined) {
    // write ../ depthFromRoot times
    const relativePath = '../'.repeat(depthFromRoot);
    const rootDirectoryRegex = /(\.\.\/)*_root\//g;
    content = content.replaceAll(rootDirectoryRegex, relativePath);
  }

  // Now we can add the disclaimerComment (if present)
  content = disclaimerComment + content;

  // Finally we write the file
  fs.writeFileSync(destination, content);
}
