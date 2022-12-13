// import original module declarations
import "styled-components";
import { StringMappingType } from "typescript";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    boardColor: string;
    cardColor: string;
  }
}
