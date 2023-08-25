import {
  ActionList,
  Badge,
  Button,
  HorizontalGrid,
  Popover,
} from '@shopify/polaris';
import React, { memo, useCallback, useContext, useState } from 'react';
import { HeadingFormat } from '../../utility/globalFunctions';
import { SortAscendingMajor } from '@shopify/polaris-icons';
import { MyContext } from '../../dataset/MyContext';
import { productsTypes } from '../../Types/types';
interface propsType {
  item: productsTypes;
  changeValUi: (val1: any, val2: string) => any;
}

const StatusCol = ({ item, changeValUi }: propsType) => {
  const [popoverActive, setPopoverActive] = useState(false);
  const { makeEditActive } = useContext(MyContext);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  if (item.Title === '') return <Badge></Badge>;

  const myBadge = (status: string) => {
    if (status === 'active')
      return <Badge status="success">{HeadingFormat(status)}</Badge>;
    else if (status === 'draft')
      return <Badge status="info">{HeadingFormat(status)}</Badge>;
    else return <Badge>Archived</Badge>;
  };

  const changeAction = (ele: string) => {
    togglePopoverActive();
    changeValUi(ele.toLowerCase(), 'Status');
  };

  const activator = (
    <HorizontalGrid gap="1" columns={2}>
      <div> {myBadge(item.Status)}</div>
      <Button
        onClick={togglePopoverActive}
        plain
        icon={SortAscendingMajor}
      ></Button>
    </HorizontalGrid>
  );

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        makeEditActive(item.id, 'Status');
      }}
      className="full_cover"
    >
      <Popover
        active={popoverActive}
        activator={activator}
        autofocusTarget="first-node"
        onClose={togglePopoverActive}
      >
        <ActionList
          actionRole="menuitem"
          items={['Active', 'Archived', 'Draft'].map((ele: string) => {
            return {
              content: ele,
              active: item.Status === ele.toLowerCase(),
              onAction: () => changeAction(ele),
            };
          })}
        />
      </Popover>
    </div>
  );
};

export default memo(StatusCol);
