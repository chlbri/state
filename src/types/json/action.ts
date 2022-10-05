import { z } from 'zod';
import { JSONschema } from './_default';

export type Action_JSON = z.infer<typeof JSONschema>;
