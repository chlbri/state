import type { EventObject, ServicePromise, Transition } from '@-types';
import type { z } from 'zod';

export type PromiseProp<
  TC extends object = object,
  TE extends EventObject = EventObject,
  PTC extends object = object,
> = z.ZodEffects<
  z.ZodOptional<
    z.ZodRecord<
      z.ZodString,
      z.ZodObject<
        {
          timeout: z.ZodOptional<
            z.ZodUnion<
              [z.ZodNumber, z.ZodEffects<z.ZodString, string, string>]
            >
          >;
          description: z.ZodOptional<z.ZodString>;
          then: z.ZodUnion<
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
          catch: z.ZodUnion<
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
          finally: z.ZodType<string[], z.ZodTypeDef, any>;
        },
        'strip',
        z.ZodTypeAny,
        {
          description?: string | undefined;
          then: Transition[];
          catch: Transition[];
          timeout?: number | string;
          finally: string[];
        },
        {
          description?: string | undefined;
          finally?: any;
          then:
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
          catch:
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
          timeout?: number | string;
        }
      >
    >
  >,
  ServicePromise<TC, TE, PTC, any>[],
  | Record<
      string,
      {
        description?: string | undefined;
        finally?: any;
        then:
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
        catch:
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
        timeout?: number | string;
      }
    >
  | undefined
>;
