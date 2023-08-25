/**
 * remove all refrence from all nesting and make deep copy
 * @param initial variable that has nested refrence 
 * @returns deep copy 
 */
export const noRef = (initial: any) => {
  return JSON.parse(JSON.stringify(initial));
};

/**
 * 
 * @param key string 
 * @returns Title case string
 */
export const HeadingFormat = (key: string) => {
  if (key && typeof key == "string")
    return key
      .split("_")
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(" ");
  return key;
};

/**
 * 
 * @param id row id
 * @param key column key
 * @param editActive currently active slug
 * @returns true|false based on match
 */
export const isActiveCell = (id: number, key: string, editActive: any) => {
  return id + "_" + key === editActive;
};
