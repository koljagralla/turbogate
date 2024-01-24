import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

/**
 * This file only exists to be able to ensure that some necessary prototype alterations 
 * can be conducted at the very beginning of CDK synth. Just calling the code below in the 
 * entrypoint of the CDK app will not work, as imports will already have been resolved and
 * during those imports some code will be executed that will not have the prototype alterations.
 */

extendZodWithOpenApi(z);

export const wireTurbogate = undefined;
