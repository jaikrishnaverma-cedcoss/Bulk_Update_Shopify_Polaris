import { Autocomplete, Badge, Button, HorizontalStack } from '@shopify/polaris';
import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import { SortAscendingMajor } from '@shopify/polaris-icons';
import { MyContext } from '../../dataset/MyContext';
import { colPropType, productsTypes } from '../../Types/types';
import { getList } from '../../dataset/initialData';
import { noRef } from '../../utility/globalFunctions';
interface propsType extends colPropType {
  item: productsTypes;
  columnName: string;
  keyName: string;
}
type Section = {
  title: string;
  options: {
    value: string;
    label: string;
  }[];
};
const UniversalCol = ({
  item,
  columnName,
  keyName,
  changeValUi,
}: propsType) => {
  const { makeEditActive } = useContext(MyContext);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const deselectedOptions = useMemo(
    (): Section[] => [
      {
        title: 'Suggestion',
        options: getList(keyName).map((type: string) => {
          return { value: type.toLocaleLowerCase(), label: type };
        }),
      },
    ],
    []
  );

  const [options, setOptions] = useState(noRef(deselectedOptions));

  const updateText = useCallback(
    (value: string) => {
      changeHandler(value);

      if (value === '') {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions: Section[] = [];
      deselectedOptions.forEach((opt) => {
        const options = opt.options.filter((option) =>
          option.label.match(filterRegex)
        );
        resultOptions.push({
          title: opt.title,
          options,
        });
      });
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );
  const updateSelection = useCallback(
    (selected: string[]) => {
      let selectedValue: string | undefined;
      options.forEach(({ options }: any) => {
        if (selectedValue) {
          return;
        }
        const matchedOption = options.find((option: any) =>
          option.value.match(selected[0])
        );
        if (matchedOption) {
          selectedValue = matchedOption.label;
        }
      });
      setSelectedOptions(selected);
      changeHandler(selectedValue ? selectedValue : '');
    },
    [options]
  );

  if (item.Title === '') return <Badge></Badge>;

  const changeHandler = (val: string) => {
    changeValUi(val, keyName);
  };

  const textField = (
    <HorizontalStack gap="1" wrap={false}>
      <Autocomplete.TextField
        onChange={updateText}
        label={false}
        borderless
        value={item[keyName]}
        autoComplete="off"
      />
      <Button onClick={() => {}} plain icon={SortAscendingMajor}></Button>
    </HorizontalStack>
  );

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        makeEditActive(item.id, columnName);
      }}
      className="full_cover"
      key={item.id + '_' + keyName + columnName}
    >
      <Autocomplete
        textField={textField}
        selected={selectedOptions}
        options={options}
        onSelect={updateSelection}
      />
    </div>
  );
};

export default memo(UniversalCol);
