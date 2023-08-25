import {
  IndexTable,
  Loading,
  LegacyCard,
  useIndexResourceState,
  Text,
  Badge,
  Thumbnail,
} from '@shopify/polaris';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { MyContext } from '../dataset/MyContext';
import { HeadingFormat } from '../utility/globalFunctions';
import { useNavigate } from 'react-router-dom';
import { initialTypes } from '../Types/types';
export function Home() {
  const { centralState, setCentralState } = useContext(MyContext);

  const resourceName = {
    singular: 'product',
    plural: 'products',
  };
  const products = useMemo(
    () => JSON.parse(centralState.persistProducts),
    [centralState.persistProducts]
  );
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const promotedBulkActions = [
    {
      content: 'Bulk edit',
      onAction: () => {
        setCentralState((prev: initialTypes) => {
          return {
            ...prev,
            selected: selectedResources,
          };
        });
        navigate('../bulk_update');
      },
    },
    {
      content: 'Feature 1',
      onAction: () => console.log('Todo: implement bulk Feature 1'),
    },
    {
      content: 'Feature 2',
      onAction: () => console.log('Todo: implement bulk Feature 2'),
    },
  ];
  const bulkActions = [
    {
      content: 'Feature 1',
      onAction: () => console.log('Todo: implement bulk Feature 1'),
    },
    {
      content: 'Feature 2',
      onAction: () => console.log('Todo: implement bulk Feature 2'),
    },
    {
      content: 'Feature 3',
      onAction: () => console.log('Todo: implement bulk Feature 3'),
    },
  ];
  useEffect(() => {
    setCentralState((prev: initialTypes) => {
      return {
        ...prev,
        products: JSON.parse(prev.persistProducts),
        selected: [],
        saveEnable: false,
      };
    });
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);
  const itemStatus = (status: string) => {
    if (status === 'active')
      return <Badge status="success">{HeadingFormat(status)}</Badge>;
    else if (status === 'draft')
      return <Badge status="info">{HeadingFormat(status)}</Badge>;
    else return <Badge>Archived</Badge>;
  };
  const inventoryColumn = (str: string, item: any) => {
    if (str)
      return (
        <Text as="p" color="critical">
          {item['Variant Inventory Qty']} in stock
        </Text>
      );
    return (
      <Text as="p" color="subdued">
        {str ? [] : 'Inventory not tracked'}
      </Text>
    );
  };
  const markets = (included: any) => {
    if (included)
      return Object.entries(included).map(([key, val], index) => {
        return val;
      }).length;
    return '';
  };
  const rowMarkup = products
    .filter((item: any) => item.Title)
    .map((item: any, index: number) => (
      <IndexTable.Row
        id={item.id}
        key={item.id}
        selected={selectedResources.includes(item.id)}
        position={index}
      >
        <IndexTable.Cell>
          <Thumbnail
            key={item.id}
            size="small"
            source={item['Image Src']}
            alt="Black choker necklace"
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {item.Title}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{itemStatus(item.Status)}</IndexTable.Cell>
        <IndexTable.Cell>
          {inventoryColumn(item['Variant Inventory Tracker'], item)}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="p" alignment="end">
            {markets(item['Included'])}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="p" alignment="end">
            {markets(item['Included'])}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{item.Type}</IndexTable.Cell>
        <IndexTable.Cell>{item.Vendor}</IndexTable.Cell>
      </IndexTable.Row>
    ));
  if (loading) return <Loading />;

  return (
    <LegacyCard>
      <IndexTable
        resourceName={resourceName}
        itemCount={products.length}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          {
            title: '',
          },
          {
            title: 'Products',
          },
          {
            title: 'Status',
          },
          {
            title: 'Inventory',
          },
          {
            title: 'Sales channels',
          },
          {
            title: 'Markets',
          },
          {
            title: 'Type',
          },
          {
            title: 'Vendor',
          },
        ]}
        bulkActions={bulkActions}
        promotedBulkActions={promotedBulkActions}
      >
        {rowMarkup}
      </IndexTable>
    </LegacyCard>
  );
}
