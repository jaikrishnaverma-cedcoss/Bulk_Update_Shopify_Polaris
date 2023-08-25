import { Text } from '@shopify/polaris';
import React, { memo, useContext } from 'react';
import { MyContext } from '../../dataset/MyContext';
import { isActiveCell } from '../../utility/globalFunctions';
import { colPropType, productsTypes } from '../../Types/types';
interface propsType extends colPropType {
  item: productsTypes;
  columnName: string;
  keyName: string;
}
const UniversalTextCol = (props: propsType) => {
  const { item, columnName, keyName, changeValUi } = props;
  const {
    centralState: { editActive },
    makeEditActive,
  } = useContext(MyContext);

  const changeHandler = (val: string) => {
    changeValUi(val, keyName);
  };

  if (isActiveCell(item.id, columnName, editActive))
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          makeEditActive(item.id, columnName);
        }}
        className="full_cover"
        key={item.id + '_' + keyName + columnName}
      >
        <div>
          <input
            className="custom_input"
            style={{
              textAlign: 'end',
            }}
            value={item[keyName]}
            onChange={(e) => changeHandler(e.target.value)}
            autoFocus
          />
        </div>
      </div>
    );

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        makeEditActive(item.id, columnName);
      }}
    >
      <Text as="p" alignment="end">
        {item[keyName]}
      </Text>
    </div>
  );
};

export default memo(UniversalTextCol);
