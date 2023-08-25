import {
  Badge,
  HorizontalGrid,
  HorizontalStack,
  Text,
  Thumbnail,
} from '@shopify/polaris';
import React, { memo, useContext } from 'react';
import { MyContext } from '../../dataset/MyContext';
import { isActiveCell } from '../../utility/globalFunctions';
import { colPropType } from '../../Types/types';

const TitleCol = (props: colPropType) => {
  const { item, changeValUi } = props;
  const {
    centralState: { editActive },
    makeEditActive,
  } = useContext(MyContext);

  const changeHandler = (val: string) => {
    changeValUi(val, 'Title');
  };

  if (item.Title === '') {
    const show = item['Option1 Value'] ? (
      item['Option1 Value']
    ) : (
      <Badge></Badge>
    );

    return (
      <Text as="p" variant="bodySm" color="subdued" alignment="center">
        {show}
      </Text>
    );
  }

  if (isActiveCell(item.id, 'Product title', editActive))
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          makeEditActive(item.id, 'Product title');
        }}
        className="full_cover"
      >
        <HorizontalStack gap={'2'} wrap={false}>
          <Thumbnail
            key={item.id}
            size="extraSmall"
            source={item['Image Src']}
            alt="Black choker necklace"
          />
          <div>
            <input
              className="custom_input"
              value={item.Title}
              onChange={(e) => changeHandler(e.target.value)}
              autoFocus
            />
          </div>
        </HorizontalStack>
      </div>
    );

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        makeEditActive(item.id, 'Product title');
      }}
    >
      <HorizontalStack gap={'3'} wrap={false}>
        <Thumbnail
          key={item.id}
          size="extraSmall"
          source={item['Image Src']}
          alt={item.Title}
        />
        <HorizontalGrid alignItems="center">{item.Title}</HorizontalGrid>
      </HorizontalStack>
    </div>
  );
};

export default memo(TitleCol);
