import {
  AppProvider,
  Frame,
  Layout,
  LegacyCard,
  Navigation,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
  Loading,
  TopBar,
  Page,
} from '@shopify/polaris';
import React, { useCallback, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { panelChildren } from '../routes/Routers';
import { HeadingFormat } from '../utility/globalFunctions';
const logo = {
  width: 124,
  topBarSource:
    'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-color.svg?6215648040070010999',
  contextualSaveBarSource:
    'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-gray.svg?6215648040070010999',
  url: '#',
  accessibilityLabel: 'JAI',
};
const Panel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const navigate = useNavigate();
  const topBarMarkup = <TopBar showNavigationToggle />;
  const toggleIsLoading = useCallback((path: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(path);
    }, 300);
  }, []);
  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive
      ),
    []
  );
  const location = useLocation();
  const navigationMarkup = (
    <Navigation location={location.pathname}>
      <Navigation.Section
        title="Features"
        items={panelChildren
          .filter((item) => item.inNav)
          .map((item) => {
            return {
              selected: '/' + item.path === location.pathname,
              label: HeadingFormat(item.path),
              icon: item.icon,
              onClick: () => toggleIsLoading(item.path),
            };
          })}
      />
    </Navigation>
  );
  const loadingPageMarkup = (
    <SkeletonPage>
      <Layout>
        <Layout.Section>
          <LegacyCard sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={9} />
            </TextContainer>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
  const loadingMarkup = isLoading ? <Loading /> : null;
  const Pages = (
    <Page title={HeadingFormat(location.pathname.split('/')[1])} fullWidth>
      <Outlet />
    </Page>
  );

  const pageMarkup = isLoading ? loadingPageMarkup : Pages;
  return (
    <div>
      <AppProvider
        i18n={{
          Polaris: {
            Avatar: {
              label: 'Avatar',
              labelWithInitials: 'Avatar with initials {initials}',
            },
            ContextualSaveBar: {
              save: 'Save',
              discard: 'Discard',
            },
            TextField: {
              characterCount: '{count} characters',
            },
            TopBar: {
              toggleMenuLabel: 'Toggle menu',

              SearchField: {
                clearButtonLabel: 'Clear',
                search: 'Search',
              },
            },
            Modal: {
              iFrameTitle: 'body markup',
            },
            Frame: {
              skipToContent: 'Skip to content',
              navigationLabel: 'Navigation',
              Navigation: {
                closeMobileNavigationLabel: 'Close navigation',
              },
            },
          },
        }}
      >
        <Frame
          logo={logo}
          topBar={topBarMarkup}
          navigation={navigationMarkup}
          showMobileNavigation={mobileNavigationActive}
          onNavigationDismiss={toggleMobileNavigationActive}
        >
          {loadingMarkup}
          {pageMarkup}
        </Frame>
      </AppProvider>
    </div>
  );
};

export default Panel;
