import type { z } from 'zod';
import type {
  EventObject,
  ServiceSubscribable,
  Transition,
} from '../../../../types';

export type SubscribableProp<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = z.ZodEffects<
  z.ZodOptional<
    z.ZodRecord<
      z.ZodString,
      z.ZodObject<
        {
          description: z.ZodOptional<z.ZodString>;
          error: z.ZodUnion<
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
                Transition<TC, TE, PTC>[],
                {
                  description?: string | undefined;
                  actions?: any;
                  guards?: any;
                  in?: string | string[] | undefined;
                  target?: string | undefined;
                }
              >,
              z.ZodEffects<
                z.ZodEffects<z.ZodString, Transition<TC, TE, PTC>, string>,
                Transition<TC, TE, PTC>[],
                string
              >,
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
                  Transition<TC, TE, PTC>,
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
                z.ZodEffects<
                  z.ZodArray<z.ZodString, 'many'>,
                  Transition<TC, TE, PTC>,
                  string[]
                >,
                Transition<TC, TE, PTC>[],
                string[]
              >,
            ]
          >;
          next: z.ZodType<string[], z.ZodTypeDef, any>;
          complete: z.ZodType<string[], z.ZodTypeDef, any>;
        },
        'strip',
        z.ZodTypeAny,
        {
          description?: string | undefined;
          error: Transition<TC, TE, PTC>[];
          next: string[];
          complete: string[];
        },
        {
          description?: string | undefined;
          next?: any;
          complete?: any;
          error:
            | string
            | string[]
            | {
                description?: string | undefined;
                actions?: any;
                guards?: any;
                in?: string | string[] | undefined;
                target?: string | undefined;
              }
            | {
                description?: string | undefined;
                actions?: any;
                guards?: any;
                in?: string | string[] | undefined;
                target?: string | undefined;
              }[];
        }
      >
    >
  >,
  ServiceSubscribable<TE>[],
  | Record<
      string,
      {
        description?: string | undefined;
        next?: any;
        complete?: any;
        error:
          | string
          | string[]
          | {
              description?: string | undefined;
              actions?: any;
              guards?: any;
              in?: string | string[] | undefined;
              target?: string | undefined;
            }
          | {
              description?: string | undefined;
              actions?: any;
              guards?: any;
              in?: string | string[] | undefined;
              target?: string | undefined;
            }[];
      }
    >
  | undefined
>;
