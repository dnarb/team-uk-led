import { bool, dict, object, string, voidable } from '@recoiljs/refine';

import { MutableCheckerReturn } from '../../../utils/recoil/refine';

const dimensionMetaChecker = object({
  Name: string(),
  IsLeaf: bool(),
  Colors: voidable(dict(string())),
});

export type DimensionMeta = MutableCheckerReturn<typeof dimensionMetaChecker>;

export const allDimensionsMetaChecker = dict(dimensionMetaChecker);
