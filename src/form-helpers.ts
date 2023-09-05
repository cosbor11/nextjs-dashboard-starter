export const objectKeysAreEquivalant = (obj1: any, obj2: any): boolean => {
    const keysToCompare = Object.keys(obj1);

    for (const key of keysToCompare) {
        const value1 = obj1[key];
        const value2 = obj2[key];

        // Convert values to a common "equivalent" value
        const equivalentValue1 = value1 === undefined || value1 === "" || value1 === false ? null : value1;
        const equivalentValue2 = value2 === undefined || value2 === "" || value2 === false ? null : value2;

        if (equivalentValue1 !== equivalentValue2) {
            return false;
        }
    }

    return true;
};

export const deepMerge = (defaultObj: any, sourceObj: any) => {
    const output = Object.assign({}, defaultObj);
    if (isObject(defaultObj) && isObject(sourceObj)) {
      Object.keys(sourceObj).forEach(key => {
        if (isObject(sourceObj[key])) {
          if (!(key in defaultObj))
            Object.assign(output, { [key]: sourceObj[key] });
          else
            output[key] = deepMerge(defaultObj[key], sourceObj[key]);
        } else {
          Object.assign(output, { [key]: sourceObj[key] });
        }
      });
    }
    return output;
  };

  export const isObject = (item: any) => {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  export const camelToTitleCase = (camelCase: string) => {
    const words = camelCase.split(/(?=[A-Z])/);
    const titleCase = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    return titleCase;
  };

  export const camelToKebabCase = (str: string) => {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  };