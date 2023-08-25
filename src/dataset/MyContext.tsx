import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Frame } from '@shopify/polaris';
import { noRef } from '../utility/globalFunctions';
import { initialState } from './initialData';
import { initialTypes, productsTypes } from '../Types/types';
const inititalContext = {
  centralState: initialState,
  setCentralState: (val: (state: initialTypes) => void) => {},
  makeEditActive: (id: number, key: string) => {},
  saveUpdates: () => {},
  changeVal: (val: any, id: number, key: string) => {},
};
/**
 * creatin a contex for single place storage of states
 */
export const MyContext = createContext(inititalContext);
const localKey = 'Bulk_edit_shopify_v01';
export const ContextWraper = (props: any) => {
  const [centralState, setCentralState] = useState(noRef(initialState));

  // take data from localstorage if exist
  useEffect(() => {
    const data = localStorage.getItem(localKey);
    if (data) setCentralState({ ...JSON.parse(data) });
  }, []);

  //set data in local storage
  useEffect(() => {
    if (JSON.stringify(initialState) !== JSON.stringify(centralState))
      localStorage.setItem(localKey, JSON.stringify(centralState));
  }, [centralState]);

  /**
   * save change done on bulk update
   */
  const saveUpdates = useCallback(() => {
    setCentralState((prev: initialTypes) => {
      return {
        ...prev,
        persistProducts: JSON.stringify(prev.products),
        editActive: '',
        products: [...prev.products],
      };
    });
  }, []);

  /**
   * store a slug to target which cell is active
   */
  const makeEditActive = useCallback((id: number, key: string) => {
    setCentralState((prev: initialTypes) => {
      prev.editActive = id + '_' + key;
      return {
        ...prev,
      };
    });
  }, []);

  /**
   * by this can change value of any column of rows
   */
  const changeVal = useCallback((val: any, id: number, key: string) => {
    const index = centralState.products.findIndex(
      (item: productsTypes) => item.id === id
    );
    if (index !== -1) {
      setCentralState((prev: initialTypes) => {
        prev.products[index][key] = val;
        return prev;
      });
    }
  }, []);

  const value = useMemo(() => {
    return {
      centralState,
      setCentralState,
      makeEditActive,
      saveUpdates,
      changeVal,
    };
  }, [centralState, setCentralState, makeEditActive, saveUpdates, changeVal]);
  return (
    <MyContext.Provider value={value}>
      <Frame>{props.children}</Frame>
    </MyContext.Provider>
  );
};
