import { Box, CircularProgress, Fade, Typography } from "@mui/material";

function Loading({ name }: { name: string }) {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="rgba(255, 255, 255, 0.8)"
      zIndex={9999}
    >
      <Fade in timeout={100}>
        <Box
          zIndex={9999}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <CircularProgress size={70} thickness={5} sx={{ zIndex: 9999 }} />
          <Typography mt={2} fontSize={22} fontWeight="bold">
            Loading {name}...
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
}

export default Loading;
