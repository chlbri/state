import z from 'zod';

export const guard_JSON = z
  .object({
    id: z.string(),
    description: z.string().optional(),
  })
  .strict();

export type Guard_JSON = z.infer<typeof guard_JSON>;

export type GuardUnion =
  | GuardsOr_JSON
  | GuardsAnd_JSON
  | Guard_JSON
  | string;

export type GuardsOr_JSON = {
  or: GuardUnion[];
};

export type GuardsAnd_JSON = {
  and: GuardUnion[];
};

export const unionGuard = () => {
  return z.array(
    z.union([guard_JSON, guardOr_JSON, guardAnd_JSON, z.string()]),
  );
};

export const guardOr_JSON: z.ZodType<GuardsOr_JSON> = z.lazy(() =>
  z.object({
    or: unionGuard(),
  }),
);

export const guardAnd_JSON: z.ZodType<GuardsAnd_JSON> = z.lazy(() =>
  z.object({
    and: unionGuard(),
  }),
);

export const guards_JSON = z.union([
  guard_JSON,
  unionGuard(),
  z.string(),
  guardOr_JSON,
  guardAnd_JSON,
  z.undefined(),
]);

export type Guards_JSON = z.infer<typeof guards_JSON>;
