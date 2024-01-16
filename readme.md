# Turbogate <!-- omit in toc -->

Turbogate is a micro framework and code generator aimed at building truly serverless, well validated, well documeted REST APIs using AWS CDK TypeScript in turbo speed.

**No more...**

* ...manual and repetitive creation and wiring of constructs such as API gateways, API gateway resources,  lambdas, lambda integrations, lambda authorizers etc.
* ...tediously writing request validation boilerplate.
* ...several hundred lines of code to grant the same permissions and pass in the same environment values over and over again.

Simply <ins>no more spending and hour for an endpoint</ins> that would take minutes in classic server-based environments <ins>while still building truly serverless.</ins>


- [Features](#features)
    - [Automatic prevalidation](#automatic-prevalidation)
    - [Lambda authorizers](#lambda-authorizers)
    - [Automatic creation of boilerplate](#automatic-creation-of-boilerplate)
    - [Automatic creation of all required AWS constructs](#automatic-creation-of-all-required-aws-constructs)
    - [DRY declaration and defintion of environment data and permissions](#dry-declaration-and-defintion-of-environment-data-and-permissions)
    - [Maximum adaptability](#maximum-adaptability)
- [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [1. Installation](#1-installation)
    - [2. Initialization](#2-initialization)
    - [3. Declare endpoints and authorizers](#3-declare-endpoints-and-authorizers)
    - [4. Generate boilerplate and entrypoint](#4-generate-boilerplate-and-entrypoint)
    - [5. Fill the gaps on endpoints and authorizers](#5-fill-the-gaps-on-endpoints-and-authorizers)
    - [6. Add the turbogate to your IaC](#6-add-the-turbogate-to-your-iac)
    - [7. Addind and removing endpoints and authorizers](#7-addind-and-removing-endpoints-and-authorizers)
- [Patterns and recommended conventions](#patterns-and-recommended-conventions)
    - [Working with constructs created by turbogate](#working-with-constructs-created-by-turbogate)
    - [No more `cd`](#no-more-cd)
    - [Code formatting](#code-formatting)
    - [Naming convention recommendation](#naming-convention-recommendation)
- [Roadmap](#roadmap)


# Features

### Automatic prevalidation
Requests, environment data and authorizer context are automatically parsed and prevalidated using [Zod](https://github.com/colinhacks/zod). You define the expected data structure for the request (headers, body, path, query), the authorizer payload (the data a lambda authorizer can pass to the endpoints lambda it protects) and the environment data (e.g. for passing in resource names). At runtime those zod types are used to parse the defined data and make it available strongly typed in your business code.

### Lambda authorizers
You can define lambda authorizers with the contexts they provide and assign them to endpoints in your `turbospec.ts`. The implementation of the business code for the defined authorizers is as easy and aided as that of the endpoint lambdas.

### Automatic creation of boilerplate
Once you have defined the structure of your API in your `turbospec.ts` turbogate will generate boileplate for all endpoints and authorizers. You only have to fill in the gaps (lambda business code and data structures).

### Automatic creation of all required AWS constructs
Once you filled the gaps in the boilerplate you are done. Everything else is automatically generated and wired up during cdk synth. Of cause you can pass in custom configurations for lambdas, lambda integrations, api gateway etc.


### DRY declaration and defintion of environment data and permissions
You can define the required environment data and permissions for each lambda (endpoint and authorizer). The defined values will be dynamically picked up by TypeScript and you can pass in those values in your stack definition utilizing previously created constructs. Need one value or permission more than once? Simply name them the same. Turbogate will consolidate the initialization of those values automatically.

### Maximum adaptability
Turbogate was developed with the modern TypeScript developer in mind. It (mostly) follows a functional approach instead of using classes. The code that defines and endpoint or authorizer is generated as fully adapatable boilerplate for you along with some recommdendations on what to look out for if you want to change it. This means while you of cause can use turbogate in full auto pilot to power code a 30+ endpoint API in a day you also could dive down deep into its mode of operation and precisely adjust most of it to your needs without having to change anything about the framework itself.

# Getting started
Assuming you use yarn. Adapt to your package manager if needed.

### Prerequisites
Turbogate heavily utizilizes [Zod](https://github.com/colinhacks/zod) to define and validate inbound, outbound and config data structures. You should at least have a basic understanding on how to use Zod.

### 1. Installation
Turbogate has three runtime dependencies which you most probably will already have installed in a Typescript CDK project[^1].

```bash
yarn add aws-cdk-lib ts-node zod
```

Then install the main package:

```bash
yarn add koljagralla/turbogate
```

### 2. Initialization
Navigate to the directory you want the newly created API to reside in. Then run `yarn turbogate init my-api`. Of cause, replace the `my-api` with your API name.

```bash
cd src/stack/my-stack
yarn turbogate init my-api
```
A folder called `my-api` containing a `turbospec.ts` file will be created. 

### 3. Declare endpoints and authorizers
The `turbospec.ts` contains some boilerplate for a basic API. Adapt to your needs.

> [!TIP]
> If you declare all your endpoints at once this will create a giant bulk commit as turbogate generates several files per endpoint. A good approach is to gradually add endpoints as you implement them. If you want to initially declare all of them you could do that and then comment out most of them until you want to implement them.

### 4. Generate boilerplate and entrypoint
Once you adapted your `turbospec.ts` file according to your needs, run:
```bash
cd my-api
yarn turbogate build
```
This will create the boilerplate files for your defined authorizers and endpoints as well as the entrypoint (`my-api-turbogate.ts`) alongside some boilerplate config and response fragments.

Now, don't be scared. There are six files per endpoint. This looks like a lot on first sight but the files are quite small and you will soon find that this allows for great overview when working on an endpoint after you spent some with turbogate.

Each generated file contains a header comment explaining its purpose, editability and regenrating behavior. You should take a few minutes to get familiar with those files.

> [!TIP]
> Turbogate offers two ways to organize your endpoints. `byResource` groups the endpoints in folders named after the first segment of the path of each endpoint. `allTogether` puts all endpoints together in one folder. The default (and recommended for APIs with more than a couple of endpoints) structure is `byResource`. You can choose by using the `--endpointStructure` option.

### 5. Fill the gaps on endpoints and authorizers
Now you need to adjust the generated boilerplate files for you endpoints and authorizers. This is too intuitive and easy to bore you with a detailed step-by-step instruction. Just see the [example API]() and try for yourself. 

### 6. Add the turbogate to your IaC
To add your turbogate you app you need to create an instance of the generated `MyAppTurbogate` class within a stack of your application. You will find that the constructor requires you to hand in values for all environment variables declared on your endpoints and authorizers. Additionally, you need to provide hooks that grant the defined permissions. Again, this is quite inutuitive, just see the [example API]().

### 7. Addind and removing endpoints and authorizers
To <ins>add an endpoint or authorizer</ins> just add in your `turbospec.ts` and rerun the `turbogate build` command (see step 4).

To <ins>remove an endpoint</ins> remove it in your `turbospec.ts` and rerun the `turbogate build` command (see step 3). Additionally, delete its respective folder. If your endpoint declared unique environment values or permissions that are orphaned now you might also need to remove those values from the constructor arguments of your turbogate.

To <ins>remove an authorizer</ins> remove it in your `turbospec.ts` (delcaration of the authorizer itself and all references by endpoints), delete all `authorizer.ts` files of endpoints that used that authorizer and rerun the `turbogate build` command (see step 4). Additionally, delete its respective folder. If your authorizer declared unique environment values or permissions that are orphaned now you might also need to remove those values from the constructor arguments of your turbogate. Also, since you authorizer context probably changed you might need to tidy up the the business code in the `main.ts` files of the formerly protected endpoints.

[^1]: In case something does not work properly, ensure that your installed versions have no breaking changes with the versions specified in the package.json.

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
	"tgb-myapi": "yarn turbogate build -r src/stacks/my-stack/my-api"
}
```

### Code formatting
The boilerplate code files already come formatted in quite common standards. The dynamically generated entrypoint file is currently not perfecly fomatted. To ensure your codebase always adheres to your projects formatting conventions it is a good idea to append a formatting command for your whole turbogate API directory to your build script.
```json
"scripts": {
	"tgb-myapi": "yarn turbogate build -r src/stacks/my-stack/my-api & prettier src/stacks/my-stack/my-api -w"
}
```

### Naming convention recommendation
Do whatever you like but these naming convetions for environment variable and permission names seem to work pretty well.

<ins>Environment variable names</ins>: Screaming snake case, resource name followed by property name, e.g. `MY_TABLE_NAME` or `MY_SECRET_ARN`.

<ins>Permission names</ins>: Screaming snake case, resource name followed by grant name, e.g. `MY_TABLE_READ` or `MY_SECRET_READ`.



# Roadmap
* Adding the possibility to generate complete and verbosely documented OpenAPI spec files from the turbogate defintion.
* Automate removal of endpoints and authorizers (treeshaking).
* Rename permissions to hooks. Sometimes you need to interact with a lambda after its constructs creation in a way that is not adding any permissions. Therefore the name hooks seems better suited.

  
Feel free to suggest changes or new features by opening an issue.