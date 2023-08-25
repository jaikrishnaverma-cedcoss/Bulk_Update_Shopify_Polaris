import { IndexTable, Divider, Loading } from '@shopify/polaris';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { MyContext } from '../dataset/MyContext';
import { noRef } from '../utility/globalFunctions';
import { HeaderFull } from './HeaderFull';
import TitleCol from './EditableColumns/TitleCol';
import TagCol from './EditableColumns/TagCol';
import { initialTypes, productsTypes } from '../Types/types';
import StatusCol from './EditableColumns/StatusCol';
import UniversalCol from './EditableColumns/UniversalCol';
import UniversalCheckBox from './EditableColumns/UniversalCheckBox';
import UniversalTextCol from './EditableColumns/UniversalTextCol';
const resourceName = {
  singular: 'product',
  plural: 'products',
};

const IncludeVariants = (products: productsTypes[], selected: number[]) => {
  let temp = products
    .filter((item: productsTypes) => selected.includes(item.id))
    .map((item: any) => item.Handle);
  temp = noRef(products).filter((item: productsTypes) =>
    temp.includes(item.Handle)
  );
  return temp;
};
const initialHeadings = [
  {
    title: 'Tags',
    visible: true,
  },
  {
    title: 'Status',
    visible: true,
  },
  {
    title: 'Product type',
    visible: true,
  },
  {
    title: 'Vendor',
    visible: true,
  },
  {
    title: 'Primary market',
    visible: true,
  },
  {
    title: 'International market',
    visible: true,
  },
  {
    title: 'Base price',
    visible: true,
  },
  {
    title: 'Compare-at price',
    visible: true,
  },
  {
    title: 'Charges taxes',
    visible: true,
  },
  {
    title: 'Require shipping',
    visible: true,
  },
];
const BulkUpdate = () => {
  let {
    centralState: { products, selected },
  } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const [headings, setHeadings] = useState(noRef(initialHeadings));
  const myProducts = IncludeVariants(products, selected);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);
  if (loading) return <Loading />;
  return (
    <div className="excel_view">
      <HeaderFull headings={headings} setHeadings={setHeadings} />
      <Divider />

      <IndexTable
        resourceName={resourceName}
        itemCount={myProducts.length}
        selectable={false}
        headings={[
          { title: 'Product title', alignment: 'start' },
          ...headings
            .filter((item: any) => item.visible)
            .map((ele: any) => {
              return {
                title: ele.title,
              };
            }),
        ]}
      >
        {myProducts.map((item: any, index: number) => (
          <Items key={item.id + 'bi=ulk'} index={item.id} headings={headings} />
        ))}
      </IndexTable>
    </div>
  );
};

export default BulkUpdate;

export const Items = ({ index, headings }: any) => {
  let {
    centralState: { products, editActive },
    changeVal,
    setCentralState,
  } = useContext(MyContext);
  const [item, setItem] = useState(noRef(products[index]));
  const changeValUi = useCallback(
    (val: any, key: string) => {
      setItem((prev: any) => {
        prev[key] = val;
        return { ...prev };
      });
      return changeVal(val, item.id, key);
    },
    [changeVal, item.id]
  );
  const onClickMarket = (key: string) => {
    setItem((prev: any) => {
      prev['Included'][key] = !prev['Included'][key];
      return { ...prev };
    });
    setCentralState((prev: initialTypes) => {
      prev.products[item.id]['Included'][key] =
        !prev.products[item.id]['Included'][key];
      return { ...prev, products: [...products] };
    });
  };
  const ToggleCheck = (key: string) => {
    setItem((prev: any) => {
      prev[key] = !prev[key];
      return { ...prev };
    });
    setCentralState((prev: initialTypes) => {
      prev.products[item.id][key] = !prev.products[item.id][key];
      return { ...prev, products: [...products] };
    });
  };
  const columns: any = (item: productsTypes) => {
    return {
      Tags: <TagCol item={item} changeValUi={changeValUi} />,
      Status: <StatusCol item={item} changeValUi={changeValUi} />,
      'Product type': (
        <UniversalCol
          item={item}
          columnName="Product type"
          keyName="Type"
          changeValUi={changeValUi}
        />
      ),
      Vendor: (
        <UniversalCol
          item={item}
          columnName="Vendor"
          keyName="Vendor"
          changeValUi={changeValUi}
        />
      ),
      'Primary market': (
        <UniversalCheckBox
          item={item}
          columnName="Primary market"
          checked={item['Included']['India']}
          onClicked={() => onClickMarket('India')}
        />
      ),
      'International market': (
        <UniversalCheckBox
          item={item}
          columnName="International market"
          checked={item['Included']['International']}
          onClicked={() => onClickMarket('International')}
        />
      ),
      'Charges taxes': (
        <UniversalCheckBox
          item={item}
          columnName="Charges taxes"
          checked={item['Variant Taxable']}
          onClicked={() => ToggleCheck('Variant Taxable')}
        />
      ),
      'Base price': (
        <UniversalTextCol
          changeValUi={changeValUi}
          item={item}
          columnName="Base price"
          keyName="Variant Price"
        />
      ),
      'Compare-at price': (
        <UniversalTextCol
          changeValUi={changeValUi}
          item={item}
          columnName="Compare-at price"
          keyName="Variant Compare At Price"
        />
      ),
      'Require shipping': (
        <UniversalCheckBox
          item={item}
          columnName="Require shipping"
          checked={item['Require shipping']}
          onClicked={() => ToggleCheck('Require shipping')}
        />
      ),
    };
  };
  return (
    <IndexTable.Row id={item.id} key={item.id} position={item.id}>
      <IndexTable.Cell
        key={item.id + '_Product title'}
        className={`${
          item.id + '_Product title' === editActive ? 'active' : ''
        }`}
      >
        <TitleCol item={item} changeValUi={changeValUi} />
      </IndexTable.Cell>
      {headings
        .filter((item: any) => item.visible)
        .map(({ title }: any) => {
          return (
            <IndexTable.Cell
              key={item.id + '_' + title}
              className={`${
                item.id + '_' + title === editActive ? 'active' : ''
              }`}
            >
              {columns(item)[title]}
            </IndexTable.Cell>
          );
        })}
    </IndexTable.Row>
  );
};
