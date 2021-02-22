declare module "endent" {
  function endent(literals: string): string;
  function endent(
    literals: TemplateStringsArray,
    ...placeholders: any[]
  ): string;

  export = endent;
}
