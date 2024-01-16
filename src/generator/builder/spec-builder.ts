import { Deletability, Editability, GeneratedCodeDisclaimer } from '../util/generated-doc-data';
import { buildGeneratedCodeDisclaimerComment } from '../util/build-generated-doc-disclaimer-comment';
import { zName } from '../spec/zName';

export function buildSpec(name: string) {
  try {
    zName.parse(name);
  } catch (e) {
    throw new Error(`Invalid spec file name: ${name} (name must be kebab-case)`);
  }
  const generatedCodeDisclaimer: GeneratedCodeDisclaimer = {
    purpose:
      'This is the entrypoint for turbogate code generation. Use this file to declare the basic structure of your API. Then run turbogate build to generate the code for your API.',
    expectedSignature: ['default export const of type TurbogateSpec'],
    canBeEdited: Editability.INTENDED_IF_SIGNATURE_REMAINS,
    canBePermanentlyDeleted: Deletability.NO_ENTRYPOINT,
  };
  return `\
${buildGeneratedCodeDisclaimerComment(generatedCodeDisclaimer)}
import { TurbogateSpec } from 'turbogate';

const spec: TurbogateSpec = {
	meta: {
		name: '${name}',
	},
	authorizers: {
		// Declare one lambda request authorizer
		basicAuth: {
			type: 'lambdaRequestAuthorizer',
		},
	},
	// Basic endpoints declaration with a CRUD API for resource item.
	// Read operations are public, write operations are protected by the basicAuth authorizer.
	endpoints: {
		'/items/{id}': {
			GET: {
				name: 'get-item',
			},
			PUT: {
				name: 'update-item',
				authorizer: 'basicAuth',
			},
			DELETE: {
				name: "delete-item",
				authorizer: "basicAuth"
			}
		},
		"/items": {
			POST: {
				name: "create-item",
				authorizer: "basicAuth"
			},
			GET: {
				name: "list-items",
			}
		}
	},
};

export default spec;
`;
}
