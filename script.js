let chart;

function run() {

  const budget = Number(document.getElementById("budget").value);
  const age = document.getElementById("age").value;
  const type = document.getElementById("type").value;

  const selectedPlatforms = Array.from(
    document.querySelectorAll(".platforms input:checked")
  ).map(e => e.value);

  if (!budget || !age || !type || selectedPlatforms.length === 0) {
    alert("Please fill all fields and select platforms");
    return;
  }

  const platforms = {
    tiktok: { ctr: 1.6, engRate: 0.08 },
    instagram: { ctr: 1.8, engRate: 0.06 },
    snapchat: { ctr: 1.3, engRate: 0.05 },
    facebook: { ctr: 1.1, engRate: 0.04 },
    linkedin: { ctr: 0.9, engRate: 0.03 }
  };

  const ageBoost = {
    "18-24": 1.2,
    "25-34": 1.0,
    "35-44": 0.8
  };

  const typeBoost = {
    awareness: 0.8,
    traffic: 1.0,
    leads: 1.2,
    sales: 1.5
  };

  let results = [];

  selectedPlatforms.forEach(p => {

    const base = platforms[p];

    const noise = 0.85 + Math.random() * 0.3;

    const ctr =
      base.ctr *
      ageBoost[age] *
      typeBoost[type] *
      noise;

    const impressions =
      (budget / selectedPlatforms.length) *
      (900 + Math.random() * 300);

    const clicks = impressions * (ctr / 100);

    const engagement = impressions * base.engRate * noise;

    const leads = clicks * (0.15 + Math.random() * 0.1);

    const conversions = leads * (0.2 + Math.random() * 0.1);

    const revenue = conversions * (18 + Math.random() * 6);

    const roi =
      ((revenue - (budget / selectedPlatforms.length)) /
      (budget / selectedPlatforms.length)) * 100;

    const score =
      ctr +
      (engagement / 1000) +
      leads +
      (roi / 10);

    results.push({
      platform: p,
      ctr,
      engagement,
      leads,
      conversions,
      roi,
      score
    });
  });

  // 🏆 Best platform
  const best = results.reduce((a, b) => a.score > b.score ? a : b);

  document.getElementById("best").innerText =
    "🏆 Best Platform: " + best.platform.toUpperCase();

  document.getElementById("ctr").innerText = best.ctr.toFixed(2) + "%";
  document.getElementById("eng").innerText = Math.round(best.engagement);
  document.getElementById("leads").innerText = Math.round(best.leads);
  document.getElementById("conv").innerText = Math.round(best.conversions);
  document.getElementById("roi").innerText = Math.round(best.roi) + "%";

  // 📊 Chart
  const ctx = document.getElementById("chart");

  if (chart) {
    chart.destroy();
    chart = null;
  }

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: results.map(r => r.platform),
      datasets: [
        {
          label: "CTR",
          data: results.map(r => r.ctr.toFixed(2))
        },
        {
          label: "Engagement",
          data: results.map(r => Math.round(r.engagement))
        },
        {
          label: "Leads",
          data: results.map(r => Math.round(r.leads))
        },
        {
          label: "Conversions",
          data: results.map(r => Math.round(r.conversions))
        }
      ]
    }
  });

  // 🤖 AI REPORT
  const report = generateAIReport(results);

  let reportBox = document.getElementById("aiReport");

  if (!reportBox) {
    reportBox = document.createElement("div");
    reportBox.id = "aiReport";
    reportBox.style.marginTop = "20px";
    reportBox.style.padding = "15px";
    reportBox.style.background = "#111827";
    reportBox.style.borderRadius = "10px";
    reportBox.style.whiteSpace = "pre-line";
    reportBox.style.lineHeight = "1.6";
    document.querySelector(".main").appendChild(reportBox);
  }

  reportBox.innerText = report;
}


// 🧠 AI Recommendation Engine
function generateAIReport(results) {

  const sorted = [...results].sort((a, b) => b.score - a.score);

  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  const totalLeads = results.reduce((s, r) => s + r.leads, 0);
  const totalConv = results.reduce((s, r) => s + r.conversions, 0);
  const avgROI = results.reduce((s, r) => s + r.roi, 0) / results.length;

  let insight = "";

  switch (best.platform) {
    case "tiktok":
      insight = "TikTok is dominating due to high engagement and viral potential among younger audiences.";
      break;
    case "instagram":
      insight = "Instagram shows the strongest balance between reach, CTR, and conversions.";
      break;
    case "snapchat":
      insight = "Snapchat performs well for fast attention campaigns with moderate conversions.";
      break;
    case "facebook":
      insight = "Facebook delivers stable but lower engagement, suitable for broad targeting.";
      break;
    case "linkedin":
      insight = "LinkedIn generates high-quality B2B leads with strong conversion value.";
      break;
    default:
      insight = best.platform + " is the top-performing platform in this setup.";
  }

  return `
📊 AI Campaign Intelligence Report

🏆 Best Platform: ${best.platform.toUpperCase()}
📉 Weakest Platform: ${worst.platform.toUpperCase()}

🧠 Analysis:
${insight}

📈 Summary:
- Total Leads: ${Math.round(totalLeads)}
- Total Conversions: ${Math.round(totalConv)}
- Average ROI: ${avgROI.toFixed(2)}%

🎯 Recommendation:
Focus budget on ${best.platform.toUpperCase()} while keeping secondary platforms active for diversification.

⚡ Optimization Insight:
Improve creatives and targeting on weaker platforms to increase CTR and reduce acquisition cost.

🚀 Final Verdict:
Campaign performance is efficient with clear dominance from ${best.platform.toUpperCase()}.
`;
}


// 📁 Excel Export
function exportToExcel() {

  const selectedPlatforms = Array.from(
    document.querySelectorAll(".platforms input:checked")
  ).map(e => e.value);

  const platforms = {
    tiktok: { ctr: 1.6, engRate: 0.08 },
    instagram: { ctr: 1.8, engRate: 0.06 },
    snapchat: { ctr: 1.3, engRate: 0.05 },
    facebook: { ctr: 1.1, engRate: 0.04 },
    linkedin: { ctr: 0.9, engRate: 0.03 }
  };

  const age = document.getElementById("age").value;
  const type = document.getElementById("type").value;
  const budget = Number(document.getElementById("budget").value);

  const ageBoost = {
    "18-24": 1.2,
    "25-34": 1.0,
    "35-44": 0.8
  };

  const typeBoost = {
    awareness: 0.8,
    traffic: 1.0,
    leads: 1.2,
    sales: 1.5
  };

  let exportData = [];

  selectedPlatforms.forEach(p => {

    const base = platforms[p];
    const noise = 0.85 + Math.random() * 0.3;

    const ctr =
      base.ctr *
      ageBoost[age] *
      typeBoost[type] *
      noise;

    const impressions =
      (budget / selectedPlatforms.length) *
      (900 + Math.random() * 300);

    const clicks = impressions * (ctr / 100);

    const engagement = impressions * base.engRate * noise;

    const leads = clicks * 0.2;
    const conversions = leads * 0.3;

    const revenue = conversions * 20;

    const roi =
      ((revenue - (budget / selectedPlatforms.length)) /
      (budget / selectedPlatforms.length)) * 100;

    exportData.push({
      Platform: p,
      CTR: ctr.toFixed(2) + "%",
      Engagement: Math.round(engagement),
      Leads: Math.round(leads),
      Conversions: Math.round(conversions),
      ROI: Math.round(roi) + "%"
    });
  });

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Campaign Report");

  XLSX.writeFile(wb, "Campaign_AI_Report.xlsx");
}