import {
  ButtonGroup,
  FullscreenBar,
  Button,
  Text,
  Popover,
  LegacyCard,
  OptionList,
} from '@shopify/polaris';
import { Columns3Major } from '@shopify/polaris-icons';
import { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../dataset/MyContext';

export function HeaderFull({ headings, setHeadings }: any) {
  let { centralState, saveUpdates } = useContext(MyContext);
  const { selected } = centralState;
  const [saveEnable, setSaveEnable] = useState(true);
  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const navigate = useNavigate();
  const handleActionClick = () => {
    navigate(-1);
  };

  const activator = (
    <Button
      onClick={togglePopoverActive}
      icon={Columns3Major}
      plain
      monochrome
      removeUnderline
    >
      Columns
    </Button>
  );
  const changeHandler = (arr: string[]) => {
    setHeadings((prev: any) => {
      return prev.map((item: any) => {
        return {
          ...item,
          visible: arr.includes(item.title),
        };
      });
    });
  };
  const fullscreenBarMarkup = (
    <div style={{ position: 'sticky', zIndex: '99999', top: '0px' }}>
      <FullscreenBar onAction={handleActionClick}>
        <div
          style={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: '1rem',
            paddingRight: '1rem',
          }}
        >
          <div style={{ marginLeft: '1rem', flexGrow: 1 }}>
            <Text variant="headingSm" as="p">
              Editing {selected.length} products
            </Text>
          </div>
          <ButtonGroup spacing="loose">
            <Popover
              active={popoverActive}
              activator={activator}
              autofocusTarget="first-node"
              onClose={togglePopoverActive}
            >
              <LegacyCard>
                <OptionList
                  title="Manage sales channels availability"
                  onChange={changeHandler}
                  options={headings.map((ele: any) => {
                    return {
                      value: ele.title,
                      label: ele.title,
                    };
                  })}
                  selected={headings
                    .filter((item: any) => item.visible)
                    .map((item: any) => item.title)}
                  allowMultiple
                />
              </LegacyCard>
            </Popover>
            <Button
              primary
              disabled={!saveEnable}
              onClick={saveUpdates}
              size="slim"
            >
              Save
            </Button>
          </ButtonGroup>
        </div>
      </FullscreenBar>
    </div>
  );

  return <>{fullscreenBarMarkup}</>;
}
