import React, { useState, useCallback } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import routes from "routes.js";

// Chakra imports
import { Box, useColorModeValue } from "@chakra-ui/react";

// Layout components
import { SidebarContext } from "contexts/SidebarContext";

export default function Auth() {
  // States and functions
  const [toggleSidebar, setToggleSidebar] = useState(false);

  // Function to determine if the route is full-screen maps
  const isFullScreenMapRoute = useCallback(() => window.location.pathname !== "/auth/full-screen-maps", []);

  // Function to get the routes
  const getRoutes = useCallback((routes) => {
    return routes.flatMap((prop, key) => {
      if (prop.layout === "/auth") {
        return <Route path={prop.layout + prop.path} component={prop.component} key={key} />;
      }
      if (prop.collapse) {
        return getRoutes(prop.items);
      }
      if (prop.category) {
        return getRoutes(prop.items);
      }
      return [];
    });
  }, []);

  const authBg = useColorModeValue("white", "navy.900");

  document.documentElement.dir = "ltr";

  return (
    <Box>
      <SidebarContext.Provider value={{ toggleSidebar, setToggleSidebar }}>
        <Box
          bg={authBg}
          float="right"
          minHeight="100vh"
          height="100%"
          position="relative"
          w="100%"
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          {isFullScreenMapRoute() && (
            <Box mx="auto" minH="100vh">
              <Switch>
                {getRoutes(routes)}
                <Redirect from="/auth" to="/auth/sign-in/default" />
              </Switch>
            </Box>
          )}
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
