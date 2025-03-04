import { Box, Typography } from "@mui/material";
import { SentimentDissatisfied } from "@mui/icons-material";

interface EmptyDisplayProps {
  type: string;
  icon?: React.ReactNode;
}

export default function EmptyDisplay({
  type,
  icon = <SentimentDissatisfied sx={{ fontSize: 60, color: "gray" }} />,
}: EmptyDisplayProps) {
  const message = `No ${type} data available.`;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        textAlign: "center",
        bgcolor: "light-gray", // Light gray background
        borderRadius: 2,
        p: 3,
      }}
    >
      {icon}
      <Typography fontSize={20} sx={{ mt: 2, color: "gray" }}>
        {message}
      </Typography>
    </Box>
  );
}
