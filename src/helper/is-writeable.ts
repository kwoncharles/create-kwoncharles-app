import fs from 'fs'

export async function isWriteable(directory: string): Promise<boolean> {
  try {
    // W_OK means "it is writeable"
    // @ts-ignore
    await fs.promises.access(directory, (fs.constants || fs).W_OK);
    return true;
  } catch (err) {
    return false;
  }
}
