import { Badge, Checkbox } from '@shopify/polaris';
import React, { memo, useContext } from 'react';
import { MyContext } from '../../dataset/MyContext';
import { productsTypes } from '../../Types/types';
interface propsType {
  item: productsTypes;
  columnName: string;
  onClicked: () => void;
  checked: boolean;
}

const UniversalCheckCol = ({
  item,
  columnName,
  onClicked,
  checked,
}: propsType) => {
  const { makeEditActive } = useContext(MyContext);

  if (item.Title === '') return <Badge></Badge>;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        makeEditActive(item.id, columnName);
      }}
      className="full_cover"
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <Checkbox label={false} checked={checked} onChange={onClicked} />
    </div>
  );
};

export default memo(UniversalCheckCol);
