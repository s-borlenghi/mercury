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
    <section className="mrc-hero">
      <div className="mrc-hero-label">Saldo totale</div>
      <div className={"mrc-hero-value " + (balance < 0 ? "neg" : "pos")}>
        {formatMoney(animated)}
      </div>
      <div className="mrc-hero-meta">
        {count} movimenti · salvati sul dispositivo
      </div>
    </section>
  );
}
