# Turbogate <!-- omit in toc -->

Turbogate is a micro framework and code generator aimed at building truly serverless, well validated, well documeted REST APIs using AWS CDK TypeScript in turbo speed.

**No more...**

* ...manual and repetitive creation and wiring of constructs such as API gateways, API gateway resources,  lambdas, lambda integrations, lambda authorizers etc.
* ...tediously writing request validation boilerplate.
* ...several hundred lines of code to grant the same permissions and pass in the same environment values over and over again.

Simply <ins>no more spending and hour for an endpoint</ins> that would take minutes in classic server-based environments <ins>while still building truly serverless.</ins>


- [Features](#features)
- [Getting started](#getting-started)
- [Patterns and recommended conventions](#patterns-and-recommended-conventions)
- [Roadmap](#roadmap)
- [Examples](#examples)



# Features



<!-- ### Lambda authorizers
You can define lambda authorizers with the contexts they provide and assign them to endpoints in your `turbospec.ts`. The implementation of the business code for the defined authorizers is as easy and aided as that of the endpoint lambdas. -->

### Automatic creation of boilerplate
Simply define the fundamental structure of your API and turbogate will generate boileplate for all endpoints and authorizers. You only have to fill in the gaps (lambda business code and data structures).

### Automatic creation and wiring of all required AWS constructs
Once you filled the gaps in the boilerplate you are done. Everything else is automatically generated and wired up during cdk synth. Of cause you can pass in custom configurations for lambdas, lambda integrations, api gateway etc.

### Automatic prevalidation
All contextual data your business code needs (request, environment data, authorizer context) is automatically parsed and prevalidated at runtime using [Zod](https://github.com/colinhacks/zod). This way you can use it strongly typed in your business code without writing validation logic over and over again.

### Automatic OpenAPI 3.1 spec generation
Generate complete OpenAPI 3.1 spec from your API. Turbogate uses [zod-to-open-api](https://github.com/asteasolutions/zod-to-openapi) under the hood to gather information regarding request and response data and automatically combines those with all information regarding paths, authorizers and some additional metadata. The result is a concise OpenAPI spec that is suitable to generate developer documentation pages or SDKs/clients.


### DRY declaration and defintion of environment data and permissions
Define all needed lambda environment variables and permissions once and attach them to lambdas IoC style. No more `myDynamoTable.grantRead(...)` a dozen times in your IaC code.

### Maximum adaptability
Turbogate was developed with the modern TypeScript developer in mind. It (mostly) follows a functional approach instead of using classes. The code that defines an endpoint or authorizer is generated as fully adapatable boilerplate for you along with some recommdendations on what to look out for if you want to change it. This means while you of cause can use turbogate in full auto pilot to power code a 30+ endpoint API in a day you also could dive down deep into its mode of operation and precisely adjust most of it to your needs without having to change anything about the framework itself.



# Getting started
Assuming you use yarn. Adapt to your package manager if needed.

### Prerequisites
Turbogate heavily utizilizes [Zod](https://github.com/colinhacks/zod) to define and validate inbound, outbound and config data structures. You should at least have a basic understanding on how to use Zod.

It is also a good idea to have a look at [zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi) in case you want to make use of the OpenAPI spec generation feature. You do not need to set anything up, everything is wired up for you. But you should know the [`.openapi(...)`-method](https://github.com/asteasolutions/zod-to-openapi?tab=readme-ov-file#the-openapi-method)

The `moduleResolution` in your `tsconfig.json` needs to be set to `Node16` (or another supported strategy, see *Why?*). You need to set the `module` field accordingly (e.g. also `Node16`).
<details>
<summary>Why?</summary>

> Turbogate uses the [NodejsFunction construct](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html) that uses ESBuild to automatically transpile, bundle and minify the lambda handlers written in TS. Currently ESBuild will bundle all exports from an index files as soon as you import one export (see [here](https://github.com/evanw/esbuild/issues/1794)). So to not blow up the deployed lambdas to 10MB+ sizes due to bundling the complete CDK package (and others) due to importing some files from turbogate we need to expose two different entrypoints. One for use in the IaC code and one for the lambdas production code. To be able to do so we need the `exports` field in the `package.json` which TypeScript only understands when in certain module resolution strategies (see [here](https://stackoverflow.com/a/74485520)).


</details>

### 1. Installation
#### Adding packages
Turbogate has some dev peer dependencies. You most probably will already have most of them installed in a Typescript CDK project.

```bash
yarn add aws-cdk-lib ts-node @asteasolutions/zod-to-openapi @types/aws-lambda -D
```

Next, install the one runtime peer dependency Zod.

```bash
yarn add zod
```

Then install the main package:

```bash
yarn add turbogate
```

> [!IMPORTANT]
> When you setup a project with `cdk init` the default synth method is ts-node. ts-node struggles with mixed ESM and CommonJS modules. If you not already have switched to tsx in your CDK projec you should do that now. Else you might see something `SyntaxError: Unexpected token 'export'` during synth.

#### Adding wiring

Finally, in the entrypoint file of your CDK project (the file where the app is initialized and the stack constructors are called) add this import statement to the *very top* of the file: 
```ts
import { wireTurbogate } from 'turbogate/local'; // Keep at top of imports!
```
After your imports add this line:
```ts
wireTurbogate; // Do not remove
```
This will ensure necessary prototype adjustments to be made early enough so CDK does not trip over its own feet during synth ([example](https://github.com/koljagralla/turbogate-example/blob/master/bin/turbogate-example.ts)).


### 2. Initialization
Navigate to the directory you want the newly created API to reside in. Then run `yarn turbogate init my-api`. Of cause, replace the `my-api` with your API name.

```bash
cd lib/stacks/my-stack
yarn turbogate init my-api
```
A folder called `my-api-turbogate` containing a `turbospec.ts` file will be created ([example](https://github.com/koljagralla/turbogate-example/blob/master/lib/stacks/my-stack/my-api-turbogate/turbospec.ts)).

### 3. Declare endpoints and authorizers
The `turbospec.ts` contains some boilerplate for a basic API. Adapt to your needs.

> [!TIP]
> If you declare all your endpoints at once this will create a giant bulk commit as turbogate generates several files per endpoint. A good approach is to gradually add endpoints as you implement them. If you want to initially declare all of them you could do that and then comment out most of them until you want to implement them.

### 4. Generate boilerplate and entrypoint
Once you adapted your `turbospec.ts` file according to your needs, run:
```bash
cd my-api-turbogate
yarn turbogate build
```
This will create the boilerplate files for your defined authorizers ([example](https://github.com/koljagralla/turbogate-example/tree/master/lib/stacks/my-stack/my-api-turbogate/authorizer)) and endpoints ([example](https://github.com/koljagralla/turbogate-example/tree/master/lib/stacks/my-stack/my-api-turbogate/endpoints/items)) as well as the entrypoint `my-api-turbogate.ts` ([example](https://github.com/koljagralla/turbogate-example/blob/master/lib/stacks/my-stack/my-api-turbogate/my-api-turbogate.ts)) alongside some boilerplate config and response fragments.

Now, don't be scared. There are nine files per endpoint. This looks like a lot on first sight but the files are quite small and you will soon find that this allows for great overview when working on an endpoint after you spent some with turbogate.

Each generated file contains a header comment explaining its purpose, editability and regenrating behavior. You should take a few minutes to get familiar with those files.

> [!TIP]
> Turbogate offers two ways to organize your endpoints. `byResource` groups the endpoints in folders named after the first segment of the path of each endpoint. `allTogether` puts all endpoints together in one folder. The default (and recommended for APIs with more than a couple of endpoints) structure is `byResource`. You can choose by using the `--endpointStructure` option.

### 5. Fill the gaps on endpoints and authorizers
Now you need to adjust the generated boilerplate files for you endpoints and authorizers. For endpoints this means defining request and response as well as the business logic. For authorizers this means defining the context and the business logic. For both you can additionally define required environment variables, permissions and documentation. 


### 6. Add the turbogate to your IaC
To add your turbogate you app you need to create an instance of the generated `MyAppTurbogate` class within a stack of your application. You will find that the constructor requires you to hand in values for all environment variables declared on your endpoints and authorizers. Additionally, you need to provide hooks that grant the defined permissions. Again, this is quite inutuitive, just see the [example API](#examples).

### 7. Adding OpenAPI spec generation
To enable the generation of an OpenAPI 3.1 spec file just add and empty object to the `openapi` field of the params object in the constructor call of `MyAppTurbogate` that you set up in the previous step. Feel free to customize the generation by adding config values to this object.
When you now run a CDK synth the specfile will automatically be generated. However, there won't be much comments and examples. To add those you can [edit the root docs.ts file](#examples), [edit the docs.ts file of each endpoint](#examples) or [authorizer](#examples), [extend the Zod objects describing the request](#examples) and [the response](#examples). See the docs of [zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi) to learn more about the latter two.

### 8. Addind and removing endpoints and authorizers
To <ins>add an endpoint or authorizer</ins> just add in your `turbospec.ts` and rerun the `turbogate build` command (see step 4).

To <ins>remove an endpoint</ins> remove it in your `turbospec.ts` and rerun the `turbogate build` command (see step 3). Additionally, delete its respective folder. If your endpoint declared unique environment values or permissions that are orphaned now you might also need to remove those values from the constructor arguments of your turbogate.

To <ins>remove an authorizer</ins> remove it in your `turbospec.ts` (delcaration of the authorizer itself and all references by endpoints), delete all `authorizer.ts` files of endpoints that used that authorizer and rerun the `turbogate build` command (see step 4). Additionally, delete its respective folder. If your authorizer declared unique environment values or permissions that are orphaned now you might also need to remove those values from the constructor arguments of your turbogate. Also, since you authorizer context probably changed you might need to tidy up the the business code in the `main.ts` files of the formerly protected endpoints.

> [!NOTE]
> Automatic removal of endpoints and authorizers that are not longer present in the `turbospec.ts` file is part of the [roadmap](#roadmap).


# Patterns and recommended conventions
### Working with constructs created by turbogate
The instance of the turbogate entrypoint class you created in you IaC code exposes the majority of the constructs (API GW,API GW resources, endpoint lambdas, authorizer lambdass, authorizer request authorizers) it dynamically creates during synth as well typed instance variables. This way you can freely customize and extend your turbogate.

Remember: If you need to add custom configs to the constructs that can not be applied post creation, turbogate exposes `config.ts` files for each endpoint, authorizer and the API GW itself which you can use to inject construct configs.

> [!TIP]
> In case you want to add a completely custom implementation to a path in your API: Turbogate allows you to specify a path without any methods in your `turbospec.ts` file. This path will be picked up and API GW resources will be created and exposed.

### No more `cd`
The CLI command offers a `--root`/`-r` option that allows you to pass in the target directory.
Add an entry in the `scripts` section of your `package.json` to quickly run a turbogate build from everywhere.
```json
"scripts": {
	"tgb-myapi": "yarn turbogate build -r lib/stacks/my-stack/my-api-turbogate"
}
```

### Code formatting
The boilerplate code files already come formatted in quite common standards. The dynamically generated entrypoint file is currently not perfecly fomatted. To ensure your codebase always adheres to your projects formatting conventions it is a good idea to append a formatting command for your whole turbogate API directory to your build script.
```json
"scripts": {
	"tgb-myapi": "yarn turbogate build -r lib/stacks/my-stack/my-api-turbogate & prettier lib/stacks/my-stack/my-api-turbogate -w"
}
```

### Naming convention recommendation
Do whatever you like but these naming convetions for environment variable and permission names seem to work pretty well.

<ins>Environment variable names</ins>: Screaming snake case, resource name followed by property name, e.g. `MY_TABLE_NAME` or `MY_SECRET_ARN`.

<ins>Permission names</ins>: Screaming snake case, resource name followed by grant name, e.g. `MY_TABLE_READ` or `MY_SECRET_READ`.



# Roadmap
* ~~Adding the possibility to generate complete and verbosely documented OpenAPI spec files from the turbogate defintion.~~ ✅
* Automate removal of endpoints and authorizers (treeshaking).
* Rename permissions to hooks. Sometimes you need to interact with a lambda after its constructs creation in a way that is not adding any permissions. Therefore the name hooks seems better suited.

  
Feel free to suggest changes or new features by opening an issue.

# Examples
A full example repo will be added soon and the respective hyperlinks will be updated.
