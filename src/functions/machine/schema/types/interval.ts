import { z } from 'zod';
import { Interval, NOmit } from '../../../../types';

export type IntervalProp = z.ZodEffects<
  z.ZodOptional<
    z.ZodRecord<
      z.ZodEffects<
        z.ZodUnion<
          [z.ZodNumber, z.ZodEffects<z.ZodString, string, string>]
        >,
        string | number,
        string | number
      >,
      z.ZodUnion<
        [
          z.ZodEffects<z.ZodString, NOmit<Interval, 'interval'>, string>,
          z.ZodType<NOmit<Interval, 'interval'>, z.ZodTypeDef, any>,
          z.ZodEffects<
            z.ZodArray<z.ZodString, 'many'>,
            NOmit<Interval, 'interval'>,
            string[]
          >,
        ]
      >
    >
  >,
  Interval[],
  Record<string | number, any> | undefined
>;
