import {
  Autocomplete,
  Badge,
  HorizontalStack,
  LegacyStack,
  Tag,
} from '@shopify/polaris';
import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import { MyContext } from '../../dataset/MyContext';
import { getList } from '../../dataset/initialData';
import { isActiveCell, noRef } from '../../utility/globalFunctions';
interface propsType {
  item: any;
  changeValUi: (val1: any, val2: any) => any;
}
const TagCol = ({ item, changeValUi }: propsType) => {
  const {
    centralState: { products, editActive },
    makeEditActive,
  } = useContext(MyContext);

  const selectedOptions = item['Tags']
    .split(',')
    .map((item: string) => item.trim());

  const getAllTags = useCallback(() => {
    const allTags: string[] = [];
    getList('Tags', products).forEach((type: string) => {
      type
        .split(',')
        .map((item: string) => item.trim())
        .forEach((newTag: string) => {
          if (!allTags.includes(newTag)) allTags.push(newTag);
        });
    });
    return allTags;
  }, []);

  const deselectedOptions = useMemo(
    () =>
      getAllTags().map((item: string) => {
        return { value: item, label: item };
      }),
    []
  );

  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(deselectedOptions);

  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);
      if (value === '') {
        setOptions(deselectedOptions);
        return;
      }
      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedOptions.filter((option: any) =>
        option.label.match(filterRegex)
      );
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const removeTag = (tag: string) => () => {
    const options = [...selectedOptions];
    options.splice(options.indexOf(tag), 1);
    changeValUi(options.join(','), 'Tags');
  };

  const addTag = (e: any) => {
    let arr = noRef(selectedOptions);
    if (e.target.value && !arr.includes(e.target.value)) {
      arr.push(e.target.value);
      changeValUi(arr.join(','), 'Tags');
    }
    setInputValue('');
  };

  const textField = isActiveCell(item.id, 'Tags', editActive) ? (
    <Autocomplete.TextField
      borderless
      placeholder="Add Tags"
      onChange={updateText}
      onBlur={addTag}
      label={false}
      value={inputValue}
      autoComplete="off"
    />
  ) : (
    <></>
  );
  if (item.Title === '') return <Badge></Badge>;
  const hasSelectedOptions =
    selectedOptions.filter((item: string) => item).length > 0;
  const tagsMarkup = selectedOptions.map((option: string) => {
    let tagLabel = '';
    tagLabel = option.replace('_', ' ');
    tagLabel = titleCase(tagLabel);
    return (
      <Tag key={`option${option}`} onRemove={removeTag(option)}>
        {tagLabel}
      </Tag>
    );
  });

  const selectedTagMarkup = hasSelectedOptions && (
    <LegacyStack spacing="extraTight">{tagsMarkup}</LegacyStack>
  );

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        makeEditActive(item.id, 'Tags');
      }}
      className="full_cover"
    >
      <HorizontalStack gap={'1_5-experimental'}>
        <LegacyStack vertical>
          {selectedTagMarkup}
          <Autocomplete
            allowMultiple
            options={options}
            selected={selectedOptions}
            textField={textField}
            onSelect={(arr: string[]) => {
              setInputValue('');
              changeValUi(arr.join(','), 'Tags');
            }}
          />
        </LegacyStack>
      </HorizontalStack>
    </div>
  );
};

export default memo(TagCol);

function titleCase(string: string) {
  return string
    .toLowerCase()
    .split(' ')
    .map((word) => {
      return word.replace(word[0], word[0]?.toUpperCase());
    })
    .join(' ');
}
