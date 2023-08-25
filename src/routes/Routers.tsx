import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import { HomeMajor, OrdersMajor } from "@shopify/polaris-icons";
import Panel from "../component/Panel";
import { ContextWraper } from "../dataset/MyContext";
import {Home} from "../component/Home";
import BulkUpdate from "../component/BulkUpdate";

export const panelChildren = [
  {
    path: "",
    element: <Navigate to={"products"} />,
    icon: HomeMajor,
    inNav: false,
  },
  {
    path: "products",
    element: <Home />,
    icon: OrdersMajor,
    inNav: true,
  },
  {
    path: "bulk_update",
    element: <BulkUpdate />,
    icon: OrdersMajor,
    inNav: false,
  },
  {
    path: "*",
    element: <Home />,
    inNav: false,
  },
];

const Routers = () => {
  const router = createBrowserRouter([
    {
      path: "/*",
      element: <Panel />,
      children: panelChildren.map((item) => {
        return { path: item.path, element: item.element };
      }),
    },
    {
      path: "bulk_update",
      element: <BulkUpdate />,
      children: panelChildren.map((item) => {
        return { path: item.path, element: item.element };
      }),
    },
  ]);
  return (
    <AppProvider
      i18n={{
        Polaris: {
          ResourceList: {
            sortingLabel: "Sort by",
            defaultItemSingular: "item",
            defaultItemPlural: "items",
            showing: "Showing {itemsCount} {resource}",
            Item: {
              viewItem: "View details for {itemName}",
            },
          },
          Common: {
            checkbox: "checkbox",
          },
        },
      }}
    >
      <ContextWraper>
        <RouterProvider router={router} />
      </ContextWraper>
    </AppProvider>
  );
};

export default Routers;
