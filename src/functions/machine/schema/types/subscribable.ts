import type { z } from 'zod';
import type {
  EventObject,
  ServiceSubscribable,
  Transition,
} from '../../../../types';

export type SubscribableProp<TE extends EventObject = EventObject> =
  z.ZodEffects<
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
                  z.ZodEffects<
                    z.ZodArray<z.ZodString, 'many'>,
                    Transition,
                    string[]
                  >,
                  Transition[],
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
            error: Transition[];
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
