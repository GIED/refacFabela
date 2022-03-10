export class ObjectUtils {
    public static isEmpty(str: any | null | undefined): boolean {
      return str === null || str === undefined;
    }
  
    public static isNotEmpty(str: any | null | undefined): boolean {
      return !ObjectUtils.isEmpty(str);
    }
  }