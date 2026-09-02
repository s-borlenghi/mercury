import { useCountUp } from "../hooks/useCountUp.js";
import { useSettings } from "../context/Settings.jsx";

export default function Hero({ balance, count }) {
  const animated = useCountUp(balance);
  const { formatMoney } = useSettings();

  return (
    <section className="sld-hero">
      <div className="sld-hero-label">Saldo totale</div>
      <div className={"sld-hero-value " + (balance < 0 ? "neg" : "pos")}>
        {formatMoney(animated)}
      </div>
      <div className="sld-hero-meta">
        {count} movimenti · aggiornato in tempo reale
      </div>
    </section>
  );
}
