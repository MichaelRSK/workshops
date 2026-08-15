// useState holds the refresh counter that ties the form and the list
// together. useCallback keeps the handler identity stable between renders.
import { useCallback, useState } from "react";

import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
} from "@mui/material";

import NoticeForm from "./components/NoticeForm";
import NoticeList from "./components/NoticeList";

function App() {
  // Bumped after every successful create or delete. NoticeList watches this
  // number and refetches when it changes.
  //
  // A counter rather than a boolean, because two creates in a row have to
  // register as two separate changes. A boolean flipped back and forth
  // would work by accident and break the moment anything else touched it.
  const [refreshKey, setRefreshKey] = useState(0);

  // Uses the updater form, so it is always incrementing the current value
  // rather than one captured when this render happened. That matters when a
  // create and a delete finish at almost the same moment.
  //
  // useCallback keeps this the same function across renders, which means
  // passing it down does not give NoticeList a new prop every time App
  // re-renders.
  const handleChanged = useCallback(() => {
    setRefreshKey((previous) => previous + 1);
  }, []);

  return (
    // CssBaseline applies MUI's own resets, which is what makes the page
    // use the theme's background and typography instead of the browser
    // defaults. It has to be inside the app rather than in index.css so it
    // stays in step with the theme.
    <>
      <CssBaseline />

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="h1">
            Notice Board
          </Typography>
        </Toolbar>
      </AppBar>

      {/* maxWidth sm keeps the column narrow enough to read comfortably on
          a wide monitor. The notices are short text, so a full width page
          would stretch each one into a single long line. */}
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <NoticeForm onCreated={handleChanged} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Notices
          </Typography>

          <NoticeList refreshKey={refreshKey} onDeleted={handleChanged} />
        </Box>
      </Container>
    </>
  );
}

export default App;
