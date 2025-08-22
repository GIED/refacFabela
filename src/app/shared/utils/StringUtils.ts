export class StringUtils {
    static EMPTY = '';
  
    static concatParams(params: Map<string, any>): string {
      let concats = '?';
      if (params.size <= 0) return this.EMPTY;
      params.forEach((val, key) => {
        concats = concats.concat(key).concat('=').concat(val).concat('&');
      })
      return concats.endsWith('&') ? concats.substr(0, concats.length - 1) : concats;
    }
  
    public static isBlank(str: string | null | undefined): boolean {
      return str === null || str === undefined || /^( )+$/.test(str);
    }
  
    public static isNotBlank(str: string | null | undefined): boolean {
      return !StringUtils.isBlank(str);
    }
  
    public static isEmpty(str: string | null | undefined): boolean {
      return str === null || str === undefined;
    }
  
    public static isNotEmpty(str: string | null | undefined): boolean {
      return !StringUtils.isEmpty(str);
    }
  
    static concatArrayParams(key:string, vals:string[]): string {
      let concats = '?';
      if (vals.length <= 0) return this.EMPTY;
      vals.forEach((val) => {
        concats = concats.concat(key).concat('=').concat(val).concat('&');
      })
      return concats.endsWith('&') ? concats.substr(0, concats.length - 1) : concats;
    }
    
  }
  