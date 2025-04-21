
import React, { useState, useEffect } from "react";

const formatEuro = (value: number) =>
  value.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });

const Index = () => {
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [shootingHours, setShootingHours] = useState<number>(0);
  const [postProdHours, setPostProdHours] = useState<number>(0);
  const [extraFees, setExtraFees] = useState<number>(0);
  const [urssafPct, setUrssafPct] = useState<number>(0);
  const [vatPct, setVatPct] = useState<number | null>(null);

  const [totalBrut, setTotalBrut] = useState<number>(0);
  const [chargesUrssaf, setChargesUrssaf] = useState<number>(0);
  const [totalNet, setTotalNet] = useState<number>(0);
  const [vatAmount, setVatAmount] = useState<number>(0);
  const [totalTTC, setTotalTTC] = useState<number>(0);

  useEffect(() => {
    // Calculate total brut
    const brut = (shootingHours + postProdHours) * hourlyRate + extraFees;
    setTotalBrut(brut);

    // Calculate charges URSSAF
    const charges = (urssafPct / 100) * brut;
    setChargesUrssaf(charges);

    // Calculate total net
    const net = brut - charges;
    setTotalNet(net);

    // Calculate VAT (optional)
    const vatCalc = vatPct ? (vatPct / 100) * brut : 0;
    setVatAmount(vatCalc);

    // Calculate total TTC
    const ttc = brut + vatCalc;
    setTotalTTC(ttc);
  }, [hourlyRate, shootingHours, postProdHours, extraFees, urssafPct, vatPct]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-center text-primary-foreground max-w-xl mx-auto border-b border-primary pb-2">
          Agent Photo – Roland Macri E.I
        </h1>
      </header>

      <main className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <form className="space-y-5">
          <div>
            <label htmlFor="hourlyRate" className="block font-semibold mb-1">
              Taux horaire (€)
            </label>
            <input
              id="hourlyRate"
              type="number"
              step="0.01"
              min="0"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
              className="input"
              placeholder="Ex: 50"
            />
          </div>

          <div>
            <label htmlFor="shootingHours" className="block font-semibold mb-1">
              Heures de prise de vue
            </label>
            <input
              id="shootingHours"
              type="number"
              step="0.1"
              min="0"
              value={shootingHours}
              onChange={(e) => setShootingHours(parseFloat(e.target.value) || 0)}
              className="input"
              placeholder="Ex: 5"
            />
          </div>

          <div>
            <label htmlFor="postProdHours" className="block font-semibold mb-1">
              Heures de post-production
            </label>
            <input
              id="postProdHours"
              type="number"
              step="0.1"
              min="0"
              value={postProdHours}
              onChange={(e) => setPostProdHours(parseFloat(e.target.value) || 0)}
              className="input"
              placeholder="Ex: 3"
            />
          </div>

          <div>
            <label htmlFor="extraFees" className="block font-semibold mb-1">
              Frais annexes (€)
            </label>
            <input
              id="extraFees"
              type="number"
              step="0.01"
              min="0"
              value={extraFees}
              onChange={(e) => setExtraFees(parseFloat(e.target.value) || 0)}
              className="input"
              placeholder="Ex: 20"
            />
          </div>

          <div>
            <label htmlFor="urssafPct" className="block font-semibold mb-1">
              Pourcentage de charges URSSAF (%)
            </label>
            <input
              id="urssafPct"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={urssafPct}
              onChange={(e) => {
                let val = parseFloat(e.target.value);
                if (isNaN(val) || val < 0) val = 0;
                if (val > 100) val = 100;
                setUrssafPct(val);
              }}
              className="input"
              placeholder="Ex: 25"
            />
          </div>

          <div>
            <label htmlFor="vatPct" className="block font-semibold mb-1">
              TVA optionnelle (%)
            </label>
            <input
              id="vatPct"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={vatPct ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") setVatPct(null);
                else {
                  let num = parseFloat(val);
                  if (isNaN(num) || num < 0) num = 0;
                  if (num > 100) num = 100;
                  setVatPct(num);
                }
              }}
              className="input"
              placeholder="Ex: 20"
            />
          </div>
        </form>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-bold border-b pb-2 text-primary-foreground">Résultats</h2>
          <div className="flex justify-between text-gray-700">
            <span>Total Brut</span>
            <span>{formatEuro(totalBrut)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Charges URSSAF</span>
            <span>{formatEuro(chargesUrssaf)}</span>
          </div>
          <div className="flex justify-between text-gray-700 font-semibold">
            <span>Total Net</span>
            <span>{formatEuro(totalNet)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>TVA</span>
            <span>{vatPct !== null ? formatEuro(vatAmount) : "N/A"}</span>
          </div>
          <div className="flex justify-between text-gray-800 font-bold text-lg border-t pt-2">
            <span>Total TTC</span>
            <span>{formatEuro(totalTTC)}</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;

