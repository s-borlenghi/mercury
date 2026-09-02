import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCountUp } from "../hooks/useCountUp";
import { useSettings } from "../context/Settings";

interface HeroProps {
  balance: number;
  count: number;
}

export default function Hero({ balance, count }: HeroProps) {
  const animated = useCountUp(balance);
  const { formatMoney } = useSettings();

  return (
    <Box sx={{ py: { xs: 1.5, sm: 3 }, pb: 3.5 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Total Balance
      </Typography>
      <Typography
        component="div"
        sx={{
          fontFamily: 'Fraunces, Georgia, "Times New Roman", serif',
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.01em",
          fontWeight: 500,
          fontSize: "clamp(42px, 7vw, 66px)",
          lineHeight: 1,
          color: balance < 0 ? "secondary.main" : "text.primary",
        }}
      >
        {formatMoney(animated)}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
        {count} transactions · saved locally
      </Typography>
    </Box>
  );
}
