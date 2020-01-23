import path from 'path';

/** Check if one path is within a parent path */
const inFolder = (parent: string, child: string) => {
  const relative = path.relative(parent, child);

  return Boolean(!relative?.startsWith('..') && !path.isAbsolute(relative));
};

export default inFolder;