import type { Transition } from '@-types';
import type { z } from 'zod';

export type TransitionProp = z.ZodUnion<
  [
    z.ZodEffects<
      z.ZodObject<
        {
          description: z.ZodOptional<z.ZodString>;
          in: z.ZodUnion<
            [
              z.ZodEffects<
                z.ZodOptional<z.ZodString>,
                string[],
                string | undefined
              >,
              z.ZodArray<z.ZodString, 'many'>,
            ]
          >;
          actions: z.ZodType<string[], z.ZodTypeDef, any>;
          guards: z.ZodType<string[], z.ZodTypeDef, any>;
          target: z.ZodOptional<z.ZodString>;
        },
        'strip',
        z.ZodTypeAny,
        {
          description?: string | undefined;
          target?: string | undefined;
          actions: string[];
          guards: string[];
          in: string[];
        },
        {
          description?: string | undefined;
          actions?: any;
          guards?: any;
          in?: string | string[] | undefined;
          target?: string | undefined;
        }
      >,
      Transition[],
      {
        description?: string | undefined;
        actions?: any;
        guards?: any;
        in?: string | string[] | undefined;
        target?: string | undefined;
      }
    >,
    z.ZodEffects<
      z.ZodEffects<z.ZodString, Transition, string>,
      Transition[],
      string
    >,
    z.ZodEffects<z.ZodUndefined, never[], undefined>,
    z.ZodArray<
      z.ZodEffects<
        z.ZodObject<
          {
            description: z.ZodOptional<z.ZodString>;
            in: z.ZodUnion<
              [
                z.ZodEffects<
                  z.ZodOptional<z.ZodString>,
                  string[],
                  string | undefined
                >,
                z.ZodArray<z.ZodString, 'many'>,
              ]
            >;
            actions: z.ZodType<string[], z.ZodTypeDef, any>;
            guards: z.ZodType<string[], z.ZodTypeDef, any>;
            target: z.ZodOptional<z.ZodString>;
          },
          'strip',
          z.ZodTypeAny,
          {
            description?: string | undefined;
            target?: string | undefined;
            actions: string[];
            guards: string[];
            in: string[];
          },
          {
            description?: string | undefined;
            actions?: any;
            guards?: any;
            in?: string | string[] | undefined;
            target?: string | undefined;
          }
        >,
        Transition,
        {
          description?: string | undefined;
          actions?: any;
          guards?: any;
          in?: string | string[] | undefined;
          target?: string | undefined;
        }
      >,
      'many'
    >,
    z.ZodEffects<
      z.ZodEffects<z.ZodArray<z.ZodString, 'many'>, Transition, string[]>,
      Transition[],
      string[]
    >,
  ]
>;
