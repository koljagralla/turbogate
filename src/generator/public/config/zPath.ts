import { z } from 'zod';

const zPath = z.string(); // TODO add regex (must begin with / )

export type Path = z.TypeOf<typeof zPath>;
export { zPath };
