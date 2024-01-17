export type OpenAPIProps = {
  /**
   * The directory where to place the output YAML, relative to the project root.
   *
   * @default The APIs root directory
   */
  outputDirectory?: string;

  /**
   * The name of the output file.
   *
   * @default openapi.yaml
   */
  fileName?: string;
};
