# Shadcn CLI JSON Schema

## Example:

```json
{
  "name": "lyrix_card_component",
  "type": "registry:block",
  "dependencies": [
    "@emotion/react",
    "react-icons",
    "bouzidanas/react-use-precision-timer",
    "uuid"
  ],
  "devDependencies": [],
  "registryDependencies": [],
  "files": [
    {
      "path": "LyrixCard.tsx",
      "content": "Code goes here. Note that to escape backslashes in the content, you need to double them up. For example, to include a backslash in the content, you would need to write \\ in the content. To escape quotes, you can use the backslash as well. For example, to include a double quote in the content, you would need to write \" in the content.",
      "type": "registry:component"
    },
    {
      "path": "Lyrix.tsx",
      "content": "It seems that begining comments are removed when code is transferred into the final component. For example, Nextjs directives like 'use client' and 'use server' are removed and pragma like /** @jsxImportSource @emotion/react */ are also removed.",
      "type": "registry:component"
    },
    {
      "path": "processLRC.ts",
      "content": "Code goes here",
      "type": "registry:lib"
    }
  ],
  "tailwind": {},
  "cssVars": {},
  "meta": {
    "importSpecifier": "LyrixCard",
    "moduleSpecifier": "@/components/LyrixCard",
    "nextVersion": "14.2.16"
  },
  "docs": "Placeholder for LyrixCard component"
}
```
List of properties:
- name (string): The name of the component.
- type (string): The type of the component. Possible values are:
  - registry:style
  - registry:lib
  - registry:example
  - registry:block
  - registry:component
  - registry:ui
  - registry:hook
  - registry:theme
  - registry:page
- dependencies (array): An array of dependencies.
- devDependencies (array): An array of devDependencies.
- registryDependencies (array): An array of registryDependencies. Registry dependencies are dependencies that are not available on npm but are available on the registry.
- files (array): An array of files. Each file object has the following properties:
  - path (string): The path of the file. The path should be relative to the directory corresponding to the component type. For example, if the component type is registry:component, the path should be relative to the components directory.
  - content (string): The content of the file. This is the actual code that will be written to the file. Note that to escape backslashes in the content, you need to double them up. For example, to include a backslash in the content, you would need to write \\ in the content. To escape quotes, you can use the backslash as well. For example, to include a double quote in the content, you would need to write \" in the content. Also, it seems that begining comments are removed when code is transferred into the final component. For example, Nextjs directives like 'use client' and 'use server' are removed and pragma like /** @jsxImportSource @emotion/react */ are also removed.
  - type (string): The type of the file. Possible values are:
    - registry:style (for CSS files)
    - registry:lib  (for library/util files)
    - registry:example (for example files)
    - registry:block (for block files)
    - registry:component (for component files)
    - registry:ui (for UI files)
    - registry:hook (for hook files)
    - registry:theme (for theme files)
    - registry:page (for page files)
- tailwind (object): An object containing tailwind configuration.
- cssVars (object): An object containing CSS variables.
- meta (object): An object containing meta information about the component. The object has the following properties:
  - importSpecifier (string): The import specifier of the component. This is the name that will be used to import the component in other files.
  - moduleSpecifier (string): The module specifier of the component. This is the path that will be used to import the component in other files.
  - nextVersion (string): The next version of the component.
- docs (string): The documentation of the component.

## Notes:

Illustration of meta object:
```json
"meta": {
  "importSpecifier": "LyrixCard",
  "moduleSpecifier": "@/components/LyrixCard",
  "nextVersion": "14.2.16"
}
```
This corresponds to the following import statement:
```javascript
import { LyrixCard } from "@/components/LyrixCard";
```
So the meta attribute determines how the component will be imported in other files ie what the import statement for the component will look like.
