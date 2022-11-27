// import original module declarations
import "styled-components";
import { StringMappingType } from "typescript";

// and extend them!
declare module "styled-components" {
  export interface BackupTheme {
    textColor: string;
    bgColor: string;
    btnColor: string;
    backgroundColor?: string;
  }
}
