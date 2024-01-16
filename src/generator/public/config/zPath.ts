import { z } from 'zod';

const zPath = z.string().startsWith('/'); 

export type Path = z.TypeOf<typeof zPath>;
export { zPath };
