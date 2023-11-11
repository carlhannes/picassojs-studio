import { ExampleItem } from '@/core/types';
import fs from 'fs/promises';
import path from 'path';
import runScript from '@/core/run-script';

// read all files in the current directory and export them as a map
export const getSrvExamples = async () => {
  const absPath = path.resolve('src/examples/');
  const files = await fs.readdir(absPath);
  const examples = await Promise.all(
    files.map(async (file) => {
      // ignore this file if it's not a .js file
      if (!file.endsWith('.js')) {
        return;
      }

      let content = await fs.readFile(`${absPath}/${file}`, 'utf-8');

      // replace "export default item;" with "return item;"
      // regardless of what "item" is named
      content = content.replace(/export default (\w+);/g, 'return $1;');

      // use runScript to run the file and return the result
      const item: ExampleItem = runScript(content);

      return item;
    })
  ).then((items) => items.filter(Boolean));

  return examples;
};